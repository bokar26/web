"use client"

import { CostActionsBar } from "./CostActionsBar"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostProjectionsActionsProps {
  scope: Scope
  onRecompute: () => void
  onCreateScenario: () => void
  onExport: (format: 'csv' | 'pdf') => void
  onSaveBaseline: () => void
  isRunning?: boolean
  status?: string
}

export function CostProjectionsActions({
  scope,
  onRecompute,
  onCreateScenario,
  onExport,
  onSaveBaseline,
  isRunning,
  status,
}: CostProjectionsActionsProps) {
  return (
    <CostActionsBar
      scope={scope}
      onRecompute={onRecompute}
      onCreateScenario={onCreateScenario}
      onExport={onExport}
      onSaveBaseline={onSaveBaseline}
      isRunning={isRunning}
      status={status}
    />
  )
}

