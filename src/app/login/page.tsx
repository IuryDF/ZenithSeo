'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'
import { signIn } from '@/lib/auth'

function LoginContent() {
  const headerScrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    const existingEmail = searchParams.get('existingEmail')
    if (existingEmail) {
      setEmail(existingEmail)
      setInfo('Já existe uma conta com este email. Faça login para continuar.')
    }
  }, [searchParams])

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Validação customizada (mensagens em português)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('Por favor, insira um email válido (ex.: seu@email.com)')
        return
      }
      if (!password) {
        setError('Por favor, informe sua senha')
        return
      }

      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      // Garantir mensagens em português
      const msg = String(err?.message || '').toLowerCase()
      if (msg.includes('invalid login credentials')) setError('Credenciais de login inválidas')
      else if (msg.includes('email not confirmed')) setError('Email não confirmado')
      else if (msg.includes('too many requests')) setError('Muitas tentativas. Tente novamente mais tarde')
      else if (msg.includes('user not found')) setError('Usuário não encontrado')
      else if (msg.includes('invalid email')) setError('Email inválido')
      else if (msg.includes('password')) setError('Senha incorreta')
      else setError('Erro ao fazer login')
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
              {/* Na página de login, mostrar botão para cadastro */}
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
                Cadastrar
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
          {/* Login Card */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 018 17h8a4 4 0 013.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-white">Faça login</h2>
              <p className="mt-2 text-sm text-gray-400">Acesse sua conta para continuar</p>
            </div>

            {info && (
              <div className="mt-6 bg-blue-900/40 border border-blue-700 text-blue-200 px-4 py-3 rounded-md text-sm">
                {info}
              </div>
            )}
            {error && (
              <div className="mt-6 bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleLogin} noValidate>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Sua senha"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/reset-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Esqueceu sua senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Não tem conta?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">Crie sua conta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}> 
      <LoginContent />
    </Suspense>
  )
}