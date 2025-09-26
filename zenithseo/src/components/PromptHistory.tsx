'use client'

import { useState } from 'react'
import { Prompt } from '@/lib/supabase'

interface PromptHistoryProps {
  prompts: Prompt[]
}

export default function PromptHistory({ prompts }: PromptHistoryProps) {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)

  const toggleExpanded = (promptId: string) => {
    setExpandedPrompt(expandedPrompt === promptId ? null : promptId)
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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Histórico de Prompts
        </h2>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum prompt gerado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece gerando seu primeiro prompt usando o formulário acima.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Histórico de Prompts ({prompts.length})
      </h2>
      
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="border border-gray-200 rounded-lg p-4">
            {/* Header do Prompt */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getNicheLabel(prompt.niche)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getTypeLabel(prompt.type)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(prompt.created_at)}
              </span>
            </div>

            {/* Objetivo */}
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Objetivo:</span> {getObjectiveLabel(prompt.objective)}
            </p>

            {/* Conteúdo do Prompt */}
            <div className="bg-gray-50 rounded-md p-3 mb-3">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
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
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {expandedPrompt === prompt.id ? 'Ver menos' : 'Ver mais'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}