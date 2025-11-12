"use client"

import { WorkbenchTab } from "@/features/cost-projections/components/WorkbenchTab"

interface CostWorkbenchPanelProps {
  scope: {
    period: string
    category: string
    supplier: string
    confidence: string
  }
  onEditAssumptions?: () => void
}

export function CostWorkbenchPanel({ scope, onEditAssumptions }: CostWorkbenchPanelProps) {
  return (
    <WorkbenchTab
      scope={scope}
      onEditAssumptions={onEditAssumptions}
    />
  )
}

