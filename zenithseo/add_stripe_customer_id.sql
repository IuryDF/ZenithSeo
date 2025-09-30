-- Adicionar coluna stripe_customer_id à tabela users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;