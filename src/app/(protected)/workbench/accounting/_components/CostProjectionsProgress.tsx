"use client"

import { ProgressBanner } from "@/features/cost-projections/components/ProgressBanner"

interface CostProjectionsProgressProps {
  runStatus: 'queued' | 'running' | 'success' | 'failed' | null
  isRunning: boolean
}

export function CostProjectionsProgress({
  runStatus,
  isRunning,
}: CostProjectionsProgressProps) {
  if (!isRunning || (runStatus !== 'queued' && runStatus !== 'running')) {
    return null
  }

  return (
    <ProgressBanner
      runStatus={runStatus === 'queued' ? 'queued' : 'running'}
      isRunning={isRunning}
    />
  )
}

