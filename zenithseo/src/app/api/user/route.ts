import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Criar cliente Supabase com cookies
    const cookieStore = cookies()
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Buscar dados do usuário no banco
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados do usuário' },
        { status: 500 }
      )
    }

    // Buscar dados de uso se for plano free
    let usage = null
    if (userData.plan === 'free') {
      // Obter data do início do mês atual
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Contar prompts gerados no mês atual
      const { count, error: countError } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (!countError) {
        usage = {
          prompts_generated: count || 0,
          limit_reached: (count || 0) >= 10,
        }
      }
    }

    return NextResponse.json({
      plan: userData.plan,
      usage,
      hasStripeCustomer: !!userData.stripe_customer_id,
    })

  } catch (error) {
    console.error('Erro na API user:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}