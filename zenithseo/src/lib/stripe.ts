import Stripe from 'stripe'

// Configuração do cliente Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

// Configuração dos planos
export const FREE_PLAN = {
  name: 'Free',
  price: 0,
  features: [
    '3 prompts por conta',
    'Suporte básico',
    'Sem histórico de prompts'
  ]
}

export const PRO_PLAN = {
  name: 'Pro',
  price: 2999, // R$ 29,99 em centavos
  features: [
    'Prompts ilimitados',
    'Suporte prioritário',
    'Histórico completo de prompts',
    'Novos recursos primeiro'
  ]
}

// Função para criar sessão de checkout
export async function createCheckoutSession({
  customerEmail,
  userId,
  successUrl,
  cancelUrl,
  existingCustomerId,
}: {
  customerEmail: string
  userId: string
  successUrl: string
  cancelUrl: string
  existingCustomerId?: string | null
}) {
  try {
    // Configuração base da sessão
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: PRO_PLAN.name,
              description: PRO_PLAN.features.join(', '),
            },
            unit_amount: PRO_PLAN.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    }

    // Se já existe um customer_id, reutilizar; senão, usar email
    if (existingCustomerId) {
      sessionConfig.customer = existingCustomerId
      console.log('Reutilizando customer_id existente:', existingCustomerId)
    } else {
      sessionConfig.customer_email = customerEmail
      console.log('Criando nova sessão com email:', customerEmail)
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return session
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    throw new Error('Erro ao processar pagamento. Tente novamente.')
  }
}