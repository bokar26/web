'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface ExportForecastRequest {
  runId?: string
  scope?: {
    period: string
    channel: string
    category: string
  }
  format: 'csv' | 'pdf'
}

export interface ExportForecastResponse {
  url: string
}

/**
 * Export forecast - generates CSV or PDF (stub implementation)
 */
export async function exportForecast(
  request: ExportForecastRequest
): Promise<ExportForecastResponse> {
  const { runId, scope, format } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  // If runId provided, verify it belongs to user
  if (runId) {
    const { data: run, error: runError } = await supabase
      .from('forecast_runs')
      .select('id')
      .eq('id', runId)
      .eq('owner_user_id', userId)
      .single()

    if (runError || !run) {
      throw new Error('Forecast run not found or access denied')
    }
  }

  // Stub implementation: return placeholder URL
  // In production, this would generate actual CSV/PDF files
  const timestamp = Date.now()
  const filename = runId 
    ? `forecast_${runId}_${timestamp}.${format}`
    : `forecast_${scope?.period || 'all'}_${timestamp}.${format}`
  
  // Return a placeholder URL (in production, this would be a signed URL from storage)
  const url = `/api/exports/${filename}`

  return {
    url,
  }
}

