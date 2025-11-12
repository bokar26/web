"use client"

import { CostHeaderFilters } from "./CostHeaderFilters"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostProjectionsHeaderProps {
  scope: Scope
  onPeriodChange: (period: string) => void
  onCategoryChange: (category: string) => void
  onSupplierChange: (supplier: string) => void
  onConfidenceChange: (confidence: number) => void
  onClear?: () => void
}

export function CostProjectionsHeader({
  scope,
  onPeriodChange,
  onCategoryChange,
  onSupplierChange,
  onConfidenceChange,
  onClear,
}: CostProjectionsHeaderProps) {
  return (
    <CostHeaderFilters
      scope={scope}
      onPeriodChange={onPeriodChange}
      onCategoryChange={onCategoryChange}
      onSupplierChange={onSupplierChange}
      onConfidenceChange={onConfidenceChange}
      onClear={onClear}
    />
  )
}

