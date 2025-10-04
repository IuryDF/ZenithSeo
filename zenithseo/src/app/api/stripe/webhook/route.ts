import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    if (!sig) {
      return NextResponse.json(
        { error: 'Assinatura do webhook ausente' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // Verificar assinatura do webhook
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err) {
      console.error('Erro na verificação do webhook:', err)
      return NextResponse.json(
        { error: 'Assinatura do webhook inválida' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabase = createSupabaseServerClient()

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('=== CUSTOMER SUBSCRIPTION CREATED ===')
        console.log('Subscription ID:', subscription.id)
        console.log('Customer:', subscription.customer)
        console.log('Metadata:', subscription.metadata)
        
        // Obter userId dos metadados
        const userId = subscription.metadata?.userId
        
        if (!userId) {
          console.error('UserId não encontrado nos metadados da subscription')
          console.error('Metadados disponíveis:', subscription.metadata)
          return NextResponse.json(
            { error: 'UserId não encontrado' },
            { status: 400 }
          )
        }

        console.log('Tentando atualizar usuário:', userId)

        // Atualizar plano do usuário para Pro
        const { data: updateData, error: updateError } = await supabase
          .from('users')
          .update({ 
            plan: 'pro',
            stripe_customer_id: subscription.customer as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()

        if (updateError) {
          console.error('Erro ao atualizar plano do usuário:', updateError)
          return NextResponse.json(
            { error: 'Erro ao atualizar plano' },
            { status: 500 }
          )
        }

        console.log('Usuário atualizado com sucesso:', updateData)
        console.log(`Usuário ${userId} atualizado para plano Pro`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Encontrar usuário pelo customer_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()

        if (userError || !userData) {
          console.error('Usuário não encontrado para customer_id:', subscription.customer)
          return NextResponse.json(
            { error: 'Usuário não encontrado' },
            { status: 404 }
          )
        }

        // Downgrade para plano Free
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userData.id)

        if (updateError) {
          console.error('Erro ao fazer downgrade do usuário:', updateError)
          return NextResponse.json(
            { error: 'Erro ao atualizar plano' },
            { status: 500 }
          )
        }

        console.log(`Usuário ${userData.id} downgrade para plano Free`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Encontrar usuário pelo customer_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('stripe_customer_id', invoice.customer as string)
          .single()

        if (userError || !userData) {
          console.error('Usuário não encontrado para customer_id:', invoice.customer)
          break
        }

        // Log do pagamento falhado (aqui você poderia enviar email de notificação)
        console.log(`Pagamento falhou para usuário ${userData.id} (${userData.email})`)
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erro no webhook do Stripe:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}