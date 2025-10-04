'use client'

import { useState } from 'react'
import { Prompt } from '@/lib/supabase'

interface PromptHistoryProps {
  prompts: Prompt[]
  onDeleted?: () => void
}

export default function PromptHistory({ prompts, onDeleted }: PromptHistoryProps) {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState<number>(5)

  const toggleExpanded = (promptId: string) => {
    setExpandedPrompt(expandedPrompt === promptId ? null : promptId)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllVisible = () => {
    const visibleIds = prompts.slice(0, visibleCount).map(p => p.id)
    setSelectedIds(new Set(visibleIds))
  }

  const clearSelection = () => setSelectedIds(new Set())

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return
    try {
      const response = await fetch('/api/prompts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        clearSelection()
        onDeleted?.()
      } else {
        alert(data.error || 'Erro ao excluir prompts')
      }
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir prompts. Tente novamente.')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Aqui você poderia adicionar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar texto:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getNicheLabel = (niche: string) => {
    const nicheMap: { [key: string]: string } = {
      'saude': 'Saúde e Bem-estar',
      'tecnologia': 'Tecnologia',
      'educacao': 'Educação',
      'financas': 'Finanças',
      'moda': 'Moda e Beleza',
      'alimentacao': 'Alimentação',
      'viagem': 'Viagem e Turismo',
      'esportes': 'Esportes',
      'entretenimento': 'Entretenimento',
      'negocios': 'Negócios',
      'casa': 'Casa e Decoração',
      'automotivo': 'Automotivo',
    }
    return nicheMap[niche] || niche
  }

  const getObjectiveLabel = (objective: string) => {
    const objectiveMap: { [key: string]: string } = {
      'aumentar-trafego': 'Aumentar Tráfego Orgânico',
      'gerar-leads': 'Gerar Leads',
      'aumentar-vendas': 'Aumentar Vendas',
      'engajamento': 'Melhorar Engajamento',
      'brand-awareness': 'Brand Awareness',
      'educacao-audiencia': 'Educar Audiência',
      'fidelizacao': 'Fidelização de Clientes',
      'conversao': 'Aumentar Conversão',
      'autoridade': 'Construir Autoridade',
      'retencao': 'Retenção de Usuários',
    }
    return objectiveMap[objective] || objective
  }

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'blog-post': 'Blog Post',
      'social-media': 'Redes Sociais',
      'email-marketing': 'Email Marketing',
      'video': 'Vídeo',
      'podcast': 'Podcast',
      'infografico': 'Infográfico',
      'ebook': 'E-book',
      'webinar': 'Webinar',
      'case-study': 'Case Study',
      'landing-page': 'Landing Page',
      'newsletter': 'Newsletter',
      'press-release': 'Press Release',
    }
    return typeMap[type] || type
  }

  if (prompts.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-medium text-white mb-4">
          Histórico de Prompts
        </h2>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">Nenhum prompt gerado</h3>
          <p className="mt-1 text-sm text-gray-400">
            Comece gerando seu primeiro prompt usando o formulário acima.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">Histórico de Prompts ({prompts.length})</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={selectAllVisible}
            className="inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-xs font-medium rounded-lg text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            Selecionar 5 visíveis
          </button>
          <button
            onClick={deleteSelected}
            disabled={selectedIds.size === 0}
            className={`inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-xs font-medium rounded-lg ${selectedIds.size === 0 ? 'text-gray-500 bg-gray-700/30 cursor-not-allowed' : 'text-red-300 bg-gray-700/50 hover:bg-gray-600/50'}`}
          >
            Excluir selecionados
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {prompts.slice(0, visibleCount).map((prompt) => (
          <div key={prompt.id} className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
            {/* Header do Prompt */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(prompt.id)}
                  onChange={() => toggleSelect(prompt.id)}
                  className="mr-2 w-4 h-4 rounded border-gray-500 bg-gray-700"
                />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {getNicheLabel(prompt.niche)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                  {getTypeLabel(prompt.type)}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {formatDate(prompt.created_at)}
              </span>
            </div>

            {/* Objetivo */}
            <p className="text-sm text-gray-300 mb-3">
              <span className="font-medium text-gray-200">Objetivo:</span> {getObjectiveLabel(prompt.objective)}
            </p>

            {/* Conteúdo do Prompt */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-3 border border-gray-600">
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {expandedPrompt === prompt.id 
                  ? prompt.content 
                  : prompt.content.length > 200 
                    ? `${prompt.content.substring(0, 200)}...` 
                    : prompt.content
                }
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(prompt.content)}
                  className="inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-xs font-medium rounded-lg text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar
                </button>
              </div>

              {prompt.content.length > 200 && (
                <button
                  onClick={() => toggleExpanded(prompt.id)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {expandedPrompt === prompt.id ? 'Ver menos' : 'Ver mais'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {prompts.length > visibleCount && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount(c => c + 5)}
            className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-lg text-blue-300 bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  )
}