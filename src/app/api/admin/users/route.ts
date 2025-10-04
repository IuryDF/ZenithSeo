import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// Rota administrativa para listar usuários do Supabase Auth.
// OBS: Senhas não podem ser acessadas; o Supabase armazena hashes e não expõe senhas.

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const perPage = Number(url.searchParams.get('perPage') || '50')
    const emailFilter = (url.searchParams.get('email') || '').toLowerCase()

    // Segurança: em produção, exigir token de admin via Authorization: Bearer <token>
    const requireToken = process.env.NODE_ENV === 'production'
    const authHeader = request.headers.get('authorization') || ''
    const providedToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

    if (requireToken) {
      if (!process.env.ADMIN_API_TOKEN || providedToken !== process.env.ADMIN_API_TOKEN) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
    }

    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) {
      return NextResponse.json({ error: 'Erro ao listar usuários: ' + (error.message || '') }, { status: 500 })
    }

    let users = (data?.users || []).map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: (u.last_sign_in_at as any) || null,
      phone: (u.phone as any) || null,
      identities: u.identities?.map(i => i.provider) || []
    }))

    if (emailFilter) {
      users = users.filter(u => (u.email || '').toLowerCase().includes(emailFilter))
    }

    return NextResponse.json({ page, perPage, count: users.length, users })
  } catch (err: any) {
    const msg = String(err?.message || '')
    return NextResponse.json({ error: 'Falha na rota: ' + msg }, { status: 500 })
  }
}