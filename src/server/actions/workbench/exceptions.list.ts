'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'

export interface Exception {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high'
  status: 'open' | 'snoozed' | 'resolved'
  skuId?: string
  runId?: string
  detectedAt: string
  resolvedAt?: string
  notes?: string
  assignedTo?: string
}

export interface ListExceptionsParams {
  type?: 'forecast' | 'general' | 'all'
  status?: 'open' | 'snoozed' | 'resolved' | 'all'
  runId?: string
}

export interface ListExceptionsResult {
  exceptions: Exception[]
}

/**
 * List exceptions from forecast_exceptions and general exceptions tables
 */
export async function listExceptions(
  params: ListExceptionsParams = {}
): Promise<ActionResult<ListExceptionsResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    const exceptions: Exception[] = []

    // Fetch forecast exceptions if type is 'forecast' or 'all'
    if (params.type === 'forecast' || params.type === 'all' || !params.type) {
      let query = supabase
        .from('forecast_exceptions')
        .select('*')
        .eq('owner_user_id', userId)

      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status)
      }

      if (params.runId) {
        query = query.eq('run_id', params.runId)
      }

      const { data: forecastExceptions, error: forecastError } = await query

      if (forecastError) {
        console.error('[exceptions.list] Forecast exceptions error:', forecastError)
      } else if (forecastExceptions) {
        exceptions.push(
          ...forecastExceptions.map((e) => ({
            id: e.id,
            type: e.type || 'forecast',
            severity: e.severity || 'medium',
            status: e.status || 'open',
            skuId: e.sku_id,
            runId: e.run_id,
            detectedAt: e.detected_at,
            resolvedAt: e.resolved_at,
            notes: e.notes,
            assignedTo: e.assigned_to,
          }))
        )
      }
    }

    // Fetch general exceptions if type is 'general' or 'all'
    if (params.type === 'general' || params.type === 'all' || !params.type) {
      let query = supabase
        .from('exceptions')
        .select('*')
        .eq('owner_user_id', userId)

      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status)
      }

      const { data: generalExceptions, error: generalError } = await query

      if (generalError) {
        console.error('[exceptions.list] General exceptions error:', generalError)
      } else if (generalExceptions) {
        exceptions.push(
          ...generalExceptions.map((e) => ({
            id: e.id,
            type: e.type || 'general',
            severity: e.severity || 'medium',
            status: e.status || 'open',
            skuId: e.sku_id,
            detectedAt: e.detected_at,
            resolvedAt: e.resolved_at,
            notes: e.notes,
            assignedTo: e.assigned_to,
          }))
        )
      }
    }

    return {
      ok: true,
      data: {
        exceptions,
      },
    }
  } catch (error: any) {
    console.error('[exceptions.list] Error:', error)
    return { ok: false, error: error.message || 'Failed to list exceptions' }
  }
}

