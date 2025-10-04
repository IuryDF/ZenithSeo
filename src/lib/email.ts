// Sistema de notificação por email para admins
// Usando Resend como serviço de email (gratuito até 3000 emails/mês)

interface EmailNotification {
  type: 'OPENAI_CREDITS_EXHAUSTED'
  timestamp: Date
  details: {
    error: string
    userPlan: string
    userId?: string
  }
}

export async function sendAdminNotification(notification: EmailNotification) {
  try {
    // Email do admin configurado via variável de ambiente
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@zenithseo.com'
    
    // Por enquanto, apenas log no console
    // Em produção, implementar com Resend ou outro serviço
    console.log('🚨 NOTIFICAÇÃO ADMIN - Créditos OpenAI Esgotados:', {
      timestamp: notification.timestamp.toISOString(),
      type: notification.type,
      details: notification.details,
      adminEmail: adminEmail
    })

    // TODO: Implementar envio real de email
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'sistema@zenithseo.com',
    //     to: [adminEmail],
    //     subject: '🚨 Créditos OpenAI Esgotados - ZenithSEO',
    //     html: generateEmailTemplate(notification)
    //   }),
    // })

    return { success: true, method: 'console_log', adminEmail }
  } catch (error) {
    console.error('Erro ao enviar notificação admin:', error)
    return { success: false, error }
  }
}

// Função auxiliar para notificar sobre créditos esgotados
export async function notifyOpenAICreditsExhausted(userPlan: string, userId?: string) {
  const notification: EmailNotification = {
    type: 'OPENAI_CREDITS_EXHAUSTED',
    timestamp: new Date(),
    details: {
      error: 'OpenAI API credits exhausted',
      userPlan,
      userId
    }
  }

  return await sendAdminNotification(notification)
}