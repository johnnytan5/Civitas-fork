'use client'

import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'

export type StatusBannerVariant = 'warning' | 'info' | 'success' | 'error'

interface StatusBannerProps {
  variant: StatusBannerVariant
  children: React.ReactNode
  onDismiss?: () => void
}

const variantConfig = {
  warning: {
    bg: 'bg-[#FFD600]',
    border: 'border-black',
    text: 'text-black',
    icon: AlertCircle,
    prefix: '[WAITING]',
  },
  info: {
    bg: 'bg-[#CCFF00]',
    border: 'border-black',
    text: 'text-black',
    icon: Info,
    prefix: '[AI ASSIST]',
  },
  success: {
    bg: 'bg-[#00FF00]',
    border: 'border-black',
    text: 'text-black',
    icon: CheckCircle,
    prefix: '[COMPLETE]',
  },
  error: {
    bg: 'bg-[#FF0000]',
    border: 'border-white',
    text: 'text-white',
    icon: XCircle,
    prefix: '[ERROR]',
  },
}

export function StatusBanner({ variant, children, onDismiss }: StatusBannerProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={`
        ${config.bg} 
        border-[3px] 
        ${config.border} 
        p-4 
        shadow-[4px_4px_0px_#000]
        ${config.text}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-mono text-sm">
            <span className="font-black">{config.prefix}</span> {children}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 hover:opacity-70 transition-opacity font-black text-lg"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
