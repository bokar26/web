'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface PublishForecastRequest {
  runId: string
}

export interface PublishForecastResponse {
  publishedAt: string
}

/**
 * Publish forecast - marks forecast run as published
 */
export async function publishForecast(
  request: PublishForecastRequest
): Promise<PublishForecastResponse> {
  const { runId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  // Verify run exists and belongs to user, and has status 'success'
  const { data: run, error: runError } = await supabase
    .from('forecast_runs')
    .select('id, status')
    .eq('id', runId)
    .eq('owner_user_id', userId)
    .single()

  if (runError || !run) {
    throw new Error('Forecast run not found or access denied')
  }

  if (run.status !== 'success') {
    throw new Error('Forecast run must be successful before publishing')
  }

  const publishedAt = new Date().toISOString()

  // Update run status to 'published' and set published_at
  const { error: updateError } = await supabase
    .from('forecast_runs')
    .update({
      status: 'published',
      published_at: publishedAt,
      updated_at: publishedAt,
    })
    .eq('id', runId)
    .eq('owner_user_id', userId)

  if (updateError) {
    console.error('[forecast/publishForecast] Failed to publish forecast:', updateError)
    throw new Error(`Failed to publish forecast: ${updateError.message}`)
  }

  return {
    publishedAt,
  }
}

