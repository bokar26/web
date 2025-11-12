'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface ForecastOverrideParams {
  skuId: string
  horizonDate: string
  overrideValue: number
  reason?: string
}

export interface ForecastOverrideResult {
  overrideId: string
}

/**
 * Upsert forecast override by sku_id and horizon_date
 */
export async function upsertForecastOverride(
  params: ForecastOverrideParams
): Promise<ActionResult<ForecastOverrideResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Check for existing override
    const { data: existing } = await supabase
      .from('forecast_overrides')
      .select('id, override_value')
      .eq('sku_id', params.skuId)
      .eq('horizon_date', params.horizonDate)
      .maybeSingle()

    const beforeState = existing ? { overrideValue: existing.override_value } : null

    // Upsert override
    const { data: override, error: overrideError } = await supabase
      .from('forecast_overrides')
      .upsert(
        {
          owner_user_id: userId,
          sku_id: params.skuId,
          horizon_date: params.horizonDate,
          override_value: params.overrideValue,
          reason: params.reason || null,
        },
        {
          onConflict: 'sku_id,horizon_date',
        }
      )
      .select()
      .single()

    if (overrideError || !override) {
      return { ok: false, error: overrideError?.message || 'Failed to upsert override' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'forecast_override',
      entityId: override.id,
      action: existing ? 'update' : 'create',
      beforeState,
      afterState: { overrideValue: params.overrideValue, reason: params.reason },
    })

    return {
      ok: true,
      data: {
        overrideId: override.id,
      },
    }
  } catch (error: any) {
    console.error('[forecast.override] Error:', error)
    return { ok: false, error: error.message || 'Failed to upsert override' }
  }
}

