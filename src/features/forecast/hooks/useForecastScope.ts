"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useMemo } from "react"

export interface ForecastScope {
  period: string
  channel: string
  category: string
  conf: string
  runId: string | null
}

export function useForecastScope() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const scope = useMemo<ForecastScope>(() => {
    return {
      period: searchParams.get('period') || '12m',
      channel: searchParams.get('channel') || 'all',
      category: searchParams.get('category') || 'all',
      conf: searchParams.get('conf') || '95',
      runId: searchParams.get('runId'),
    }
  }, [searchParams])

  const updateScope = (updates: Partial<ForecastScope>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (updates.period !== undefined) {
      if (updates.period === '12m') {
        params.delete('period')
      } else {
        params.set('period', updates.period)
      }
    }
    
    if (updates.channel !== undefined) {
      if (updates.channel === 'all') {
        params.delete('channel')
      } else {
        params.set('channel', updates.channel)
      }
    }
    
    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        params.delete('category')
      } else {
        params.set('category', updates.category)
      }
    }
    
    if (updates.conf !== undefined) {
      if (updates.conf === '95') {
        params.delete('conf')
      } else {
        params.set('conf', updates.conf)
      }
    }
    
    if (updates.runId !== undefined) {
      if (updates.runId === null) {
        params.delete('runId')
      } else {
        params.set('runId', updates.runId)
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return {
    scope,
    setPeriod: (period: string) => updateScope({ period }),
    setChannel: (channel: string) => updateScope({ channel }),
    setCategory: (category: string) => updateScope({ category }),
    setConf: (conf: string) => updateScope({ conf }),
    setRunId: (runId: string | null) => updateScope({ runId }),
    updateScope,
  }
}

