import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 })
    }

    // Recupera a sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 })
    }

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json({ error: 'Pagamento não confirmado' }, { status: 400 })
    }

    // Obter subscription para metadata
    let userId = session.metadata?.userId as string | undefined

    // Fallback: recuperar assinatura para confirmar customer e metadata
    if (!userId && session.subscription) {
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        userId = (subscription.metadata?.userId as string | undefined) || userId
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'UserId não disponível nos metadados' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ 
        plan: 'pro',
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()

    if (updateError) {
      console.error('Erro ao atualizar plano após checkout:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar plano' }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId, sessionId, data: updateData })
  } catch (error) {
    console.error('Erro na confirmação de checkout:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}