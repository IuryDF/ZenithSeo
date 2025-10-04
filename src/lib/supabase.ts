import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Configuração do Supabase para uso no cliente (browser)
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Configuração do Supabase para uso no servidor
export const createSupabaseServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Tipos para as tabelas do banco de dados
export interface User {
  id: string
  email: string
  plan: 'free' | 'pro'
  created_at: string
  updated_at: string
}

export interface Prompt {
  id: string
  user_id: string
  niche: string
  objective: string
  type: string
  content: string
  created_at: string
}

export interface Usage {
  id: string
  user_id: string
  month: string
  prompts_generated: number
  limit_reached: boolean
  created_at: string
  updated_at: string
}