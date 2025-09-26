'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Prompt } from '@/lib/supabase'
import PromptForm from '@/components/PromptForm'
import PromptHistory from '@/components/PromptHistory'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [newPrompts, setNewPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)

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
    }
  }, [user, router])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">ZenithSEO</h1>
              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/billing"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Billing
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Geração */}
            <div className="space-y-6">
              <PromptForm onGenerate={handleGenerate} loading={loading} />
              
              {/* Prompts Recém-Gerados */}
              {newPrompts.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Prompts Recém-Gerados
                  </h2>
                  <div className="space-y-4">
                    {newPrompts.map((prompt, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{prompt.content}</p>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => navigator.clipboard.writeText(prompt.content)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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

            {/* Histórico de Prompts */}
            <PromptHistory prompts={prompts} />
          </div>
        </div>
      </main>
    </div>
  )
}