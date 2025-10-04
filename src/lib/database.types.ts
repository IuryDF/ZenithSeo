// Tipos gerados manualmente para o banco Supabase usados no projeto
// Estrutura compatível com @supabase/supabase-js v2 para uso de generics

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          plan: 'free' | 'pro'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          plan?: 'free' | 'pro'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          plan?: 'free' | 'pro'
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          niche: string
          objective: string
          type: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          niche: string
          objective: string
          type: string
          content: Json
          created_at?: string
        }
        Update: {
          user_id?: string
          niche?: string
          objective?: string
          type?: string
          content?: Json
          created_at?: string
        }
        Relationships: []
      }
      usage: {
        Row: {
          id: string
          user_id: string
          month: string // YYYY-MM
          prompts_generated: number
          limit_reached: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          prompts_generated?: number
          limit_reached?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          month?: string
          prompts_generated?: number
          limit_reached?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          id: string
          user_id: string
          type: 'technical' | 'billing' | 'feature' | 'bug' | 'account' | 'general'
          subject: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          contact_email: string
          contact_name: string
          user_plan: string
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          admin_notes: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'technical' | 'billing' | 'feature' | 'bug' | 'account' | 'general'
          subject: string
          description: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          contact_email: string
          contact_name: string
          user_plan: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          type?: 'technical' | 'billing' | 'feature' | 'bug' | 'account' | 'general'
          subject?: string
          description?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          contact_email?: string
          contact_name?: string
          user_plan?: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}