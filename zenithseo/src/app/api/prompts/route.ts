import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
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

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Verificar plano do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Usuários gratuitos não têm acesso ao histórico
    if (userData.plan === 'free') {
      return NextResponse.json({
        prompts: [],
        total: 0,
        message: 'Histórico de prompts disponível apenas no plano Pro'
      })
    }

    // Buscar prompts do usuário ordenados por data de criação (mais recentes primeiro) - apenas para Pro
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

export async function DELETE(request: NextRequest) {
  try {
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
            } catch {}
          },
        },
      }
    )

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const ids: string[] = body?.ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Parâmetro obrigatório: ids (array de IDs)' },
        { status: 400 }
      )
    }

    // Usar cliente com chave de serviço para evitar bloqueios de RLS
    const supabaseAdmin = createSupabaseServerClient()

    // Excluir apenas prompts do próprio usuário (verificado via auth + filtro)
    const { error: deleteError } = await supabaseAdmin
      .from('prompts')
      .delete()
      .in('id', ids)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Erro ao excluir prompts:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir prompts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API prompts DELETE:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}