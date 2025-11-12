'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface GetRunStatusResponse {
  status: 'queued' | 'running' | 'success' | 'failed' | 'published'
  startedAt?: string
  completedAt?: string
  metrics?: Record<string, unknown>
}

/**
 * Get forecast run status
 */
export async function getRunStatus(
  runId: string
): Promise<GetRunStatusResponse> {
  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  const { data: run, error } = await supabase
    .from('forecast_runs')
    .select('status, started_at, completed_at, metrics_json')
    .eq('id', runId)
    .eq('owner_user_id', userId)
    .single()

  if (error) {
    console.error('[forecast/getRunStatus] Failed to get run status:', error)
    throw new Error(`Failed to get run status: ${error.message}`)
  }

  if (!run) {
    throw new Error('Forecast run not found')
  }

  return {
    status: run.status as GetRunStatusResponse['status'],
    startedAt: run.started_at || undefined,
    completedAt: run.completed_at || undefined,
    metrics: run.metrics_json as Record<string, unknown> | undefined,
  }
}

