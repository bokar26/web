"use client"

import { CostExceptionsBanner } from "./CostExceptionsBanner"

interface CostProjectionsExceptionsProps {
  exceptions: any[]
  onViewExceptions?: () => void
}

export function CostProjectionsExceptions({
  exceptions,
  onViewExceptions,
}: CostProjectionsExceptionsProps) {
  return (
    <CostExceptionsBanner
      exceptions={exceptions}
      onViewExceptions={onViewExceptions}
    />
  )
}

