"use client"

import { WorkbenchTab } from "@/features/cost-projections/components/WorkbenchTab"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostProjectionsWorkbenchProps {
  scope: Scope
  onEditAssumptions: () => void
  kpiData?: {
    totalProjectedCost: number
    budgetVariance: number
    costAccuracy: number
    riskLevel: string
  }
}

export function CostProjectionsWorkbench({
  scope,
  onEditAssumptions,
  kpiData,
}: CostProjectionsWorkbenchProps) {
  return (
    <WorkbenchTab
      scope={scope}
      onEditAssumptions={onEditAssumptions}
      kpiData={kpiData}
    />
  )
}

