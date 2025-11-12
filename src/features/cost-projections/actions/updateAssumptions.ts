'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface Assumptions {
  fxRate: number
  freightIndex: number
  fuelSurcharge: number
  dutyPct: number
  shrinkPct: number
  overheadBasis: number
  leadTimeDays: number
}

export interface UpdateAssumptionsRequest {
  scope: 'global' | 'supplier'
  supplierId?: string
  assumptions: Assumptions
  ownerUserId: string
}

export interface UpdateAssumptionsResponse {
  ok: boolean
  error?: string
}

/**
 * Update cost projection assumptions
 */
export async function updateAssumptions(
  request: UpdateAssumptionsRequest
): Promise<UpdateAssumptionsResponse> {
  const { scope, supplierId, assumptions, ownerUserId } = request

  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/updateAssumptions] User not authenticated')
      return { ok: false, error: 'User not authenticated' }
    }

    if (ownerUserId !== userId) {
      console.error('[cost-projections/updateAssumptions] User ID mismatch', { ownerUserId, userId })
      return { ok: false, error: 'User ID mismatch' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[cost-projections/updateAssumptions] Supabase client not available')
      return { ok: false, error: 'Database connection unavailable' }
    }

    // TODO: When cost_assumptions table is created, implement:
    // if (scope === 'global') {
    //   await supabase
    //     .from('cost_assumptions')
    //     .upsert({
    //       owner_user_id: userId,
    //       scope: 'global',
    //       assumptions_json: assumptions,
    //       updated_at: new Date().toISOString(),
    //     })
    // } else {
    //   await supabase
    //     .from('cost_assumptions')
    //     .upsert({
    //       owner_user_id: userId,
    //       scope: 'supplier',
    //       supplier_id: supplierId,
    //       assumptions_json: assumptions,
    //       updated_at: new Date().toISOString(),
    //     })
    // }

    // Mark projections as outdated
    // await supabase
    //   .from('cost_projection_runs')
    //   .update({ status: 'outdated' })
    //   .eq('owner_user_id', userId)
    //   .eq('status', 'success')

    return {
      ok: true,
    }
  } catch (error: any) {
    console.error('[cost-projections/updateAssumptions] Error:', error)
    return { ok: false, error: error.message || 'Failed to update assumptions' }
  }
}

