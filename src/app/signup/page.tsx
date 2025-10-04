'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { validatePassword, PasswordValidation } from '@/lib/password-validation'
import Logo from '@/components/Logo'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation | null>(null)
  const router = useRouter()

  const handlePasswordValidation = (validation: PasswordValidation) => {
    setPasswordValidation(validation)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validação de email com mensagem em português
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido (ex.: seu@email.com)')
      setLoading(false)
      return
    }

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    // Validar força da senha
    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError('A senha não atende aos critérios de segurança necessários')
      setLoading(false)
      return
    }

    try {
      // Pré-verificar se já existe conta com este email
      try {
        const resp = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        if (resp.ok) {
          const json = await resp.json()
          if (json.exists) {
            // Redireciona direto para login com aviso
            router.push(`/login?existingEmail=${encodeURIComponent(email)}`)
            return
          }
        }
      } catch (checkErr) {
        // Silencioso: se falhar a verificação, continua com signUp para capturar erro
        console.warn('Falha ao verificar email existente, prosseguindo com cadastro')
      }

      await signUp(email, password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      const message = (err?.message || '').toLowerCase()
      const duplicatePatterns = [
        'already registered',
        'user already exists',
        'already exists',
        'duplicate'
      ]
      const isDuplicateEmail = duplicatePatterns.some(p => message.includes(p))

      if (isDuplicateEmail) {
        // Redirecionar para login e informar que já existe conta com este email
        router.push(`/login?existingEmail=${encodeURIComponent(email)}`)
      } else {
        // Garantir mensagens em português
        if (message.includes('invalid email')) setError('Email inválido')
        else if (message.includes('password')) setError('Senha inválida ou muito fraca')
        else if (message.includes('too many requests')) setError('Muitas tentativas. Tente novamente mais tarde')
        else setError(err.message || 'Erro ao criar conta')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
      }}>
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Conta criada com sucesso!
              </h2>
              <p className="text-gray-400">
                Verifique seu email para confirmar a conta. Redirecionando para o login...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" showSubtitle={true} linkTo="/" />
            <nav className="flex items-center space-x-6 overflow-x-scroll md:overflow-x-hidden whitespace-nowrap scrollbar-x w-max shrink-0 max-w-[70vw] md:max-w-none pr-2 pb-2 md:pb-0">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
                Entrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Signup Card */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Crie sua conta
              </h2>
              <p className="text-gray-400 mb-8">
                Comece a otimizar seu SEO hoje mesmo
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Indicador de força da senha */}
                <div className="mt-2">
                  <PasswordStrengthIndicator 
                    password={password}
                    onValidationChange={handlePasswordValidation}
                    showDetails={true}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !passwordValidation?.isValid || password !== confirmPassword}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <div className="text-xs text-gray-400 text-center">
                Ao criar uma conta, você concorda com nossos termos de serviço e política de privacidade.<br/>
                <strong>Política de senhas:</strong> Senhas devem ter pelo menos 8 caracteres. Quando sua senha atingir o nível "Forte", você já pode prosseguir!
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}