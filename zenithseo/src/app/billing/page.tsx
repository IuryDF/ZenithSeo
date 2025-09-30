'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface UserData {
  plan: 'free' | 'pro'
  usage?: {
    prompts_generated: number
    limit_reached: boolean
  }
}

export default function BillingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchUserData()
  }, [user, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing?canceled=true`,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Erro ao criar sessão de pagamento')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos recursos Pro imediatamente.')) {
      return
    }

    setCancelLoading(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Assinatura cancelada com sucesso!')
        // Atualizar dados do usuário
        await fetchUserData()
      } else {
        throw new Error(data.error || 'Erro ao cancelar assinatura')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao cancelar assinatura. Tente novamente.')
    } finally {
      setCancelLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Logo size="md" showSubtitle={false} linkTo="/" />
              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/billing"
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30"
                >
                  Billing
                </Link>
                <Link
                  href="/metrics"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Métricas
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              {/* Informações do Plano e Prompts */}
              {userData && (
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2">
                    <span className="text-sm text-gray-300">Plano: </span>
                    <span className={`text-sm font-semibold ${userData.plan === 'pro' ? 'text-purple-400' : 'text-blue-400'}`}>
                      {userData.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2">
                    <span className="text-sm text-gray-300">Prompts: </span>
                    <span className="text-sm font-semibold text-green-400">
                      {userData.plan === 'pro' ? 'Ilimitado' : `${Math.max(0, 3 - (userData.usage?.prompts_generated || 0))}/3`}
                    </span>
                  </div>
                </div>
              )}
              <span className="text-gray-300">Olá, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-24 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Status do Plano Atual */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl mb-8">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              Plano Atual
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {userData?.plan === 'pro' ? 'Pro' : 'Free'}
                </p>
                {userData?.plan === 'free' && userData?.usage && (
                  <p className="text-sm text-gray-300">
                    {Math.max(0, 3 - (userData.usage?.prompts_generated || 0))}/3 prompts restantes
                  </p>
                )}
                {userData?.plan === 'pro' && (
                  <p className="text-sm text-gray-300">
                    Prompts ilimitados
                  </p>
                )}
              </div>
              {userData?.plan === 'free' && (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Processando...' : 'Fazer Upgrade'}
                </button>
              )}
              {userData?.plan === 'pro' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  {cancelLoading ? 'Cancelando...' : 'Cancelar Assinatura'}
                </button>
              )}
            </div>
          </div>

          {/* Comparação de Planos */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg leading-6 font-medium text-white mb-6">
              Comparação de Planos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plano Free */}
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white">Free</h4>
                  <p className="text-3xl font-bold text-white mt-2">R$ 0</p>
                  <p className="text-gray-300">por mês</p>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">3 prompts por conta</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Suporte básico</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Histórico limitado</span>
                  </li>
                </ul>
                {userData?.plan === 'free' && (
                  <div className="mt-6 text-center">
                    <span className="bg-gray-600/50 text-gray-200 px-4 py-2 rounded-lg border border-gray-500">
                      Plano Atual
                    </span>
                  </div>
                )}
              </div>

              {/* Plano Pro */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-xl p-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recomendado
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white">Pro</h4>
                  <p className="text-3xl font-bold text-white mt-2">R$ 29,99</p>
                  <p className="text-gray-300">por mês</p>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Prompts ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Histórico completo</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Recursos avançados</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">API access</span>
                  </li>
                </ul>
                {userData?.plan === 'pro' ? (
                  <div className="mt-6 text-center space-y-3">
                    <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 block">
                      Plano Atual
                    </span>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                      className="w-full bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium text-sm"
                    >
                      {cancelLoading ? 'Cancelando...' : 'Cancelar Assinatura'}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium"
                    >
                      {loading ? 'Processando...' : 'Escolher Pro'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}