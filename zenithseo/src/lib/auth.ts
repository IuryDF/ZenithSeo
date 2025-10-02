import { createSupabaseClient } from './supabase'
import { validatePassword } from './password-validation'
import { createServerClient } from '@supabase/ssr'

// Função para fazer login (client-side)
export async function signIn(email: string, password: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Traduzir mensagens de erro comuns do Supabase para português
    let errorMessage = error.message
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciais de login inválidas'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Email não confirmado'
    } else if (error.message.includes('Too many requests')) {
      errorMessage = 'Muitas tentativas. Tente novamente mais tarde'
    } else if (error.message.includes('User not found')) {
      errorMessage = 'Usuário não encontrado'
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Email inválido'
    } else if (error.message.includes('Password')) {
      errorMessage = 'Senha incorreta'
    }
    
    throw new Error(errorMessage)
  }

  return data
}

// Função para fazer cadastro (client-side)
export async function signUp(email: string, password: string) {
  // Validar senha
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(', '))
  }

  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Função para fazer logout (client-side)
export async function signOut() {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// Função para redefinir senha (client-side)
export async function resetPassword(email: string) {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Função para atualizar senha (client-side)
export async function updatePassword(password: string) {
  // Validar senha
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(', '))
  }

  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Função para obter usuário atual no servidor
export async function getCurrentUser() {
  const supabase = createSupabaseClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

// Função para verificar se o usuário está autenticado
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

// Função para obter dados do usuário do banco
export async function getUserData(userId: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    return null
  }

  return data
}

// Função para obter usuário autenticado no servidor (para API routes)
export async function getServerUser() {
  const { cookies } = await import('next/headers')
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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  // Buscar dados do usuário no banco
  const userData = await getUserData(user.id)
  
  return userData
}