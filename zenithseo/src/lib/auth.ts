import { createSupabaseClient } from './supabase'
import { validatePassword } from './password-validation'

// Função para fazer login
export async function signIn(email: string, password: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Função para fazer cadastro
export async function signUp(email: string, password: string) {
  // Validar senha no backend também
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(`Senha não atende aos critérios de segurança: ${passwordValidation.errors.join(', ')}`)
  }

  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Função para fazer logout
export async function signOut() {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.signOut()

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