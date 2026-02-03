'use client'

import { useState } from 'react'
import { Home, Users, Wallet, Sparkles } from 'lucide-react'
import type { TemplateDefinition } from '@/lib/templates/types'

interface TemplateSelectorProps {
  templates: TemplateDefinition[]
  onSelect: (templateId: string) => void
  detectedTemplate?: TemplateDefinition | null
}

const iconMap = {
  'Home': Home,
  'Users': Users,
  'Wallet': Wallet,
}

const categoryColors = {
  finance: '#CCFF00',
  governance: '#FF00FF',
  escrow: '#FFD600',
  utility: '#00FFFF',
}

export function TemplateSelector({
  templates,
  onSelect,
  detectedTemplate,
}: TemplateSelectorProps) {
  const [pressedId, setPressedId] = useState<string | null>(null)

  return (
    <div className="mb-8 p-6">
      {/* Header - LOUD */}
      <div className="mb-6">
        <h2 className="font-black text-3xl uppercase tracking-tight mb-2">
          /// SELECT TEMPLATE
        </h2>
        <p className="font-mono text-sm">
          OR TYPE FREELY — AI DETECTS INTENT AUTOMATICALLY
        </p>
      </div>

      {/* AI Detection Banner */}
      {detectedTemplate && (
        <div className="mb-6 bg-[#CCFF00] border-[3px] border-black p-4 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <p className="font-mono text-sm">
              <span className="font-black">[AI DETECTED]</span> {detectedTemplate.name} — Click to confirm
            </p>
          </div>
        </div>
      )}

      {/* Grid of Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Wallet
          const isPressed = pressedId === template.id
          const isDetected = detectedTemplate?.id === template.id

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              onMouseDown={() => setPressedId(template.id)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              className={`
                group relative bg-white border-[3px] border-black p-6 text-left
                transition-all duration-75 cursor-pointer
                ${
                  isPressed
                    ? 'translate-x-[4px] translate-y-[4px] shadow-none'
                    : 'shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'
                }
                ${isDetected ? 'ring-4 ring-[#CCFF00]' : ''}
              `}
            >
              {/* Category Badge - Top Right */}
              <div 
                className="absolute top-4 right-4 border-2 border-black px-2 py-1"
                style={{ backgroundColor: categoryColors[template.category] }}
              >
                <span className="font-mono text-xs uppercase font-bold">
                  {template.category}
                </span>
              </div>

              {/* Icon */}
              <div 
                className="mb-4 w-12 h-12 border-2 border-black flex items-center justify-center"
                style={{ backgroundColor: template.color }}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="font-black text-xl uppercase mb-2 tracking-tight">
                {template.name}
              </h3>

              {/* Description */}
              <p className="font-mono text-sm leading-relaxed mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {template.keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="border border-black px-2 py-0.5 font-mono text-xs uppercase"
                  >
                    {keyword}
                  </span>
                ))}
                {template.keywords.length > 3 && (
                  <span className="border border-black px-2 py-0.5 font-mono text-xs uppercase">
                    +{template.keywords.length - 3}
                  </span>
                )}
              </div>

              {/* Action Indicator */}
              <div className="mt-4 flex items-center gap-2 font-black text-sm">
                <span>&gt;&gt;&gt;</span>
                <span className="uppercase">SELECT</span>
              </div>

              {/* Detected Indicator */}
              {isDetected && (
                <div className="absolute -top-2 -left-2 bg-[#CCFF00] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_#000]">
                  <span className="font-mono text-xs font-black">AI MATCH</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* AI Note */}
      <div className="mt-6 bg-[#CCFF00] border-[3px] border-black p-4">
        <p className="font-mono text-sm">
          <span className="font-black">[AI ASSIST]</span> Don't see your use
          case? Just start typing. The agent will auto-detect the best template.
        </p>
      </div>
    </div>
  )
}
