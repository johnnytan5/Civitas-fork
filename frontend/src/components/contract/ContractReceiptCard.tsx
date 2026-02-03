'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import type { TemplateDefinition } from '@/lib/templates/types'
import { formatUnits } from 'viem'

interface ContractReceiptCardProps {
  template: TemplateDefinition
  config: any
  onDeploy?: () => void
  isDeploying?: boolean
}

export function ContractReceiptCard({
  template,
  config,
  onDeploy,
  isDeploying = false,
}: ContractReceiptCardProps) {
  const [completeness, setCompleteness] = useState(0)
  const [isPressed, setIsPressed] = useState(false)

  // Calculate form completeness
  useEffect(() => {
    if (!config) {
      setCompleteness(0)
      return
    }

    const requiredFields = Object.keys(template.parameterSchema?.shape || {})
    const filledFields = requiredFields.filter((key) => {
      const value = config[key]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    })
    const percentage = requiredFields.length > 0 
      ? (filledFields.length / requiredFields.length) * 100 
      : 0
    setCompleteness(percentage)
  }, [config, template])

  const formatValue = (field: any, value: any) => {
    if (!value && value !== 0) return '---'

    switch (field.type) {
      case 'address':
        if (typeof value === 'string' && value.startsWith('0x')) {
          return value.slice(0, 10) + '...' + value.slice(-8)
        }
        return value
      case 'amount':
        try {
          const numValue = typeof value === 'string' ? value : value.toString()
          // Assume USDC with 6 decimals if value looks like wei
          const formatted = numValue.length > 8 
            ? formatUnits(BigInt(numValue), 6)
            : numValue
          return (
            parseFloat(formatted).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + ' USDC'
          )
        } catch {
          return value
        }
      case 'date':
        try {
          const timestamp = typeof value === 'string' ? parseInt(value) : value
          const date = timestamp > 10000000000 ? new Date(timestamp) : new Date(timestamp * 1000)
          return date.toLocaleDateString()
        } catch {
          return value
        }
      case 'state':
        return field.format ? field.format(value) : value
      case 'number':
        return value.toString()
      case 'boolean':
        return value ? 'Yes' : 'No'
      case 'array':
        return Array.isArray(value) ? `${value.length} items` : value
      default:
        if (field.format) {
          return field.format(value)
        }
        return String(value)
    }
  }

  const isComplete = completeness === 100

  return (
    <div className="sticky top-24 w-full max-w-md mx-auto">
      {/* Receipt Card with Jagged Bottom */}
      <div
        className="bg-white border-[3px] border-black border-b-0 shadow-[6px_6px_0px_#000] animate-receipt-print"
        style={{
          clipPath:
            'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 6px) calc(100% - 6px), calc(100% - 12px) 100%, calc(100% - 18px) calc(100% - 6px), calc(100% - 24px) 100%, calc(100% - 30px) calc(100% - 6px), calc(100% - 36px) 100%, calc(100% - 42px) calc(100% - 6px), calc(100% - 48px) 100%, calc(100% - 54px) calc(100% - 6px), calc(100% - 60px) 100%, calc(100% - 66px) calc(100% - 6px), calc(100% - 72px) 100%, calc(100% - 78px) calc(100% - 6px), calc(100% - 84px) 100%, calc(100% - 90px) calc(100% - 6px), calc(100% - 96px) 100%, calc(100% - 102px) calc(100% - 6px), calc(100% - 108px) 100%, calc(100% - 114px) calc(100% - 6px), calc(100% - 120px) 100%, 0 100%)',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-dashed border-black">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-2xl uppercase tracking-tight">
              RECEIPT
            </h3>
            <div className="bg-black text-white px-3 py-1 font-mono text-xs">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
          <div className="font-mono text-sm">
            TEMPLATE: {template.name.toUpperCase()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase font-bold">
              COMPLETION
            </span>
            <span className="font-mono text-xs font-bold">
              {completeness.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-[#FAF9F6] border border-black">
            <div
              className="h-full bg-[#CCFF00] transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Parameters */}
        <div className="p-6 space-y-4">
          {template.dashboardFields.map((field, index) => {
            const value = config?.[field.key]
            const hasValue =
              value !== undefined && value !== null && value !== ''

            return (
              <div key={field.key}>
                {/* Field Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    {hasValue ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 opacity-30" />
                    )}
                    <span className="font-mono text-xs uppercase font-bold">
                      {field.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-sm text-right ${
                      hasValue ? 'font-bold' : 'opacity-30'
                    }`}
                  >
                    {formatValue(field, value)}
                  </span>
                </div>

                {/* Dashed divider */}
                {index < template.dashboardFields.length - 1 && (
                  <div className="border-b border-dashed border-black mt-4" />
                )}
              </div>
            )
          })}
        </div>

        {/* Barcode (Fake) */}
        <div className="p-6 flex justify-center">
          <div className="flex gap-[2px] h-12">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] bg-black"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Deploy Button - THE SMASH */}
      <button
        disabled={!isComplete || isDeploying}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={onDeploy}
        className={`
          w-full mt-6 py-6 font-black text-2xl uppercase tracking-tight
          border-[3px] border-black transition-all duration-75
          ${
            isComplete && !isDeploying
              ? isPressed
                ? 'bg-white translate-x-[4px] translate-y-[4px] shadow-none cursor-pointer'
                : 'bg-[#FF00FF] shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] cursor-pointer'
              : 'bg-[#FAF9F6] text-gray-400 cursor-not-allowed shadow-none'
          }
        `}
      >
        {isDeploying 
          ? '/// DEPLOYING ///' 
          : isComplete 
            ? '/// CONFIRM DEPLOY ///' 
            : '/// INCOMPLETE ///'}
      </button>

      {/* Status Message */}
      {!isComplete && !isDeploying && (
        <div className="mt-4 bg-[#FFD600] border-[3px] border-black p-4">
          <p className="font-mono text-sm font-bold">
            [WAITING] Fill all parameters to proceed
          </p>
        </div>
      )}

      {/* Receipt Print Animation */}
      <style jsx>{`
        @keyframes receipt-print {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-receipt-print {
          animation: receipt-print 0.4s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-receipt-print {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
