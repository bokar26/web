'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface ForecastException {
  id: string
  runId: string | null
  type: 'variance_spike' | 'promo_lift' | 'stockout_distortion' | 'sparse_history'
  severity: 'low' | 'medium' | 'high'
  status: 'open' | 'snoozed' | 'resolved'
  skuId: string
  detectedAt: string
  resolvedAt: string | null
  notes: string | null
  assignedTo: string | null
}

export interface ListExceptionsResponse {
  exceptions: ForecastException[]
}

/**
 * List forecast exceptions for a run or latest published scope
 */
export async function listExceptions(
  runId?: string
): Promise<ListExceptionsResponse> {
  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  let query = supabase
    .from('forecast_exceptions')
    .select('*')
    .eq('owner_user_id', userId)

  if (runId) {
    query = query.eq('run_id', runId)
  } else {
    // Get latest published run
    const { data: latestRun } = await supabase
      .from('forecast_runs')
      .select('id')
      .eq('owner_user_id', userId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    if (latestRun) {
      query = query.eq('run_id', latestRun.id)
    } else {
      // No published run, return empty array
      return { exceptions: [] }
    }
  }

  const { data: exceptions, error } = await query.order('detected_at', { ascending: false })

  if (error) {
    console.error('[forecast/listExceptions] Failed to list exceptions:', error)
    throw new Error(`Failed to list exceptions: ${error.message}`)
  }

  return {
    exceptions: (exceptions || []).map((ex) => ({
      id: ex.id,
      runId: ex.run_id,
      type: ex.type,
      severity: ex.severity,
      status: ex.status,
      skuId: ex.sku_id,
      detectedAt: ex.detected_at,
      resolvedAt: ex.resolved_at || null,
      notes: ex.notes || null,
      assignedTo: ex.assigned_to || null,
    })),
  }
}

