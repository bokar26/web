'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface RunForecastRequest {
  scope: {
    period: string
    channel: string
    category: string
  }
  confidence: number
}

export interface RunForecastResponse {
  runId: string
}

/**
 * Run forecast - creates a forecast run with status 'queued'
 */
export async function runForecast(
  request: RunForecastRequest
): Promise<RunForecastResponse> {
  const { scope, confidence } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  // Insert forecast run
  const { data: run, error } = await supabase
    .from('forecast_runs')
    .insert({
      owner_user_id: userId,
      status: 'queued',
      scope_json: scope,
      confidence: confidence,
    })
    .select()
    .single()

  if (error) {
    console.error('[forecast/runForecast] Failed to create forecast run:', error)
    throw new Error(`Failed to create forecast run: ${error.message}`)
  }

  return {
    runId: run.id,
  }
}

