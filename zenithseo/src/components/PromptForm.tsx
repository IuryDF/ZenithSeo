'use client'

import { useState } from 'react'

interface PromptFormProps {
  onGenerate: (data: { 
    niche: string; 
    objective: string; 
    type: string;
    customNiche?: string;
    targetAudience?: string;
    companyName?: string;
    additionalInfo?: string;
  }) => void
  loading: boolean
}

export default function PromptForm({ onGenerate, loading }: PromptFormProps) {
  const [formData, setFormData] = useState({
    niche: '',
    objective: '',
    type: '',
    customNiche: '',
    targetAudience: '',
    companyName: '',
    additionalInfo: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.niche && formData.objective && formData.type) {
      onGenerate(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-lg font-medium text-white mb-4">
        Gerar Novos Prompts
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nicho */}
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Nicho
          </label>
          <div className="relative">
            <select
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none cursor-pointer hover:bg-gray-700/90 transition-all duration-200"
            >
              <option value="" className="bg-gray-800 text-gray-400">Selecione um nicho</option>
              <option value="saude" className="bg-gray-800 text-white py-2">🏥 Saúde e Bem-estar</option>
              <option value="tecnologia" className="bg-gray-800 text-white py-2">💻 Tecnologia</option>
              <option value="educacao" className="bg-gray-800 text-white py-2">📚 Educação</option>
              <option value="financas" className="bg-gray-800 text-white py-2">💰 Finanças</option>
              <option value="moda" className="bg-gray-800 text-white py-2">👗 Moda e Beleza</option>
              <option value="alimentacao" className="bg-gray-800 text-white py-2">🍽️ Alimentação</option>
              <option value="viagem" className="bg-gray-800 text-white py-2">✈️ Viagem e Turismo</option>
              <option value="esportes" className="bg-gray-800 text-white py-2">⚽ Esportes</option>
              <option value="entretenimento" className="bg-gray-800 text-white py-2">🎬 Entretenimento</option>
              <option value="negocios" className="bg-gray-800 text-white py-2">💼 Negócios</option>
              <option value="casa" className="bg-gray-800 text-white py-2">🏠 Casa e Decoração</option>
              <option value="automotivo" className="bg-gray-800 text-white py-2">🚗 Automotivo</option>
              <option value="custom" className="bg-gray-800 text-white py-2">✨ Personalizado</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Campo personalizado para nicho */}
        {formData.niche === 'custom' && (
          <div>
            <label htmlFor="customNiche" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Descreva seu nicho
            </label>
            <input
              type="text"
              id="customNiche"
              name="customNiche"
              value={formData.customNiche}
              onChange={handleChange}
              placeholder="Ex: Consultoria em sustentabilidade empresarial"
              className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 hover:bg-gray-700/90 transition-all duration-200"
            />
          </div>
        )}

        {/* Público-alvo */}
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Público-alvo
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="Ex: Empresários de 30-50 anos, interessados em inovação"
            className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 hover:bg-gray-700/90 transition-all duration-200"
          />
        </div>

        {/* Nome da empresa */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Nome da empresa
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Ex: TechSolutions Ltda"
            className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400 hover:bg-gray-700/90 transition-all duration-200"
          />
        </div>

        {/* Objetivo */}
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Objetivo
          </label>
          <div className="relative">
            <select
              id="objective"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white appearance-none cursor-pointer hover:bg-gray-700/90 transition-all duration-200"
            >
              <option value="" className="bg-gray-800 text-gray-400">Selecione um objetivo</option>
              <option value="aumentar-trafego" className="bg-gray-800 text-white py-2">📈 Aumentar Tráfego Orgânico</option>
              <option value="gerar-leads" className="bg-gray-800 text-white py-2">🎯 Gerar Leads</option>
              <option value="aumentar-vendas" className="bg-gray-800 text-white py-2">💸 Aumentar Vendas</option>
              <option value="engajamento" className="bg-gray-800 text-white py-2">❤️ Melhorar Engajamento</option>
              <option value="brand-awareness" className="bg-gray-800 text-white py-2">🌟 Brand Awareness</option>
              <option value="educacao-audiencia" className="bg-gray-800 text-white py-2">🎓 Educar Audiência</option>
              <option value="fidelizacao" className="bg-gray-800 text-white py-2">🤝 Fidelização de Clientes</option>
              <option value="conversao" className="bg-gray-800 text-white py-2">🔄 Aumentar Conversão</option>
              <option value="autoridade" className="bg-gray-800 text-white py-2">👑 Construir Autoridade</option>
              <option value="retencao" className="bg-gray-800 text-white py-2">🔒 Retenção de Usuários</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tipo de Conteúdo */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V1" />
            </svg>
            Tipo de Conteúdo
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white appearance-none cursor-pointer hover:bg-gray-700/90 transition-all duration-200"
            >
              <option value="" className="bg-gray-800 text-gray-400">Selecione o tipo</option>
              <option value="blog-post" className="bg-gray-800 text-white py-2">📝 Blog Post</option>
              <option value="social-media" className="bg-gray-800 text-white py-2">📱 Redes Sociais</option>
              <option value="email-marketing" className="bg-gray-800 text-white py-2">📧 Email Marketing</option>
              <option value="video" className="bg-gray-800 text-white py-2">🎥 Vídeo</option>
              <option value="podcast" className="bg-gray-800 text-white py-2">🎙️ Podcast</option>
              <option value="infografico" className="bg-gray-800 text-white py-2">📊 Infográfico</option>
              <option value="ebook" className="bg-gray-800 text-white py-2">📚 E-book</option>
              <option value="webinar" className="bg-gray-800 text-white py-2">💻 Webinar</option>
              <option value="case-study" className="bg-gray-800 text-white py-2">📋 Case Study</option>
              <option value="landing-page" className="bg-gray-800 text-white py-2">🌐 Landing Page</option>
              <option value="newsletter" className="bg-gray-800 text-white py-2">📰 Newsletter</option>
              <option value="press-release" className="bg-gray-800 text-white py-2">📢 Press Release</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informações adicionais (opcional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={3}
            placeholder="Ex: Valores da empresa, diferenciais, tom de voz desejado..."
            className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 resize-none hover:bg-gray-700/90 transition-all duration-200"
          />
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={loading || !formData.niche || !formData.objective || !formData.type}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando prompt...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Gerar Prompt
            </>
          )}
        </button>
      </form>
    </div>
  )
}