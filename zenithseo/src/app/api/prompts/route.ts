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

    // Buscar prompts do usuário ordenados por data de criação (mais recentes primeiro)
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) // Limitar a 50 prompts mais recentes

    if (promptsError) {
      console.error('Erro ao buscar prompts:', promptsError)
      return NextResponse.json(
        { error: 'Erro ao buscar prompts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      prompts: prompts || [],
      total: prompts?.length || 0,
    })

  } catch (error) {
    console.error('Erro na API prompts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}