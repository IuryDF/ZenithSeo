'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Logo from '@/components/Logo'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Logo size="md" showSubtitle={true} linkTo="/" />

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <a 
                href="#como-funciona" 
                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-white hover:text-white hover:from-blue-600/20 hover:to-purple-600/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium border border-blue-500/20 hover:border-blue-400/40 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Como funciona
              </a>
              <a 
                href="#por-que-escolher" 
                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-white hover:text-white hover:from-blue-600/20 hover:to-purple-600/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium border border-blue-500/20 hover:border-blue-400/40 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('por-que-escolher')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Por que escolher ZenithSEO?
              </a>
              <a 
                href="#suporte" 
                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-white hover:text-white hover:from-blue-600/20 hover:to-purple-600/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium border border-blue-500/20 hover:border-blue-400/40 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('suporte')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Central de suporte
              </a>
              <a 
                href="#precos" 
                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-white hover:text-white hover:from-blue-600/20 hover:to-purple-600/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium border border-blue-500/20 hover:border-blue-400/40 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Preços
              </a>
            </nav>

            {/* CTA Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm hidden sm:block">Bem-vindo!</span>
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Começar grátis
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo do Hero */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Prompts de IA que<br />
                revolucionam seu{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  SEO
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Gere prompts profissionais de marketing e SEO em segundos. 
                Aumente seu tráfego, engajamento e rankings com IA avançada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Acessar Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                    >
                      🚀 Testar grátis
                    </Link>
                    <Link
                      href="#precos"
                      className="border-2 border-gray-400 text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      Ver planos
                    </Link>
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>3 prompts grátis</span>
                </div>
              </div>
            </div>

            {/* Mockup da Ferramenta */}
            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
                {/* Header do Mockup */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-gray-400 text-sm">ZenithSEO - Gerador de Prompts</div>
                </div>
                
                {/* Interface do Mockup */}
                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-gray-300 text-sm mb-2">Objetivo:</div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-white">
                      Criar artigo de blog sobre "SEO para e-commerce"
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-gray-300 text-sm mb-2">Palavras-chave:</div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-white">
                      SEO e-commerce, otimização loja online, vendas orgânicas
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (user) {
                        window.location.href = '/dashboard';
                      } else {
                        window.location.href = '/login';
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    ✨ Gerar Prompts
                  </button>
                  
                  {/* Resultado Simulado */}
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-4 animate-pulse">
                    <div className="text-blue-300 text-sm mb-2">✅ Prompt Gerado:</div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      "Crie um artigo completo sobre SEO para e-commerce, focando em otimização de produtos, estrutura de URLs, meta descriptions para páginas de categoria..."
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Elementos Decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Três passos simples para transformar suas ideias em prompts profissionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-4">Escolha seu objetivo</h3>
                <p className="text-gray-300 leading-relaxed">
                  Selecione o tipo de conteúdo: artigo de blog, meta description, título SEO, ou campanha completa.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Defina sua estratégia</h3>
                <p className="text-gray-300 leading-relaxed">
                  Insira suas palavras-chave, público-alvo e tom de voz desejado para personalizar o prompt.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-4">Gere e otimize</h3>
                <p className="text-gray-300 leading-relaxed">
                  Receba prompts profissionais otimizados e use em qualquer IA para criar conteúdo que converte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="por-que-escolher" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher ZenithSEO?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Resultados comprovados que transformam seu marketing digital
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">+300% mais tráfego</h3>
              <p className="text-gray-300">
                Prompts otimizados que aumentam significativamente suas visualizações e cliques orgânicos
              </p>
            </div>
            
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Maior engajamento</h3>
              <p className="text-gray-300">
                Conteúdo que conecta com sua audiência e gera mais interações e conversões
              </p>
            </div>
            
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">SEO 10x mais rápido</h3>
              <p className="text-gray-300">
                Economize horas de pesquisa e criação com prompts prontos e testados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Mais de 1.500 profissionais confiam
            </h2>
            <p className="text-xl text-gray-300">
              Veja o que nossos usuários estão dizendo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Aumentei meu tráfego orgânico em 250% em apenas 2 meses usando os prompts do ZenithSEO. Incrível!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  R
                </div>
                <div>
                  <p className="font-semibold text-white">Rafael Mendes</p>
                  <p className="text-sm text-gray-400">Head de Marketing - TechStart</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Economizo 5 horas por semana na criação de conteúdo. Os prompts são precisos e eficazes."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  C
                </div>
                <div>
                  <p className="font-semibold text-white">Carla Rodrigues</p>
                  <p className="text-sm text-gray-400">SEO Manager - E-commerce Plus</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Ferramenta essencial para qualquer profissional de marketing. ROI impressionante!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  L
                </div>
                <div>
                  <p className="font-semibold text-white">Lucas Ferreira</p>
                  <p className="text-sm text-gray-400">Diretor Digital - Growth Agency</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logos das empresas */}
          <div className="text-center">
            <p className="text-gray-400 mb-8">Usado por profissionais de empresas como:</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-500">TechStart</div>
              <div className="text-2xl font-bold text-gray-500">Growth Agency</div>
              <div className="text-2xl font-bold text-gray-500">E-commerce Plus</div>
              <div className="text-2xl font-bold text-gray-500">Digital Pro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Suporte com Abas */}
      <section id="suporte" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Central de Suporte
            </h2>
            <p className="text-xl text-gray-300">
              Encontre respostas rápidas para suas dúvidas
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Abas de Navegação */}
            <div className="flex flex-wrap justify-center mb-8 bg-gray-800/50 rounded-xl p-2">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300">
                FAQ
              </button>
              <button className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium transition-all duration-300">
                Tutoriais
              </button>
              <button className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium transition-all duration-300">
                Contato
              </button>
              <button className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium transition-all duration-300">
                Status
              </button>
            </div>
            
            {/* Conteúdo das Abas - FAQ */}
            <div className="bg-gray-800/60 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Como começar a usar?</h3>
                    <p className="text-gray-300 text-sm">Guia completo para seus primeiros passos na plataforma</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Quantos prompts posso gerar?</h3>
                    <p className="text-gray-300 text-sm">Limites e funcionalidades de cada plano</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Como cancelar minha assinatura?</h3>
                    <p className="text-gray-300 text-sm">Processo simples de cancelamento</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Posso exportar meus prompts?</h3>
                    <p className="text-gray-300 text-sm">Opções de exportação e formatos disponíveis</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Há suporte técnico?</h3>
                    <p className="text-gray-300 text-sm">Canais de atendimento e horários</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-white mb-2">Posso usar para fins comerciais?</h3>
                    <p className="text-gray-300 text-sm">Licenças e termos de uso comercial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Planos que se adaptam ao seu negócio
            </h2>
            <p className="text-xl text-gray-300">
              Comece grátis e escale conforme cresce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Free */}
            <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  R$ 0
                  <span className="text-lg font-normal text-gray-400">/mês</span>
                </div>
                <p className="text-gray-300">Perfeito para começar</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 prompts por conta
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 variações por prompt
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Sem histórico de prompts
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte por email
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="w-full bg-gray-700 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-600 transition-colors text-center block"
              >
                Começar grátis
              </Link>
            </div>
            
            {/* Plano Pro */}
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-purple-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  R$ 29
                  <span className="text-lg font-normal text-gray-400">/mês</span>
                </div>
                <p className="text-gray-300">Para profissionais sérios</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prompts ilimitados
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 variações por prompt
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Histórico completo de prompts
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prompts premium
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte prioritário
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Métricas de performance
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-center block"
              >
                Começar teste grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Logo size="sm" showSubtitle={false} linkTo="/" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Gere prompts de IA otimizados para SEO e impulsione o crescimento do seu negócio online.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Produto</h4>
              <div className="space-y-2">
                <a 
                  href="#como-funciona" 
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Como funciona
                </a>
                <a 
                  href="#precos" 
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Preços
                </a>
              </div>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Suporte</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Central de ajuda
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Contato
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Política de privacidade
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ZenithSEO. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium text-sm transform hover:scale-105"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
