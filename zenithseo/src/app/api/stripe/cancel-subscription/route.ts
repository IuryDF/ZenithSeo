import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse do body da requisição
    const { userId } = await request.json()

    // Validação dos parâmetros obrigatórios
    if (!userId) {
      return NextResponse.json(
        { error: 'Parâmetro obrigatório: userId' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabase = createSupabaseServerClient()

    // Verificar se o usuário existe e tem plano Pro
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, plan, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem plano Pro
    if (userData.plan !== 'pro') {
      return NextResponse.json(
        { error: 'Usuário não possui plano Pro para cancelar' },
        { status: 400 }
      )
    }

    // Verificar se tem stripe_customer_id
    if (!userData.stripe_customer_id) {
      return NextResponse.json(
        { error: 'ID do cliente Stripe não encontrado' },
        { status: 400 }
      )
    }

    // Buscar assinaturas ativas do cliente no Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: userData.stripe_customer_id,
      status: 'active',
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa encontrada' },
        { status: 404 }
      )
    }

    // Cancelar todas as assinaturas ativas
    const cancelPromises = subscriptions.data.map(subscription =>
      stripe.subscriptions.cancel(subscription.id)
    )

    await Promise.all(cancelPromises)

    // Atualizar o plano do usuário no banco de dados
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        plan: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Erro ao atualizar plano do usuário:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar plano do usuário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Assinatura cancelada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}