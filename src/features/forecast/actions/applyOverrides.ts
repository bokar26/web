'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface ApplyOverridesRequest {
  runId: string
}

export interface ApplyOverridesResponse {
  ok: true
}

/**
 * Apply overrides - updates effective_forecast based on override_value
 */
export async function applyOverrides(
  request: ApplyOverridesRequest
): Promise<ApplyOverridesResponse> {
  const { runId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const supabase = createServerClient()

  // Verify run belongs to user
  const { data: run, error: runError } = await supabase
    .from('forecast_runs')
    .select('id')
    .eq('id', runId)
    .eq('owner_user_id', userId)
    .single()

  if (runError || !run) {
    throw new Error('Forecast run not found or access denied')
  }

  // Get all overrides for this run
  const { data: overrides, error: overridesError } = await supabase
    .from('forecast_overrides')
    .select('id, override_value, base_forecast')
    .eq('run_id', runId)
    .eq('owner_user_id', userId)

  if (overridesError) {
    console.error('[forecast/applyOverrides] Failed to fetch overrides:', overridesError)
    throw new Error(`Failed to fetch overrides: ${overridesError.message}`)
  }

  // Update effective_forecast for each override
  if (overrides && overrides.length > 0) {
    const updates = overrides.map((override) => ({
      id: override.id,
      effective_forecast: override.override_value ?? override.base_forecast,
      updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('forecast_overrides')
        .update({
          effective_forecast: update.effective_forecast,
          updated_at: update.updated_at,
        })
        .eq('id', update.id)
        .eq('owner_user_id', userId)

      if (updateError) {
        console.error('[forecast/applyOverrides] Failed to update override:', updateError)
        throw new Error(`Failed to update override: ${updateError.message}`)
      }
    }
  }

  return { ok: true }
}

