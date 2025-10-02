'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import PromptForm from '@/components/PromptForm'
import PromptHistory from '@/components/PromptHistory'
import Logo from '@/components/Logo'
import { Prompt } from '@/lib/supabase'

interface UserData {
  plan: 'free' | 'pro'
  usage?: {
    prompts_generated: number
    limit_reached: boolean
  }
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [newPrompts, setNewPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  // Opções para os selects
  const niches = [
    'E-commerce',
    'Saúde e Bem-estar',
    'Tecnologia',
    'Educação',
    'Finanças',
    'Imobiliário',
    'Alimentação',
    'Moda e Beleza',
    'Viagens',
    'Esportes'
  ]

  const objectives = [
    'Aumentar tráfego orgânico',
    'Melhorar conversões',
    'Gerar leads',
    'Aumentar engajamento',
    'Construir autoridade',
    'Expandir alcance',
    'Educar audiência',
    'Promover produto/serviço'
  ]

  const types = [
    'Artigo de blog',
    'Post para redes sociais',
    'Descrição de produto',
    'Email marketing',
    'Página de vendas',
    'Anúncio pago',
    'Vídeo script',
    'Podcast roteiro'
  ]

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchPrompts()
      fetchUserData()
    }
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

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar prompts:', error)
    }
  }

  const handleGenerate = async (formData: { niche: string; objective: string; type: string }) => {
    setLoading(true)
    setNewPrompts([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewPrompts(data.prompts || [])
        fetchPrompts() // Atualizar histórico
        fetchUserData() // Atualizar dados do usuário
      } else {
        alert(data.error || 'Erro ao gerar prompts')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar prompts. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Logo size="md" showSubtitle={false} linkTo="/" />
              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30"
                >
                  Dashboard
                </Link>
                <Link
                  href="/metrics"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Métricas
                </Link>
                <Link
                  href="/billing"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Billing
                </Link>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Suporte
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Geração */}
            <div className="space-y-6">
              <PromptForm onGenerate={handleGenerate} loading={loading} />
              
              {/* Prompts Recém-Gerados */}
              {newPrompts.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-lg font-medium text-white mb-4">
                    Prompts Recém-Gerados
                  </h2>
                  <div className="space-y-4">
                    {newPrompts.map((prompt, index) => (
                      <div key={index} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{prompt.content}</p>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => navigator.clipboard.writeText(prompt.content)}
                            className="inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-xs font-medium rounded-full text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copiar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Histórico de Prompts - Apenas para usuários Pro */}
            {userData?.plan === 'pro' ? (
              <PromptHistory prompts={prompts} />
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-lg font-medium text-white mb-4">
                  Histórico de Prompts
                </h2>
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">Histórico disponível apenas no plano Pro</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Faça upgrade para acessar o histórico completo dos seus prompts.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/billing"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Fazer Upgrade
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}