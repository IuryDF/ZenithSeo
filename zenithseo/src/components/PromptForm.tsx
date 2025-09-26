'use client'

import { useState } from 'react'

interface PromptFormProps {
  onGenerate: (data: { niche: string; objective: string; type: string }) => void
  loading: boolean
}

export default function PromptForm({ onGenerate, loading }: PromptFormProps) {
  const [formData, setFormData] = useState({
    niche: '',
    objective: '',
    type: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.niche && formData.objective && formData.type) {
      onGenerate(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Gerar Novos Prompts
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nicho */}
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
            Nicho
          </label>
          <select
            id="niche"
            name="niche"
            value={formData.niche}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um nicho</option>
            <option value="saude">Saúde e Bem-estar</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="educacao">Educação</option>
            <option value="financas">Finanças</option>
            <option value="moda">Moda e Beleza</option>
            <option value="alimentacao">Alimentação</option>
            <option value="viagem">Viagem e Turismo</option>
            <option value="esportes">Esportes</option>
            <option value="entretenimento">Entretenimento</option>
            <option value="negocios">Negócios</option>
            <option value="casa">Casa e Decoração</option>
            <option value="automotivo">Automotivo</option>
          </select>
        </div>

        {/* Objetivo */}
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo
          </label>
          <select
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um objetivo</option>
            <option value="aumentar-trafego">Aumentar Tráfego Orgânico</option>
            <option value="gerar-leads">Gerar Leads</option>
            <option value="aumentar-vendas">Aumentar Vendas</option>
            <option value="engajamento">Melhorar Engajamento</option>
            <option value="brand-awareness">Brand Awareness</option>
            <option value="educacao-audiencia">Educar Audiência</option>
            <option value="fidelizacao">Fidelização de Clientes</option>
            <option value="conversao">Aumentar Conversão</option>
            <option value="autoridade">Construir Autoridade</option>
            <option value="retencao">Retenção de Usuários</option>
          </select>
        </div>

        {/* Tipo de Conteúdo */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Conteúdo
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione o tipo</option>
            <option value="blog-post">Blog Post</option>
            <option value="social-media">Redes Sociais</option>
            <option value="email-marketing">Email Marketing</option>
            <option value="video">Vídeo</option>
            <option value="podcast">Podcast</option>
            <option value="infografico">Infográfico</option>
            <option value="ebook">E-book</option>
            <option value="webinar">Webinar</option>
            <option value="case-study">Case Study</option>
            <option value="landing-page">Landing Page</option>
            <option value="newsletter">Newsletter</option>
            <option value="press-release">Press Release</option>
          </select>
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={loading || !formData.niche || !formData.objective || !formData.type}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando prompts...
            </div>
          ) : (
            'Gerar Prompts'
          )}
        </button>
      </form>
    </div>
  )
}