'use client'

import { useEffect, useState } from 'react'
import { validatePassword, getPasswordStrengthLabel, getPasswordStrengthColor, PasswordValidation } from '@/lib/password-validation'

interface PasswordStrengthIndicatorProps {
  password: string
  onValidationChange?: (validation: PasswordValidation) => void
  showDetails?: boolean
}

export function PasswordStrengthIndicator({ 
  password, 
  onValidationChange, 
  showDetails = true 
}: PasswordStrengthIndicatorProps) {
  const [validation, setValidation] = useState<PasswordValidation>({
    isValid: false,
    score: 0,
    errors: [],
    suggestions: []
  })

  useEffect(() => {
    if (password) {
      const newValidation = validatePassword(password)
      setValidation(newValidation)
      onValidationChange?.(newValidation)
    } else {
      const emptyValidation = {
        isValid: false,
        score: 0,
        errors: [],
        suggestions: []
      }
      setValidation(emptyValidation)
      onValidationChange?.(emptyValidation)
    }
  }, [password])

  if (!password) return null

  const strengthLabel = getPasswordStrengthLabel(validation.score)
  const strengthColor = getPasswordStrengthColor(validation.score)

  return (
    <div className="mt-2 space-y-3">
      {/* Barra de força da senha */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Força da senha:
          </span>
          <span 
            className="text-sm font-semibold"
            style={{ color: strengthColor }}
          >
            {strengthLabel} ({validation.score}%)
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${validation.score}%`,
              backgroundColor: strengthColor
            }}
          />
        </div>
      </div>

      {/* Critérios de validação */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Critérios de segurança:
          </div>
          
          <div className="grid grid-cols-1 gap-1 text-xs">
            <CriteriaItem 
              met={password.length >= 8}
              text="Pelo menos 8 caracteres"
            />
            <CriteriaItem 
              met={/[A-Z]/.test(password)}
              text="Letras maiúsculas (A-Z)"
            />
            <CriteriaItem 
              met={/[a-z]/.test(password)}
              text="Letras minúsculas (a-z)"
            />
            <CriteriaItem 
              met={/\d/.test(password)}
              text="Números (0-9)"
            />
            <CriteriaItem 
              met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)}
              text="Caracteres especiais (!@#$%^&*)"
            />
          </div>
        </div>
      )}

      {/* Erros e sugestões */}
      {validation.errors.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-red-600">
            Problemas encontrados:
          </div>
          <ul className="text-xs text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-1">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-blue-600">
            Sugestões para melhorar:
          </div>
          <ul className="text-xs text-blue-600 space-y-1">
            {validation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-1">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {validation.isValid && (
        <div className="flex items-center text-green-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Senha atende todos os critérios de segurança!
        </div>
      )}
    </div>
  )
}

interface CriteriaItemProps {
  met: boolean
  text: string
}

function CriteriaItem({ met, text }: CriteriaItemProps) {
  return (
    <div className={`flex items-center ${met ? 'text-green-600' : 'text-gray-400'}`}>
      <svg 
        className="w-3 h-3 mr-2" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        {met ? (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        )}
      </svg>
      {text}
    </div>
  )
}