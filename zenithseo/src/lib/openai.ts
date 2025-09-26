import OpenAI from 'openai'

// Configuração do cliente OpenAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Função para gerar prompts usando OpenAI
export async function generatePrompts(niche: string, objective: string, type: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em SEO e marketing digital. Gere 3 prompts criativos e eficazes para ${type} baseados no nicho "${niche}" e objetivo "${objective}". 
          
          Retorne APENAS um JSON válido no formato:
          {
            "prompts": [
              {
                "title": "Título do prompt",
                "content": "Conteúdo detalhado do prompt"
              },
              {
                "title": "Título do prompt",
                "content": "Conteúdo detalhado do prompt"
              },
              {
                "title": "Título do prompt",
                "content": "Conteúdo detalhado do prompt"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Nicho: ${niche}, Objetivo: ${objective}, Tipo: ${type}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('Nenhum conteúdo retornado pela OpenAI')
    }

    // Parse do JSON retornado
    const result = JSON.parse(content)
    return result.prompts
  } catch (error) {
    console.error('Erro ao gerar prompts:', error)
    throw new Error('Falha ao gerar prompts')
  }
}