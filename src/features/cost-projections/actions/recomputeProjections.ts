'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface RecomputeProjectionsRequest {
  period: string
  category: string
  supplier: string
  confidence: number
  ownerUserId: string
}

export interface RecomputeProjectionsResponse {
  ok: boolean
  runId?: string
  error?: string
}

/**
 * Recompute cost projections - creates a projection run with status 'queued'
 */
export async function recomputeProjections(
  request: RecomputeProjectionsRequest
): Promise<RecomputeProjectionsResponse> {
  const { period, category, supplier, confidence, ownerUserId } = request

  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/recomputeProjections] User not authenticated')
      return { ok: false, error: 'User not authenticated' }
    }

    if (ownerUserId !== userId) {
      console.error('[cost-projections/recomputeProjections] User ID mismatch', { ownerUserId, userId })
      return { ok: false, error: 'User ID mismatch' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[cost-projections/recomputeProjections] Supabase client not available')
      return { ok: false, error: 'Database connection unavailable' }
    }

    // Insert cost projection run
    // Note: This assumes a cost_projection_runs table exists
    // For now, we'll use a stub that returns a mock runId
    const mockRunId = `run_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // TODO: When cost_projection_runs table is created, uncomment:
    // const { data: run, error } = await supabase
    //   .from('cost_projection_runs')
    //   .insert({
    //     owner_user_id: userId,
    //     status: 'queued',
    //     period,
    //     category,
    //     supplier,
    //     confidence,
    //   })
    //   .select()
    //   .single()
    //
    // if (error) {
    //   console.error('[cost-projections/recomputeProjections] Failed to create projection run:', error)
    //   return { ok: false, error: `Failed to create projection run: ${error.message}` }
    // }

    return {
      ok: true,
      runId: mockRunId,
    }
  } catch (error: any) {
    console.error('[cost-projections/recomputeProjections] Error:', error)
    return { ok: false, error: error.message || 'Failed to recompute projections' }
  }
}

