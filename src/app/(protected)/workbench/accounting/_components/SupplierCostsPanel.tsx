"use client"

import { SupplierCostsTab } from "@/features/cost-projections/components/SupplierCostsTab"

interface SupplierCost {
  supplier: string
  category: string
  items: string
  currentRate: number
  quoteStatus: 'pending' | 'applied' | 'expired' | 'none'
}

interface SupplierCostsPanelProps {
  supplierCosts: SupplierCost[]
  onApplyQuote?: () => void
}

export function SupplierCostsPanel({ supplierCosts, onApplyQuote }: SupplierCostsPanelProps) {
  return (
    <SupplierCostsTab
      supplierCosts={supplierCosts}
      onApplyQuote={onApplyQuote || (() => {})}
    />
  )
}

