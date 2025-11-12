'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface RunForecastParams {
  modelId?: string
  scope: {
    period: string
    channel?: string
    category?: string
  }
  confidence: number
  horizonDays?: number
}

export interface RunForecastResult {
  runId: string
  status: 'queued' | 'running'
}

/**
 * Run a forecast - insert forecast_runs and enqueue model run
 */
export async function runForecast(
  params: RunForecastParams
): Promise<ActionResult<RunForecastResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Insert forecast run
    const { data: run, error: runError } = await supabase
      .from('forecast_runs')
      .insert({
        owner_user_id: userId,
        model_id: params.modelId || null,
        status: 'queued',
        scope_period: params.scope.period,
        scope_channel: params.scope.channel || null,
        scope_category: params.scope.category || null,
        confidence: params.confidence,
        horizon_days: params.horizonDays || 90,
      })
      .select()
      .single()

    if (runError || !run) {
      return { ok: false, error: runError?.message || 'Failed to create forecast run' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'forecast_run',
      entityId: run.id,
      action: 'create',
      afterState: { status: 'queued', scope: params.scope },
    })

    // TODO: Enqueue model run with orchestrator (mock for now)
    // In production, this would trigger an async job

    return {
      ok: true,
      data: {
        runId: run.id,
        status: 'queued',
      },
    }
  } catch (error: any) {
    console.error('[forecast.run] Error:', error)
    return { ok: false, error: error.message || 'Failed to run forecast' }
  }
}

