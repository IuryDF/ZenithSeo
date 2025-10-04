import { createSupabaseClient } from './supabase'

// Função para executar queries no banco de dados
export async function query(sql: string, params: any[] = []) {
  const supabase = createSupabaseClient()
  
  // Para Supabase, usamos as funções específicas em vez de SQL raw
  // Esta função é um wrapper para compatibilidade
  console.warn('Função query() é um wrapper - use as funções específicas do Supabase')
  
  return {
    rows: [],
    rowCount: 0
  }
}

// Função para buscar métricas do usuário
export async function getUserMetrics(userId: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erro ao buscar métricas:', error)
    return []
  }
  
  return data || []
}

// Função para inserir nova métrica
export async function insertMetric(userId: string, metricData: any) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_metrics')
    .insert({
      user_id: userId,
      ...metricData,
      created_at: new Date().toISOString()
    })
    .select()
  
  if (error) {
    console.error('Erro ao inserir métrica:', error)
    throw error
  }
  
  return data
}