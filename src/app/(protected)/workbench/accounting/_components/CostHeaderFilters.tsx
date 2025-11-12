"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostHeaderFiltersProps {
  scope: Scope
  onPeriodChange: (period: string) => void
  onCategoryChange: (category: string) => void
  onSupplierChange: (supplier: string) => void
  onConfidenceChange: (confidence: number) => void
  onClear?: () => void
}

export function CostHeaderFilters({
  scope,
  onPeriodChange,
  onCategoryChange,
  onSupplierChange,
  onConfidenceChange,
  onClear,
}: CostHeaderFiltersProps) {
  const hasFilters = scope.period !== "12" || scope.category !== "all" || scope.supplier !== "all" || scope.confidence !== 85

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge
        variant="secondary"
        className="bg-gray-800 text-white border-gray-600 cursor-pointer hover:bg-gray-700"
        onClick={() => onPeriodChange("12")}
      >
        Period: {scope.period}
      </Badge>
      <Badge
        variant="secondary"
        className="bg-gray-800 text-white border-gray-600 cursor-pointer hover:bg-gray-700"
        onClick={() => onCategoryChange("all")}
      >
        Category: {scope.category}
      </Badge>
      <Badge
        variant="secondary"
        className="bg-gray-800 text-white border-gray-600 cursor-pointer hover:bg-gray-700"
        onClick={() => onSupplierChange("all")}
      >
        Supplier: {scope.supplier}
      </Badge>
      <Badge
        variant="secondary"
        className="bg-gray-800 text-white border-gray-600 cursor-pointer hover:bg-gray-700"
        onClick={() => onConfidenceChange(85)}
      >
        Confidence: {scope.confidence}%
      </Badge>
      {hasFilters && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-gray-400 hover:text-white"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

