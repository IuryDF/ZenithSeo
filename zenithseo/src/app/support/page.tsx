'use client'

import { useState, useEffect, useRef } from 'react'
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

interface SupportForm {
  type: string
  subject: string
  description: string
  priority: string
  email: string
  name: string
  plan: string
}

export default function SupportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const headerScrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<SupportForm>({
    type: '',
    subject: '',
    description: '',
    priority: '',
    email: '',
    name: '',
    plan: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchUserData()
  }, [user, router])

  useEffect(() => {
    if (user && userData) {
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        plan: userData.plan
      }))
    }
  }, [user, userData])

  // Controle de rolagem do header
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.type || !form.subject || !form.description || !form.name || !form.priority) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setSubmitted(true)
        setForm({
          type: '',
          subject: '',
          description: '',
          priority: '',
          email: user?.email || '',
          name: '',
          plan: userData?.plan || 'free'
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao enviar solicitação')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const supportTypes = [
    { value: 'technical', label: '🔧 Suporte Técnico', description: 'Problemas com funcionalidades, bugs ou erros' },
    { value: 'billing', label: '💳 Questões de Planos/Cobrança', description: 'Dúvidas sobre planos, pagamentos, faturas ou assinaturas' },
    { value: 'feature', label: '💡 Sugestão de Melhoria', description: 'Ideias para novos recursos ou melhorias' },
    { value: 'bug', label: '🐛 Relatar Bug', description: 'Reportar problemas ou comportamentos inesperados' },
    { value: 'account', label: '👤 Problemas de Conta', description: 'Login, senha, dados pessoais' },
    { value: 'general', label: '❓ Dúvida Geral', description: 'Outras questões ou informações' }
  ]

  const priorities = [
    { value: 'low', label: '🟢 Baixa', color: 'text-black' },
    { value: 'medium', label: '🟡 Média', color: 'text-black' },
    { value: 'high', label: '🟠 Alta', color: 'text-black' },
    { value: 'urgent', label: '🔴 Urgente', color: 'text-black' }
  ]

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
          <div className="flex items-center py-4">
            <button
              disabled={!canScrollLeft}
              className={`md:hidden text-gray-400 hover:text-white px-2 ${!canScrollLeft ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={() => scrollByDelta(-180)}
              aria-label="Scroll left"
            >
              ←
            </button>
            <div ref={headerScrollRef} className="flex items-center justify-between space-x-8 overflow-x-scroll whitespace-nowrap scrollbar-x pb-2 md:overflow-x-visible md:whitespace-normal md:pb-0 w-full min-w-0">
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
                  href="/metrics"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Métricas
                </Link>
                <Link
                  href="/planos"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Planos
                </Link>
                <Link
                  href="/support"
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30"
                >
                  Suporte
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center space-x-6">
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
            {/* Seta direita visível no mobile */}
            <div className="flex items-center justify-end md:hidden">
              <button
                disabled={!canScrollRight}
                className={`text-gray-400 hover:text-white px-2 ${!canScrollRight ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                onClick={() => scrollByDelta(180)}
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
            {userData && (
              <div className="md:hidden flex items-center gap-3 px-4 pb-3">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
                  <span className="text-xs text-gray-300">Plano: </span>
                  <span className={`text-xs font-semibold ${userData.plan === 'pro' ? 'text-purple-400' : 'text-blue-400'}`}>
                    {userData.plan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
                  <span className="text-xs text-gray-300">Prompts: </span>
                  <span className="text-xs font-semibold text-green-400">
                    {userData.plan === 'pro' ? 'Ilimitado' : `${Math.max(0, 3 - (userData.usage?.prompts_generated || 0))}/3`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Bloco mobile: chips + email e sair alinhados na mesma linha */}
      <div className="md:hidden flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 gap-3">
        {userData && (
          <div className="flex items-center gap-3">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
              <span className="text-xs text-gray-300">Plano: </span>
              <span className={`text-xs font-semibold ${userData.plan === 'pro' ? 'text-purple-400' : 'text-blue-400'}`}>{userData.plan === 'pro' ? 'Pro' : 'Free'}</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
              <span className="text-xs text-gray-300">Prompts: </span>
              <span className="text-xs font-semibold text-green-400">{userData.plan === 'pro' ? 'Ilimitado' : `${Math.max(0, 3 - (userData.usage?.prompts_generated || 0))}/3`}</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm truncate max-w-[50vw]">Olá, {user.email}</span>
          <button onClick={handleLogout} className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm">Sair</button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto pt-24 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Central de Suporte</h1>
            <p className="text-gray-300">Como podemos ajudar você hoje?</p>
          </div>

          {submitted ? (
            /* Mensagem de Sucesso */
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Solicitação Enviada!</h3>
              <p className="text-gray-300 mb-6">
                Recebemos sua solicitação e nossa equipe entrará em contato em breve.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Enviar Nova Solicitação
              </button>
            </div>
          ) : (
            /* Formulário de Suporte */
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de Solicitação */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Tipo de Solicitação *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {supportTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          form.type === type.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setForm({ ...form, type: type.value })}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={form.type === type.value}
                            onChange={() => setForm({ ...form, type: type.value })}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-white">{type.label}</div>
                            <div className="text-sm text-gray-400">{type.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email de Contato *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                {/* Assunto */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva brevemente o problema ou solicitação"
                    required
                  />
                </div>

                {/* Prioridade */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Prioridade *
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma prioridade</option>
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descreva detalhadamente sua solicitação, incluindo:
• Passos para reproduzir o problema (se aplicável)
• Mensagens de erro (se houver)
• O que você esperava que acontecesse
• Qualquer informação adicional relevante"
                    required
                  />
                </div>

                {/* Botão de Envio */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}