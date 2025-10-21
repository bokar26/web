"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChip {
  id: string
  category: string
  value: string
  onRemove: () => void
}

interface FilterChipsProps {
  chips: FilterChip[]
  onClearAll: () => void
}

export function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          <span className="font-medium">{chip.category}:</span>
          <span className="ml-1">{chip.value}</span>
          <button
            onClick={chip.onRemove}
            className="ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {chips.length >= 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
        >
          Clear all ({chips.length})
        </Button>
      )}
    </div>
  )
}
