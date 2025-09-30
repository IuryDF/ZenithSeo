'use client'

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  linkTo?: string
}

export default function Logo({ size = 'md', showSubtitle = true, linkTo = '/' }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-5 h-5',
      title: 'text-lg',
      subtitle: 'text-xs'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-6 h-6',
      title: 'text-xl',
      subtitle: 'text-xs'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-7 h-7',
      title: 'text-2xl',
      subtitle: 'text-sm'
    }
  }

  const LogoContent = () => (
    <div className="flex items-center">
      <div className={`${sizeClasses[size].container} bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg`}>
        <svg className={`${sizeClasses[size].icon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h1 className={`${sizeClasses[size].title} font-bold text-white`}>ZenithSEO</h1>
        {showSubtitle && (
          <p className={`${sizeClasses[size].subtitle} text-gray-400 hidden sm:block`}>Prompts de IA para SEO</p>
        )}
      </div>
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="flex items-center hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}