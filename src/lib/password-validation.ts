export interface PasswordValidation {
  isValid: boolean
  score: number // 0-100
  errors: string[]
  suggestions: string[]
}

export interface PasswordCriteria {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumbers: boolean
  hasSpecialChars: boolean
  noCommonPatterns: boolean
  noSequentialChars: boolean
  noRepeatedChars: boolean
}

// Lista de senhas comuns para verificar
const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567',
  'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
  '123123', 'senha', 'senha123', '000000', '111111', '222222'
]

// Padrões sequenciais comuns
const SEQUENTIAL_PATTERNS = [
  '123', '234', '345', '456', '567', '678', '789', '890',
  'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
  'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop'
]

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Critérios básicos
  const criteria: PasswordCriteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
    noCommonPatterns: !isCommonPassword(password),
    noSequentialChars: !hasSequentialChars(password),
    noRepeatedChars: !hasTooManyRepeatedChars(password)
  }

  // Verificar comprimento mínimo
  if (!criteria.minLength) {
    errors.push('A senha deve ter pelo menos 8 caracteres')
    suggestions.push('Use uma senha mais longa para maior segurança')
  } else {
    score += 25
  }

  // Verificar letras maiúsculas
  if (!criteria.hasUppercase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula (A-Z)')
    suggestions.push('Adicione letras maiúsculas à sua senha')
  } else {
    score += 20
  }

  // Verificar letras minúsculas
  if (!criteria.hasLowercase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula (a-z)')
    suggestions.push('Adicione letras minúsculas à sua senha')
  } else {
    score += 20
  }

  // Verificar números
  if (!criteria.hasNumbers) {
    errors.push('A senha deve conter pelo menos um número (0-9)')
    suggestions.push('Adicione números à sua senha')
  } else {
    score += 20
  }

  // Verificar caracteres especiais
  if (!criteria.hasSpecialChars) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)')
    suggestions.push('Adicione símbolos como !@#$%^&* à sua senha')
  } else {
    score += 15
  }

  // Verificar senhas comuns
  if (!criteria.noCommonPatterns) {
    errors.push('Esta senha é muito comum e fácil de adivinhar')
    suggestions.push('Evite senhas óbvias como "123456" ou "password"')
    score -= 20 // Penalidade por senha comum
  }

  // Verificar caracteres sequenciais
  if (!criteria.noSequentialChars) {
    errors.push('Evite sequências óbvias como "123" ou "abc"')
    suggestions.push('Use uma combinação mais aleatória de caracteres')
    score -= 10 // Penalidade por sequências
  }

  // Verificar caracteres repetidos
  if (!criteria.noRepeatedChars) {
    errors.push('Evite muitos caracteres repetidos consecutivos')
    suggestions.push('Varie os caracteres para maior segurança')
    score -= 10 // Penalidade por repetições
  }

  // Bônus por comprimento extra
  if (password.length >= 12) {
    score += 5
  }
  if (password.length >= 16) {
    score += 5
  }

  // Bônus por diversidade de caracteres
  const uniqueChars = new Set(password).size
  if (uniqueChars >= password.length * 0.7) {
    score += 5
  }

  // Garantir que score não seja negativo
  score = Math.max(0, score)

  // Considerar válida se atender critérios básicos OU se for forte
  const meetsBasicCriteria = criteria.minLength && criteria.hasUppercase && 
                            criteria.hasLowercase && criteria.hasNumbers && 
                            criteria.hasSpecialChars
  const isStrongEnough = score >= 70 // Nível "Forte"
  
  const isValid = meetsBasicCriteria || isStrongEnough
  
  // Se a senha é forte mas não atende todos os critérios, adicionar aviso positivo
  if (isStrongEnough && !meetsBasicCriteria) {
    suggestions.unshift('✅ Sua senha já está forte o suficiente! Você pode prosseguir.')
  }
  
  return {
    isValid,
    score: Math.min(score, 100),
    errors: isStrongEnough ? [] : errors, // Limpar erros se for forte o suficiente
    suggestions
  }
}

function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  return COMMON_PASSWORDS.some(common => 
    lowerPassword.includes(common) || common.includes(lowerPassword)
  )
}

function hasSequentialChars(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  return SEQUENTIAL_PATTERNS.some(pattern => 
    lowerPassword.includes(pattern) || lowerPassword.includes(pattern.split('').reverse().join(''))
  )
}

function hasTooManyRepeatedChars(password: string): boolean {
  // Verifica se há mais de 2 caracteres iguais consecutivos
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      return true
    }
  }
  return false
}

export function getPasswordStrengthLabel(score: number): string {
  if (score < 30) return 'Muito Fraca'
  if (score < 50) return 'Fraca'
  if (score < 70) return 'Média'
  if (score < 85) return 'Forte'
  return 'Muito Forte'
}

export function getPasswordStrengthColor(score: number): string {
  if (score < 30) return '#ef4444' // red-500
  if (score < 50) return '#f97316' // orange-500
  if (score < 70) return '#eab308' // yellow-500
  if (score < 85) return '#22c55e' // green-500
  return '#16a34a' // green-600
}