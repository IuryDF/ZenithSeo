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
  const prompt = `
Você é um especialista em marketing digital e SEO. Gere 5 prompts de alta qualidade para:

Nicho: ${niche}
Objetivo: ${objective}
Tipo de conteúdo: ${type}

Os prompts devem ser:
- Específicos e acionáveis
- Otimizados para SEO
- Relevantes para o nicho escolhido
- Focados no objetivo definido
- Adequados para o tipo de conteúdo solicitado

Retorne apenas os 5 prompts, um por linha, sem numeração ou formatação adicional.
  `.trim()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing digital e criação de conteúdo. Gere prompts de alta qualidade e específicos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
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
      .slice(0, 5) // Garantir que temos no máximo 5 prompts

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

// Função de fallback para gerar prompts offline
function generateOfflinePrompts(niche: string, objective: string, type: string): string[] {
  const templates = {
    'artigo-blog': [
      `Escreva um artigo completo sobre "${niche}" focando em ${objective}. Inclua introdução, desenvolvimento e conclusão com pelo menos 1500 palavras.`,
      `Crie um guia passo a passo sobre ${niche} para ${objective}. Use subtítulos, listas e exemplos práticos.`,
      `Desenvolva um artigo "Como fazer" sobre ${niche} que ajude o leitor a ${objective}. Inclua dicas e estratégias comprovadas.`,
      `Escreva um artigo comparativo sobre diferentes aspectos de ${niche} relacionados a ${objective}. Use dados e estatísticas.`,
      `Crie um artigo de tendências sobre ${niche} focando em ${objective}. Inclua previsões e insights do mercado.`
    ],
    'post-redes-sociais': [
      `Crie um post engajante para redes sociais sobre ${niche} que incentive ${objective}. Use hashtags relevantes e call-to-action.`,
      `Desenvolva uma série de 3 posts sobre ${niche} focando em ${objective}. Cada post deve ter uma abordagem diferente.`,
      `Escreva um post educativo sobre ${niche} que ajude o público a ${objective}. Use linguagem acessível e exemplos.`,
      `Crie um post de dica rápida sobre ${niche} relacionado a ${objective}. Seja direto e prático.`,
      `Desenvolva um post storytelling sobre ${niche} que conecte com ${objective}. Use narrativa envolvente.`
    ],
    'email-marketing': [
      `Escreva um email de boas-vindas para ${niche} focando em ${objective}. Inclua apresentação e próximos passos.`,
      `Crie um email promocional sobre ${niche} que incentive ${objective}. Use urgência e benefícios claros.`,
      `Desenvolva um email educativo sobre ${niche} relacionado a ${objective}. Forneça valor antes de vender.`,
      `Escreva um email de follow-up sobre ${niche} para ${objective}. Seja pessoal e relevante.`,
      `Crie um email de newsletter sobre ${niche} focando em ${objective}. Inclua notícias e insights.`
    ],
    'descricao-produto': [
      `Escreva uma descrição persuasiva de produto para ${niche} focando em ${objective}. Destaque benefícios únicos.`,
      `Crie uma descrição técnica detalhada para produto de ${niche} relacionado a ${objective}. Inclua especificações.`,
      `Desenvolva uma descrição emocional para produto de ${niche} que conecte com ${objective}. Use storytelling.`,
      `Escreva uma descrição comparativa para produto de ${niche} focando em ${objective}. Mostre vantagens competitivas.`,
      `Crie uma descrição orientada a benefícios para produto de ${niche} relacionado a ${objective}. Foque no valor.`
    ],
    'script-video': [
      `Escreva um script de vídeo introdutório sobre ${niche} focando em ${objective}. Duração de 2-3 minutos.`,
      `Crie um script de vídeo tutorial sobre ${niche} para ${objective}. Inclua demonstrações práticas.`,
      `Desenvolva um script de vídeo explicativo sobre ${niche} relacionado a ${objective}. Use linguagem clara.`,
      `Escreva um script de vídeo promocional sobre ${niche} focando em ${objective}. Seja persuasivo e direto.`,
      `Crie um script de vídeo depoimento sobre ${niche} que demonstre ${objective}. Use casos reais.`
    ]
  }

  // Usar templates baseados no tipo de conteúdo
  const typeTemplates = templates[type as keyof typeof templates] || templates['artigo-blog']
  
  return typeTemplates.map(template => 
    template.replace(/\${niche}/g, niche).replace(/\${objective}/g, objective)
  )
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