import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse do body da requisição
    const { userId, successUrl, cancelUrl } = await request.json()

    // Validação dos parâmetros obrigatórios
    if (!userId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: userId, successUrl, cancelUrl' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabase = createClient()

    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, plan')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário já tem plano Pro
    if (userData.plan === 'pro') {
      return NextResponse.json(
        { error: 'Usuário já possui plano Pro' },
        { status: 400 }
      )
    }

    // Criar sessão de checkout do Stripe
    const session = await createCheckoutSession({
      customerEmail: userData.email,
      userId,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    
    // Tratamento específico para erros do Stripe
    if (error instanceof Error) {
      if (error.message.includes('Stripe')) {
        return NextResponse.json(
          { error: 'Erro no processamento do pagamento. Tente novamente.' },
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