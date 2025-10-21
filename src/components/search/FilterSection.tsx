"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterSectionProps {
  title: string
  icon?: React.ReactNode
  activeCount?: number
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function FilterSection({ 
  title, 
  icon, 
  activeCount = 0, 
  children, 
  defaultExpanded = false,
  className 
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
