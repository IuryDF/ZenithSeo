import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { generatePrompts } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    // Parse do body da requisição
    const { niche, objective, type, userId } = await request.json()

    // Validação dos parâmetros obrigatórios
    if (!niche || !objective || !type || !userId) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: niche, objective, type, userId' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabase = createClient()

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
      // Obter data do início do mês atual
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Contar prompts gerados no mês atual
      const { count, error: countError } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (countError) {
        console.error('Erro ao contar prompts:', countError)
        return NextResponse.json(
          { error: 'Erro interno do servidor' },
          { status: 500 }
        )
      }

      // Verificar se atingiu o limite (10 prompts por mês para free)
      if (count && count >= 10) {
        return NextResponse.json(
          { 
            error: 'Limite mensal atingido. Faça upgrade para o plano Pro para prompts ilimitados.',
            limitReached: true 
          },
          { status: 429 }
        )
      }
    }

    // Gerar prompts usando OpenAI
    const prompts = await generatePrompts(niche, objective, type)

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

    // Atualizar contador de uso
    const { error: usageError } = await supabase
      .from('usage')
      .upsert({
        user_id: userId,
        prompts_generated: (count || 0) + prompts.length,
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
        current: (count || 0) + prompts.length,
        limit: userData.plan === 'free' ? 10 : null,
        plan: userData.plan,
      },
    })

  } catch (error) {
    console.error('Erro na API generate:', error)
    
    // Tratamento específico para erros da OpenAI
    if (error instanceof Error && error.message.includes('OpenAI')) {
      return NextResponse.json(
        { error: 'Erro ao gerar prompts. Tente novamente.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}