import { NextRequest, NextResponse } from 'next/server'
import { validatePassword } from '@/lib/password-validation'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      )
    }

    const validation = validatePassword(password)

    return NextResponse.json({
      isValid: validation.isValid,
      score: validation.score,
      errors: validation.errors,
      suggestions: validation.suggestions,
      strength: getPasswordStrengthLabel(validation.score)
    })

  } catch (error) {
    console.error('Erro na validação de senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getPasswordStrengthLabel(score: number): string {
  if (score < 30) return 'Muito Fraca'
  if (score < 50) return 'Fraca'
  if (score < 70) return 'Média'
  if (score < 85) return 'Forte'
  return 'Muito Forte'
}