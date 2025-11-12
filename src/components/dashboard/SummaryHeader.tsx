"use client"

import { Separator } from "@/components/ui/separator"

export interface SummaryMetric {
  label: string
  value: string | number
  onClick?: () => void
  icon?: React.ReactNode
}

interface SummaryHeaderProps {
  metrics: SummaryMetric[]
  className?: string
}

export function SummaryHeader({ metrics, className = "" }: SummaryHeaderProps) {
  if (metrics.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 ${className}`}>
      {metrics.map((metric, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <Separator orientation="vertical" className="h-6" />}
          <div
            onClick={metric.onClick}
            className={`flex items-center gap-2 ${metric.onClick ? 'cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
            role={metric.onClick ? 'button' : undefined}
            tabIndex={metric.onClick ? 0 : undefined}
            onKeyDown={metric.onClick ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                metric.onClick?.()
              }
            } : undefined}
          >
            {metric.icon && <span className="text-gray-400">{metric.icon}</span>}
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{metric.label}</span>
              <span className="text-sm font-semibold text-white">{metric.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

