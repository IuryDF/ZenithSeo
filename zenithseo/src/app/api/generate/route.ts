import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import { notifyOpenAICreditsExhausted } from '@/lib/email'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Função para gerar prompts usando OpenAI
async function generatePrompts(niche: string, objective: string, type: string, userPlan: string): Promise<string[]> {
  // Configuração baseada no plano do usuário
  const modelConfig = {
    free: {
      model: "gpt-4o-mini",
      maxTokens: 1500,
      temperature: 0.6,
      variations: 3
    },
    pro: {
      model: "gpt-4o",
      maxTokens: 2500,
      temperature: 0.5,
      variations: 5
    }
  }

  const config = modelConfig[userPlan as keyof typeof modelConfig] || modelConfig.free

  // Sistema de prompts ultra-técnicos baseado no plano
  const systemPrompt = userPlan === 'pro' 
    ? `Você é um ESPECIALISTA SÊNIOR em Marketing Digital, SEO Técnico, Copywriting Persuasivo e Estratégia de Conteúdo com 15+ anos de experiência. 

EXPERTISE TÉCNICA:
- SEO Técnico Avançado (Core Web Vitals, Schema Markup, Technical SEO)
- Copywriting Persuasivo (Frameworks AIDA, PAS, Before-After-Bridge)
- Psicologia do Consumidor e Neuromarketing
- Growth Hacking e Conversion Rate Optimization
- Content Marketing Estratégico e Storytelling
- Análise de Dados e Performance Marketing

MISSÃO: Criar prompts ULTRA-TÉCNICOS, IRRETOCÁVEIS e ALTAMENTE PERFORMÁTICOS que gerem resultados excepcionais quando executados por qualquer IA.`
    
    : `Você é um ESPECIALISTA em Marketing Digital e SEO com sólida experiência em criação de conteúdo estratégico.

EXPERTISE:
- SEO e Otimização de Conteúdo
- Copywriting Eficaz
- Marketing de Conteúdo
- Estratégias de Engajamento

MISSÃO: Criar prompts ROBUSTOS e TÉCNICOS que gerem resultados de alta qualidade quando executados por IAs.`

  const userPrompt = userPlan === 'pro'
    ? `BRIEFING ULTRA-TÉCNICO PARA GERAÇÃO DE PROMPTS PROFISSIONAIS:

📊 DADOS DO PROJETO:
• Nicho/Vertical: ${niche}
• Objetivo Estratégico: ${objective}  
• Formato de Conteúdo: ${type}

🎯 ESPECIFICAÇÕES TÉCNICAS OBRIGATÓRIAS:

Para cada prompt, você DEVE incluir:

1. CONTEXTO ESTRATÉGICO DETALHADO
2. PERSONA/AVATAR específico do público-alvo
3. FRAMEWORKS de copywriting aplicáveis (AIDA, PAS, etc.)
4. DIRETRIZES SEO técnicas específicas
5. MÉTRICAS de performance esperadas
6. ESTRUTURA detalhada do conteúdo
7. CALL-TO-ACTIONS estratégicos
8. ELEMENTOS de prova social/autoridade
9. GATILHOS psicológicos aplicáveis
10. DIFERENCIAÇÃO competitiva

🔥 CRITÉRIOS DE EXCELÊNCIA:
- Prompts com 200-300 palavras cada
- Linguagem técnica e profissional
- Instruções ultra-específicas e acionáveis
- Foco em resultados mensuráveis
- Otimização para conversão
- Aplicação de neuromarketing

📈 RESULTADO ESPERADO:
${config.variations} prompts ULTRA-TÉCNICOS que, quando executados por qualquer IA, produzam conteúdo de nível PROFISSIONAL SÊNIOR, com alta taxa de conversão e engajamento.

IMPORTANTE: Retorne APENAS os prompts, um por linha, sem numeração ou formatação adicional.`

    : `BRIEFING TÉCNICO PARA GERAÇÃO DE PROMPTS:

📊 INFORMAÇÕES DO PROJETO:
• Nicho: ${niche}
• Objetivo: ${objective}
• Tipo de Conteúdo: ${type}

🎯 REQUISITOS TÉCNICOS:

Para cada prompt, inclua:
1. Contexto específico do nicho
2. Público-alvo definido
3. Estrutura clara do conteúdo
4. Diretrizes SEO básicas
5. Call-to-action eficaz
6. Elementos de engajamento

📈 CRITÉRIOS DE QUALIDADE:
- Prompts com 150-200 palavras cada
- Instruções claras e específicas
- Foco em resultados práticos
- Otimização para SEO
- Linguagem profissional

RESULTADO: ${config.variations} prompts ROBUSTOS que gerem conteúdo de alta qualidade quando executados por IAs.

Retorne apenas os prompts, um por linha, sem numeração ou formatação adicional.`

  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('Nenhum conteúdo retornado pela OpenAI')
    }

    // Dividir o conteúdo em linhas e filtrar linhas vazias
    const prompts = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, config.variations) // Usar número de variações baseado no plano

    if (prompts.length === 0) {
      throw new Error('Nenhum prompt válido foi gerado')
    }

    return prompts
  } catch (error: any) {
    console.error('Erro ao gerar prompts com OpenAI:', error)
    
    // Verificar se é erro de créditos/quota da OpenAI
    const isQuotaError = error?.code === 'insufficient_quota' || 
        error?.code === 'invalid_api_key' ||
        error?.status === 429 || 
        error?.status === 503 ||
        error?.error?.code === 'insufficient_quota' ||
        error?.error?.code === 'invalid_api_key' ||
        (error?.message && (error.message.includes('insufficient_quota') || error.message.includes('invalid_api_key')))

    if (isQuotaError) {
      console.log('Erro de créditos OpenAI detectado:', error?.code || error?.status || 'API error')
      
      // Estratégia baseada no plano do usuário
      if (userPlan === 'free') {
        // Opção 1 + 2: Bloquear completamente + Forçar upgrade
        throw new Error('UPGRADE_REQUIRED')
      } else if (userPlan === 'pro') {
        // Opção 4: Notificação + Bloqueio
        // Enviar notificação para admin (implementar depois)
        console.log('🚨 Créditos OpenAI esgotados - Notificando admin para usuário Pro')
        await notifyOpenAICreditsExhausted(userPlan, 'user_id_placeholder')
        throw new Error('OPENAI_CREDITS_EXHAUSTED')
      }
    }
    
    throw new Error('Erro ao gerar prompts com IA')
  }
}

