import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error('Erro ao verificar email:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar email' },
        { status: 500 }
      )
    }

    const exists = Array.isArray(data) && data.length > 0
    return NextResponse.json({ exists })

  } catch (error) {
    console.error('Erro na API check-email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}