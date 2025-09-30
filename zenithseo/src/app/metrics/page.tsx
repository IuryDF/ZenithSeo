'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { TrendingUp, TrendingDown, Target, Calendar, Award, Activity, BarChart3, Users, Clock, Zap } from 'lucide-react'

interface MetricsData {
  overview: {
    totalPrompts: number
    promptsThisMonth: number
    monthlyGrowth: number
    dailyAverage: number
  }
  topNiches: Array<{
    name: string
    count: number
    percentage: number
  }>
  recentActivity: Array<{
    date: string
    count: number
  }>
  performance: {
    consistency: string
    mostActiveDay: string | null
    streak: number
  }
}

interface UserData {
  plan: 'free' | 'pro'
  usage?: {
    prompts_generated: number
    limit_reached: boolean
  }
}

export default function MetricsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        
        // Se for plano Pro, buscar métricas
        if (data.plan === 'pro') {
          await fetchMetrics()
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      setError('Erro ao carregar dados do usuário')
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetricsData(data)
      } else if (response.status === 403) {
        setError('Métricas disponíveis apenas no plano Pro')
      } else {
        setError('Erro ao carregar métricas')
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      setError('Erro ao carregar métricas')
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
          successUrl: `${window.location.origin}/metrics?success=true`,
          cancelUrl: `${window.location.origin}/metrics?canceled=true`,
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
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Billing
                </Link>
                <Link
                  href="/metrics"
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30"
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
          {/* Título da Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Métricas de Performance</h1>
            <p className="text-gray-300">Acompanhe suas estatísticas e performance de geração de prompts</p>
          </div>

          {/* Verificação de Plano */}
          {userData?.plan !== 'pro' ? (
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
              <div className="mb-6">
                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Métricas Avançadas</h3>
                <p className="text-gray-300 mb-6">
                  As métricas de performance estão disponíveis apenas no plano Pro. 
                  Faça upgrade para acessar insights detalhados sobre sua produtividade.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                  <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Análise de Performance</h4>
                  <p className="text-gray-400 text-sm">Acompanhe sua produtividade</p>
                </div>
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Relatórios Detalhados</h4>
                  <p className="text-gray-400 text-sm">Insights sobre seus nichos</p>
                </div>
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                  <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Histórico Completo</h4>
                  <p className="text-gray-400 text-sm">Visualize sua evolução</p>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium text-lg"
              >
                {loading ? 'Processando...' : 'Fazer Upgrade para Pro'}
              </button>
            </div>
          ) : (
            <>
              {/* Cards de Overview */}
              {metricsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total de Prompts */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Total de Prompts</p>
                        <p className="text-3xl font-bold text-white">{metricsData.overview.totalPrompts}</p>
                        <p className="text-xs text-gray-400 mt-1">Prompts gerados desde o início</p>
                      </div>
                      <div className="bg-blue-500/20 p-3 rounded-full">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Prompts Este Mês */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Este Mês</p>
                        <p className="text-3xl font-bold text-white">{metricsData.overview.promptsThisMonth}</p>
                        <p className="text-xs text-gray-400 mt-1">Prompts gerados no mês atual</p>
                      </div>
                      <div className="bg-green-500/20 p-3 rounded-full">
                        <Calendar className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </div>

                  {/* Crescimento Mensal */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Crescimento</p>
                        <p className="text-3xl font-bold text-white">
                          {metricsData.overview.monthlyGrowth > 0 ? '+' : ''}{metricsData.overview.monthlyGrowth}%
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Comparado ao mês anterior</p>
                      </div>
                      <div className={`p-3 rounded-full ${metricsData.overview.monthlyGrowth >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {metricsData.overview.monthlyGrowth >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Média Diária */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Média Diária</p>
                        <p className="text-3xl font-bold text-white">{metricsData.overview.dailyAverage}</p>
                        <p className="text-xs text-gray-400 mt-1">Prompts por dia no mês</p>
                      </div>
                      <div className="bg-purple-500/20 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seção de Nichos Mais Usados */}
              {metricsData && metricsData.topNiches.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl mb-8">
                  <div className="mb-6">
                    <h3 className="text-lg leading-6 font-medium text-white mb-2 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Nichos Mais Utilizados
                    </h3>
                    <p className="text-sm text-gray-400">Áreas de negócio onde você mais gera prompts, ordenadas por frequência de uso</p>
                  </div>
                  <div className="space-y-4">
                    {metricsData.topNiches.map((niche, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-yellow-400' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                          }`} />
                          <span className="text-white font-medium">{niche.name}</span>
                          <span className="text-xs text-gray-400">({niche.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-700 rounded-full h-2 w-32">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${niche.percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-sm w-12 text-right">{niche.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção de Performance */}
              {metricsData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Atividade Recente */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="mb-6">
                      <h3 className="text-lg leading-6 font-medium text-white mb-2 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-400" />
                        Atividade dos Últimos 7 Dias
                      </h3>
                      <p className="text-sm text-gray-400">Histórico diário de prompts gerados na última semana</p>
                    </div>
                    {metricsData.recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {metricsData.recentActivity.map((day, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-300">{new Date(day.date).toLocaleDateString('pt-BR')}</span>
                            <div className="flex items-center space-x-2">
                              <div className="bg-gray-700 rounded-full h-2 w-20">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(100, (day.count / Math.max(...metricsData.recentActivity.map(d => d.count))) * 100)}%` }}
                                />
                              </div>
                              <span className="text-white font-medium w-8 text-right">{day.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-8">Nenhuma atividade nos últimos 7 dias</p>
                    )}
                  </div>

                  {/* Indicadores de Performance */}
                  <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                    <div className="mb-6">
                      <h3 className="text-lg leading-6 font-medium text-white mb-2 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-purple-400" />
                        Indicadores de Performance
                      </h3>
                      <p className="text-sm text-gray-400">Métricas que avaliam sua produtividade e consistência</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-300">Consistência</span>
                            <div className="group relative">
                              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Baseada na regularidade de uso
                              </div>
                            </div>
                          </div>
                          <span className={`font-medium ${
                            metricsData.performance.consistency === 'Alta' ? 'text-green-400' :
                            metricsData.performance.consistency === 'Média' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {metricsData.performance.consistency}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-300">Sequência Ativa</span>
                            <div className="group relative">
                              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Dias consecutivos com atividade
                              </div>
                            </div>
                          </div>
                          <span className="text-white font-medium">{metricsData.performance.streak} dias</span>
                        </div>
                      </div>

                      {metricsData.performance.mostActiveDay && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-300">Dia Mais Ativo</span>
                              <div className="group relative">
                                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                  Dia com maior número de prompts
                                </div>
                              </div>
                            </div>
                            <span className="text-white font-medium">
                              {new Date(metricsData.performance.mostActiveDay).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensagem de Erro */}
              {error && (
                <div className="bg-red-900/50 backdrop-blur-md border border-red-700 rounded-2xl p-6 shadow-2xl text-center">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && !metricsData && (
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Carregando métricas...</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}