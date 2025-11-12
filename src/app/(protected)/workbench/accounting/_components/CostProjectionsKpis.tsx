"use client"

import { CostKpiGrid } from "./CostKpiGrid"

interface CostProjectionsKpisProps {
  totalProjectedCost?: number
  budgetVariance?: number
  costAccuracy?: number
  riskLevel?: string
}

export function CostProjectionsKpis({
  totalProjectedCost,
  budgetVariance,
  costAccuracy,
  riskLevel,
}: CostProjectionsKpisProps) {
  return (
    <CostKpiGrid
      totalProjectedCost={totalProjectedCost}
      budgetVariance={budgetVariance}
      costAccuracy={costAccuracy}
      riskLevel={riskLevel}
    />
  )
}