// Função de fallback para gerar prompts offline ULTRA-TÉCNICOS
function generateOfflinePrompts(niche: string, objective: string, type: string, userPlan: string = 'free'): string[] {
  
  // Templates ultra-técnicos para plano PRO
  const proTemplates = {
    'artigo-blog': [
      `BRIEFING ULTRA-TÉCNICO: Crie um artigo SEO PREMIUM sobre "${niche}" com foco estratégico em ${objective}. 

ESPECIFICAÇÕES OBRIGATÓRIAS:
• Estrutura: Título H1 otimizado + 8-12 H2s + H3s estratégicos
• Extensão: 2500-3500 palavras com densidade de palavra-chave 1-2%
• SEO Técnico: Meta description 155 chars, URL slug otimizada, schema markup Article
• Copywriting: Framework AIDA + gatilhos de escassez e autoridade
• Público-alvo: Persona detalhada com dores específicas do nicho ${niche}
• CTA estratégico: 3 call-to-actions distribuídos (soft, medium, hard sell)
• Elementos visuais: Sugestões para 5-7 imagens/infográficos com alt-text SEO
• Métricas esperadas: Tempo de permanência 4+ min, taxa de clique 3%+
• Diferenciação: Ângulo único que nenhum concorrente abordou
• Prova social: Incluir 2-3 estudos de caso ou estatísticas relevantes`,

      `PROMPT PROFISSIONAL SÊNIOR: Desenvolva um guia DEFINITIVO sobre ${niche} para ${objective} seguindo metodologia de Growth Content.

FRAMEWORK TÉCNICO OBRIGATÓRIO:
• Pesquisa de palavras-chave: LSI keywords + long-tail variations
• Estrutura de pillar content: Tópico principal + 5-8 subtópicos
• Copywriting avançado: PAS (Problem-Agitate-Solution) + Before/After/Bridge
• UX Writing: Scannable content com bullet points e numbered lists
• Link building interno: 8-12 links internos estratégicos
• Featured snippet optimization: Resposta direta em 40-60 palavras
• Engagement hooks: 3 elementos de curiosidade nos primeiros 100 palavras
• Social proof: Depoimentos, cases ou dados de autoridade
• Conversion optimization: Lead magnets integrados naturalmente
• Performance KPIs: CTR orgânico 5%+, bounce rate <40%`,

      `BRIEFING DE MARKETING DE CONTEÚDO AVANÇADO: Produza um artigo VIRAL sobre ${niche} otimizado para ${objective} usando neuromarketing.

ESPECIFICAÇÕES NEUROLÓGICAS:
• Hook psicológico: Gatilho de curiosidade + gap de informação
• Storytelling estruturado: Jornada do herói aplicada ao nicho
• Cognitive load optimization: Parágrafos 2-3 linhas, frases 15-20 palavras
• Emotional triggers: 5 gatilhos emocionais distribuídos estrategicamente
• Authority building: Citações de 3-5 especialistas reconhecidos
• FOMO integration: Elementos de urgência e escassez naturais
• Social validation: Proof points a cada 300-400 palavras
• Reciprocity principle: Valor gratuito antes de qualquer oferta
• Commitment consistency: Micro-compromissos do leitor
• Métricas de engajamento: Shares 50+, comentários 20+, tempo 5+ min`
    ],
    
    'post-redes-sociais': [
      `ESTRATÉGIA DE SOCIAL MEDIA PROFISSIONAL: Crie um post VIRAL para ${niche} focado em ${objective} usando growth hacking.

FRAMEWORK DE VIRALIZAÇÃO:
• Hook magnético: Primeira linha com padrão de interrupção
• Storytelling em 3 atos: Setup + Conflito + Resolução em 150 palavras
• Psychological triggers: Curiosidade + FOMO + prova social
• Hashtag strategy: 5 hashtags de nicho + 3 trending + 2 branded
• CTA irresistível: Pergunta que gera engajamento + direcionamento
• Visual storytelling: Sugestão de carousel/vídeo complementar
• Timing optimization: Melhor horário para audiência do ${niche}
• Engagement bait: Elemento que força comentários/shares
• Cross-platform adaptation: Versões para Instagram, LinkedIn, TikTok
• KPIs esperados: Reach 10x followers, engagement rate 8%+`,

      `COPYWRITING PARA REDES SOCIAIS PREMIUM: Desenvolva uma sequência de 5 posts sobre ${niche} para ${objective} com storytelling avançado.

ESTRUTURA NARRATIVA PROFISSIONAL:
• Post 1: Problem awareness - Identificação da dor
• Post 2: Problem agitation - Amplificação do problema  
• Post 3: Solution introduction - Apresentação da solução
• Post 4: Social proof - Cases e depoimentos
• Post 5: Call-to-action - Conversão estratégica
• Elementos técnicos: Micro-storytelling, cliffhangers, pattern interrupts
• Psychological hooks: Reciprocidade, autoridade, escassez
• Community building: Elementos que criam senso de pertencimento
• Viral mechanics: Shareability factors integrados
• Conversion funnel: Jornada completa do awareness ao interesse`
    ],

    'email-marketing': [
      `SEQUÊNCIA DE EMAIL MARKETING PROFISSIONAL: Crie um email de conversão PREMIUM para ${niche} focado em ${objective}.

FRAMEWORK DE ALTA CONVERSÃO:
• Subject line: A/B test com 2 opções (curiosidade vs benefício)
• Preview text: Complemento perfeito ao subject (15-20 palavras)
• Personalization: Uso estratégico do nome + dados comportamentais
• Email structure: AIDA + PAS híbrido para máxima conversão
• Copywriting avançado: Storytelling + objeções antecipadas
• Social proof integration: Depoimentos específicos do nicho
• Urgency/scarcity: Elementos de pressão temporal autênticos
• CTA optimization: Botão principal + CTA secundário
• Mobile optimization: Formatação para 80% mobile readers
• Deliverability: Spam score <2, sender reputation protection
• KPIs esperados: Open rate 35%+, click rate 8%+, conversão 3%+`,

      `EMAIL DE NURTURING ULTRA-TÉCNICO: Desenvolva um email educativo sobre ${niche} para ${objective} usando marketing de relacionamento avançado.

ESTRATÉGIA DE RELACIONAMENTO:
• Value-first approach: 80% valor, 20% venda sutil
• Educational content: Mini-curso em formato de email
• Expertise demonstration: Conhecimento técnico específico
• Trust building: Transparência + vulnerabilidade estratégica
• Segmentation triggers: Elementos para segmentar lista
• Behavioral tracking: Links que identificam interesse
• Progressive profiling: Coleta gradual de informações
• Retention optimization: Elementos que reduzem unsubscribe
• Cross-sell preparation: Sementes para ofertas futuras
• Lifetime value focus: Relacionamento de longo prazo`
    ]
  }

  // Templates robustos para plano FREE
  const freeTemplates = {
    'artigo-blog': [
      `PROMPT TÉCNICO: Escreva um artigo SEO otimizado sobre "${niche}" focando em ${objective}.

REQUISITOS TÉCNICOS:
• Estrutura: Título H1 + 5-7 subtítulos H2 + introdução + conclusão
• Extensão: 1500-2000 palavras com boa densidade de palavra-chave
• SEO básico: Meta description, URL amigável, palavras-chave naturais
• Público-alvo: Defina persona específica para ${niche}
• Call-to-action: 2 CTAs estratégicos (meio e final do artigo)
• Elementos visuais: Sugestões para 3-4 imagens relevantes
• Engajamento: Perguntas para estimular comentários
• Valor agregado: Dicas práticas e acionáveis
• Diferenciação: Ângulo único sobre o tema
• Métricas: Foco em tempo de permanência e compartilhamentos`,

      `BRIEFING ROBUSTO: Crie um guia completo sobre ${niche} para ${objective} com foco em resultados práticos.

ESPECIFICAÇÕES:
• Formato: Guia passo a passo numerado e organizado
• Conteúdo: Informações técnicas + exemplos reais
• SEO: Otimização para palavras-chave de cauda longa
• Estrutura: Introdução + 5-8 passos + conclusão + próximos passos
• Copywriting: Linguagem clara e persuasiva
• Autoridade: Citações e referências confiáveis
• Praticidade: Cada passo deve ser acionável
• Engajamento: Elementos interativos e questionamentos
• CTA: Direcionamento claro para próxima ação
• Valor: Solução completa para a dor do público`
    ],

    'post-redes-sociais': [
      `ESTRATÉGIA DE SOCIAL MEDIA: Crie um post engajante sobre ${niche} para ${objective} com alta taxa de interação.

ELEMENTOS OBRIGATÓRIOS:
• Hook inicial: Primeira linha que prende atenção
• Storytelling: Narrativa envolvente em 100-150 palavras
• Valor agregado: Dica prática ou insight relevante
• Hashtags: 8-10 hashtags estratégicas do nicho
• Call-to-action: Pergunta que estimula comentários
• Timing: Melhor horário para o público-alvo
• Visual: Sugestão de imagem ou vídeo complementar
• Engajamento: Elementos que incentivam shares
• Personalidade: Tom de voz consistente com marca
• Métricas: Foco em alcance e engajamento orgânico`,

      `POST TÉCNICO PARA REDES: Desenvolva conteúdo sobre ${niche} focado em ${objective} usando copywriting eficaz.

FRAMEWORK DE CRIAÇÃO:
• Abertura: Gancho psicológico ou estatística impactante
• Desenvolvimento: Problema + solução em formato digestível
• Prova social: Exemplo ou case relevante
• Hashtags: Mix de populares + nicho + branded
• CTA: Direcionamento claro e específico
• Formato: Otimizado para cada plataforma
• Linguagem: Adequada ao público do ${niche}
• Valor: Takeaway claro para o leitor
• Diferenciação: Perspectiva única sobre o tema
• Conversão: Elemento que direciona para próximo passo`
    ]
  }

  // Selecionar templates baseado no plano
  const templates = userPlan === 'pro' ? proTemplates : freeTemplates
  const typeTemplates = templates[type as keyof typeof templates] || templates['artigo-blog']
  
  // Número de variações baseado no plano
  const variations = userPlan === 'pro' ? 5 : 3
  
  return typeTemplates
    .slice(0, variations)
    .map(template => template.replace(/\${niche}/g, niche).replace(/\${objective}/g, objective))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { niche, objective, type, customNiche, targetAudience, companyName, additionalInfo } = body

    // Validação básica
    if (!niche || !objective || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: niche, objective, type' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase com cookies do servidor
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Verificar se o usuário existe e obter dados do plano
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar limite de uso para usuários free
    if (userData.plan === 'free') {
      // Contar prompts totais do usuário (limite por conta)
      const { count, error: countError } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (countError) {
        console.error('Erro ao contar prompts:', countError)
        return NextResponse.json(
          { error: 'Erro interno do servidor' },
          { status: 500 }
        )
      }

      // Verificar se atingiu o limite (3 prompts por conta para free)
      if (count && count >= 3) {
        return NextResponse.json(
          { 
            error: 'Limite de prompts atingido. Faça upgrade para o plano Pro para prompts ilimitados.',
            limitReached: true 
          },
          { status: 429 }
        )
      }
    }

    // Gerar prompts usando OpenAI
    const prompts = await generatePrompts(niche, objective, type, userData.plan)

    // Salvar prompts no banco de dados
    const promptsToInsert = prompts.map((prompt: string) => ({
      user_id: userId,
      niche,
      objective,
      type,
      content: prompt,
    }))

    const { data: savedPrompts, error: saveError } = await supabase
      .from('prompts')
      .insert(promptsToInsert)
      .select()

    if (saveError) {
      console.error('Erro ao salvar prompts:', saveError)
      return NextResponse.json(
        { error: 'Erro ao salvar prompts' },
        { status: 500 }
      )
    }

    // Atualizar contador de uso - usar contagem real da tabela prompts
    // Contar prompts totais após inserção
    const { count: totalPrompts, error: countError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const currentCount = totalPrompts || 0

    // Atualizar tabela usage para manter sincronização
    const { error: usageError } = await supabase
      .from('usage')
      .upsert({
        user_id: userId,
        prompts_generated: currentCount,
        updated_at: new Date().toISOString(),
      })

    if (usageError) {
      console.error('Erro ao atualizar uso:', usageError)
      // Não retorna erro aqui pois os prompts já foram salvos
    }

    return NextResponse.json({
      success: true,
      prompts: savedPrompts,
      usage: {
        current: currentCount,
        limit: userData.plan === 'free' ? 3 : null,
        plan: userData.plan,
      },
    })

  } catch (error) {
    console.error('Erro na API generate:', error)
    
    // Tratamento específico para novos tipos de erro
    if (error instanceof Error) {
      if (error.message === 'UPGRADE_REQUIRED') {
        return NextResponse.json(
          { 
            error: 'Para gerar prompts ilimitados gerador pelo ChatGpt Premium da OpenAI, faça upgrade para o plano Pro!',
            upgradeRequired: true,
            action: 'upgrade',
            benefits: [
              'Prompts ilimitados',
              'ChatGPT pago da OpenAI (mais inteligente)',
              'Respostas mais rápidas e precisas',
              'Suporte prioritário'
            ]
          },
          { status: 402 } // Payment Required
        )
      }
      
      if (error.message === 'OPENAI_CREDITS_EXHAUSTED') {
        return NextResponse.json(
          { 
            error: 'Serviço temporariamente indisponível para manutenção. Nossa equipe foi notificada e está trabalhando para resolver.',
            temporaryUnavailable: true,
            action: 'wait',
            message: 'Tente novamente em alguns minutos.'
          },
          { status: 503 } // Service Unavailable
        )
      }
      
      // Tratamento específico para erros da OpenAI (outros)
      if (error.message.includes('OpenAI')) {
        return NextResponse.json(
          { error: 'Erro ao gerar prompts. Tente novamente.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}