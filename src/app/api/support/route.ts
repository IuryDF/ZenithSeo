import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

interface SupportRequest {
  type: string
  subject: string
  description: string
  priority: string
  email: string
  name: string
  plan: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, subject, description, priority = 'medium', name, email } = body

    // Validar campos obrigatórios
    if (!type || !subject || !description || !name || !email) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Obter cookies de forma assíncrona
    const cookieStore = await cookies()
    
    // Configurar cliente Supabase
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Salvar solicitação no banco de dados
    const { data: supportData, error: dbError } = await supabase
      .from('support_requests')
      .insert({
        user_id: user.id,
        type: type,
        subject: subject,
        description: description,
        priority: priority,
        contact_email: email,
        contact_name: name,
        user_plan: 'free', // Valor padrão por enquanto
        status: 'open'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Enviar notificação por email para a equipe de suporte
    await sendSupportNotification(body, user.id)

    return NextResponse.json({
      success: true,
      message: 'Solicitação de suporte enviada com sucesso',
      ticketId: supportData?.id
    })

  } catch (error) {
    console.error('Erro na API de suporte:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para enviar notificação de suporte
async function sendSupportNotification(request: SupportRequest, userId: string) {
  try {
    const supportEmail = process.env.SUPPORT_EMAIL || 'suporte@zenithseo.com.br'
    
    // Mapear tipos de solicitação
    const typeLabels: { [key: string]: string } = {
      'technical': '🔧 Suporte Técnico',
      'billing': '💳 Questões de Cobrança',
      'feature': '💡 Sugestão de Melhoria',
      'bug': '🐛 Relatar Bug',
      'account': '👤 Problemas de Conta',
      'general': '❓ Dúvida Geral'
    }

    // Mapear prioridades
    const priorityLabels: { [key: string]: string } = {
      'low': '🟢 Baixa',
      'medium': '🟡 Média',
      'high': '🟠 Alta',
      'urgent': '🔴 Urgente'
    }

    const typeLabel = typeLabels[request.type] || request.type
    const priorityLabel = priorityLabels[request.priority] || request.priority

    // Por enquanto, apenas log no console
    // Em produção, implementar com Resend ou outro serviço de email
    console.log('📧 NOVA SOLICITAÇÃO DE SUPORTE:', {
      timestamp: new Date().toISOString(),
      ticketInfo: {
        type: typeLabel,
        priority: priorityLabel,
        subject: request.subject,
        from: `${request.name} (${request.email})`,
        plan: request.plan.toUpperCase(),
        userId: userId
      },
      description: request.description,
      supportEmail: supportEmail
    })

    // TODO: Implementar envio real de email com Resend
    // const emailContent = generateSupportEmailTemplate(request, userId, typeLabel, priorityLabel)
    // 
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'sistema@zenithseo.com.br',
    //     to: [supportEmail],
    //     subject: `${priorityLabel} ${typeLabel}: ${request.subject}`,
    //     html: emailContent,
    //     reply_to: request.email
    //   }),
    // })

    return { success: true, method: 'console_log', supportEmail }
  } catch (error) {
    console.error('Erro ao enviar notificação de suporte:', error)
    return { success: false, error }
  }
}

// Função para gerar template de email (para implementação futura)
function generateSupportEmailTemplate(
  request: SupportRequest, 
  userId: string, 
  typeLabel: string, 
  priorityLabel: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Nova Solicitação de Suporte - ZenithSEO</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Nova Solicitação de Suporte</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Informações do Ticket</h3>
                <p><strong>Tipo:</strong> ${typeLabel}</p>
                <p><strong>Prioridade:</strong> ${priorityLabel}</p>
                <p><strong>Assunto:</strong> ${request.subject}</p>
                <p><strong>Plano:</strong> ${request.plan.toUpperCase()}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Informações do Cliente</h3>
                <p><strong>Nome:</strong> ${request.name}</p>
                <p><strong>Email:</strong> ${request.email}</p>
                <p><strong>User ID:</strong> ${userId}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Descrição</h3>
                <p style="white-space: pre-wrap;">${request.description}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #64748b;">
                    Este email foi gerado automaticamente pelo sistema ZenithSEO.<br>
                    Responda diretamente para ${request.email} para entrar em contato com o cliente.
                </p>
            </div>
        </div>
    </body>
    </html>
  `
}