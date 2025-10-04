'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { updatePassword } from '@/lib/auth'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { validatePassword, PasswordValidation } from '@/lib/password-validation'
import { createSupabaseClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const headerScrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Consumir código/tokens do link de recuperação para criar sessão
    const supabase = createSupabaseClient()

    const url = new URL(window.location.href)
    const tokenHash = url.searchParams.get('token_hash')
    const token = url.searchParams.get('token')
    const email = url.searchParams.get('email')
    const type = url.searchParams.get('type')
    const errorParam = url.searchParams.get('error')
    const errorCodeParam = url.searchParams.get('error_code')
    const errorDescriptionParam = url.searchParams.get('error_description')

    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const tokenHashHash = hashParams.get('token_hash')
    const tokenHashAny = tokenHash || tokenHashHash || undefined
    const tokenFromHash = hashParams.get('token')
    const emailFromHash = hashParams.get('email')
    const errorHash = hashParams.get('error')
    const errorCodeHash = hashParams.get('error_code')
    const errorDescriptionHash = hashParams.get('error_description')

    // Se a URL veio com erros do Supabase, mostrar mensagem amigável e não tentar iniciar sessão
    const effectiveError = errorParam || errorHash
    const effectiveErrorCode = errorCodeParam || errorCodeHash
    const effectiveErrorDescription = errorDescriptionParam || errorDescriptionHash
    if (effectiveError || effectiveErrorCode || effectiveErrorDescription) {
      let message = 'Link de recuperação inválido ou expirado. Reenvie pelo login.'
      if (effectiveErrorCode === 'otp_expired') {
        message = 'O link de recuperação expirou. Solicite um novo a partir do login.'
      } else if (effectiveError === 'access_denied') {
        message = 'Acesso negado ao link de recuperação. Abra o link mais recente enviado ao seu email.'
      } else if (effectiveErrorDescription) {
        // Decodificar + em espaços
        message = decodeURIComponent(effectiveErrorDescription.replace(/\+/g, ' '))
      }
      setError(message)
      // Limpar a URL para não manter parâmetros sensíveis/erro
      window.history.replaceState(null, document.title, window.location.pathname)
      return
    }

    async function initSession() {
      try {
        // Caso o link venha com token_hash (fluxo padrão mais recente) via query ou hash
        if (tokenHashAny && (type === 'recovery' || !type)) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHashAny,
            type: 'recovery',
          })
          if (error) throw error
          setSessionReady(true)
          // Limpar parâmetros sensíveis do URL
          window.history.replaceState(null, document.title, window.location.pathname)
          return
        }

        // Suporte a links antigos com token + email
        const tokenAny = token || tokenFromHash
        const emailAny = email || emailFromHash
        if (tokenAny && emailAny && (type === 'recovery' || !type)) {
          const { error } = await supabase.auth.verifyOtp({
            token: tokenAny,
            type: 'recovery',
            email: emailAny,
          })
          if (error) throw error
          setSessionReady(true)
          window.history.replaceState(null, document.title, window.location.pathname)
          return
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          if (error) throw error
          setSessionReady(true)
          window.history.replaceState(null, document.title, window.location.pathname)
          return
        }

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' && session) {
            setSessionReady(true)
          }
        })

        return () => {
          data.subscription.unsubscribe()
        }
      } catch (err: any) {
        console.error('Erro ao validar link de recuperação:', err)
        setError(err?.message || 'Link de recuperação inválido ou expirado. Reenvie pelo login.')
      }
    }

    if (!type || type === 'recovery' || tokenHashAny || token || tokenFromHash || accessToken) {
      void initSession()
    }
  }, [])

  useEffect(() => {
    const el = headerScrollRef.current
    if (!el) return

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
    }

    updateScrollState()
    const onScroll = () => updateScrollState()
    const onResize = () => updateScrollState()
    el.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [headerScrollRef])

  const scrollByDelta = (delta: number) => {
    const el = headerScrollRef.current
    if (!el) return
    try {
      if (typeof el.scrollBy === 'function') {
        el.scrollBy({ left: delta, behavior: 'smooth' } as any)
      } else {
        el.scrollTo({ left: el.scrollLeft + delta, behavior: 'smooth' } as any)
      }
    } catch {
      el.scrollLeft = el.scrollLeft + delta
    }
  }

  const handlePasswordValidation = (validation: PasswordValidation) => {
    setPasswordValidation(validation)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Tentaremos atualizar mesmo sem sessionReady; se o link não tiver sessão válida, o Supabase retornará erro.

    // Pré-checar sessão para evitar erro genérico
    try {
      const supabase = createSupabaseClient()
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData?.session) {
        setError('Sessão de recuperação não encontrada. Abra o link do email novamente.')
        setLoading(false)
        return
      }
    } catch (err) {
      // Se algo falhar ao consultar a sessão, seguimos com as validações abaixo
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError('A senha não atende aos critérios de segurança necessários')
      setLoading(false)
      return
    }

    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      const msg = err?.message || ''
      if (msg.includes('Auth session missing')) {
        setError('Sessão de recuperação não encontrada. Abra o link do email novamente.')
      } else {
        setError(msg || 'Erro ao atualizar senha. Tente abrir o link novamente a partir do email.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              disabled={!canScrollLeft}
              className={`md:hidden text-gray-400 hover:text-white px-2 ${!canScrollLeft ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={() => scrollByDelta(-180)}
              aria-label="Scroll left"
            >
              ←
            </button>
            <div ref={headerScrollRef} className="flex-1 min-w-0 flex items-center space-x-6 overflow-x-auto whitespace-nowrap scrollbar-x w-full md:overflow-x-visible md:whitespace-normal md:pb-0">
              <Logo size="md" showSubtitle={true} linkTo="/" />
            <nav className="flex items-center space-x-6 w-max shrink-0 pr-2">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
            </nav>
            </div>
            <button
              disabled={!canScrollRight}
              className={`md:hidden text-gray-400 hover:text-white px-2 ${!canScrollRight ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={() => scrollByDelta(180)}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Card */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3 1.352 0 2.5.85 2.5 2 0 1.416-1.857 2.458-3.5 4-.977.895-1.5 1.5-1.5 2.5h-2c0-1.74.973-2.89 2.5-4.25 1.32-1.21 2.5-2.13 2.5-3.25 0-.552-.448-1-1-1-1.105 0-2 .895-2 2H12z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Redefinir senha
              </h2>
              <p className="text-gray-400 mb-8">
                Defina uma nova senha para sua conta
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Nova senha
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
                  Confirmar nova senha
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
                {loading ? 'Atualizando...' : 'Atualizar senha'}
              </button>
            </form>

            

            {success && (
              <div className="mt-6 text-center text-green-400">
                Senha atualizada com sucesso! Redirecionando para login...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}