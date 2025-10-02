-- Tabela de solicitações de suporte
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'billing', 'feature', 'bug', 'account', 'general')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  user_plan TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at na tabela support_requests
CREATE TRIGGER update_support_requests_updated_at BEFORE UPDATE ON public.support_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para support_requests
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Política para support_requests - usuários podem ver/criar suas próprias solicitações
CREATE POLICY "Users can view own support requests" ON public.support_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own support requests" ON public.support_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);