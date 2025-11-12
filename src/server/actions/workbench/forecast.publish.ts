'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface PublishForecastParams {
  runId: string
  version?: string
}

export interface PublishForecastResult {
  publishedForecastId: string
  lineCount: number
}

/**
 * Snapshot selected forecasts to published_forecasts + published_forecast_lines
 */
export async function publishForecast(
  params: PublishForecastParams
): Promise<ActionResult<PublishForecastResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Get forecasts for this run
    const { data: forecasts, error: forecastsError } = await supabase
      .from('forecasts')
      .select('*')
      .eq('run_id', params.runId)

    if (forecastsError) {
      return { ok: false, error: forecastsError.message || 'Failed to fetch forecasts' }
    }

    if (!forecasts || forecasts.length === 0) {
      return { ok: false, error: 'No forecasts found for this run' }
    }

    // Create published forecast
    const { data: publishedForecast, error: publishError } = await supabase
      .from('published_forecasts')
      .insert({
        owner_user_id: userId,
        run_id: params.runId,
        version: params.version || `v${Date.now()}`,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (publishError || !publishedForecast) {
      return { ok: false, error: publishError?.message || 'Failed to create published forecast' }
    }

    // Create published forecast lines
    const lines = forecasts.map((f) => ({
      published_forecast_id: publishedForecast.id,
      sku_id: f.sku_id,
      horizon_date: f.horizon_date,
      forecast_value: f.forecast_value,
      confidence_lower: f.confidence_lower,
      confidence_upper: f.confidence_upper,
    }))

    const { error: linesError } = await supabase
      .from('published_forecast_lines')
      .insert(lines)

    if (linesError) {
      return { ok: false, error: linesError.message || 'Failed to create forecast lines' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'published_forecast',
      entityId: publishedForecast.id,
      action: 'publish',
      afterState: { runId: params.runId, lineCount: lines.length },
    })

    return {
      ok: true,
      data: {
        publishedForecastId: publishedForecast.id,
        lineCount: lines.length,
      },
    }
  } catch (error: any) {
    console.error('[forecast.publish] Error:', error)
    return { ok: false, error: error.message || 'Failed to publish forecast' }
  }
}

