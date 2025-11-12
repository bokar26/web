"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useMemo } from "react"

export interface CostProjectionScope {
  period: string
  category: string
  supplier: string
  confidence: number
  runId: string | null
  tab: string
}

export function useCostProjectionScope() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const scope = useMemo<CostProjectionScope>(() => {
    try {
      const confidenceParam = searchParams.get('confidence')
      const confidence = confidenceParam ? parseInt(confidenceParam, 10) : 85
      return {
        period: searchParams.get('period') || '12',
        category: searchParams.get('category') || 'all',
        supplier: searchParams.get('supplier') || 'all',
        confidence: isNaN(confidence) ? 85 : confidence,
        runId: searchParams.get('runId'),
        tab: searchParams.get('tab') || 'workbench',
      }
    } catch (error) {
      console.error('[useCostProjectionScope] Error parsing scope:', error)
      // Return safe defaults on error
      return {
        period: '12',
        category: 'all',
        supplier: 'all',
        confidence: 85,
        runId: null,
        tab: 'workbench',
      }
    }
  }, [searchParams])

  const updateScope = (updates: Partial<CostProjectionScope>) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.period !== undefined) {
      if (updates.period === '12') {
        params.delete('period')
      } else {
        params.set('period', updates.period)
      }
    }

    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        params.delete('category')
      } else {
        params.set('category', updates.category)
      }
    }

    if (updates.supplier !== undefined) {
      if (updates.supplier === 'all') {
        params.delete('supplier')
      } else {
        params.set('supplier', updates.supplier)
      }
    }

    if (updates.confidence !== undefined) {
      if (updates.confidence === 85) {
        params.delete('confidence')
      } else {
        params.set('confidence', updates.confidence.toString())
      }
    }

    if (updates.runId !== undefined) {
      if (updates.runId === null) {
        params.delete('runId')
      } else {
        params.set('runId', updates.runId)
      }
    }

    if (updates.tab !== undefined) {
      if (updates.tab === 'workbench') {
        params.delete('tab')
      } else {
        params.set('tab', updates.tab)
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return {
    scope,
    setPeriod: (period: string) => updateScope({ period }),
    setCategory: (category: string) => updateScope({ category }),
    setSupplier: (supplier: string) => updateScope({ supplier }),
    setConfidence: (confidence: number) => updateScope({ confidence }),
    setRunId: (runId: string | null) => updateScope({ runId }),
    setTab: (tab: string) => updateScope({ tab }),
    updateScope,
  }
}

