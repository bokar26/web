'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface GetRunStatusRequest {
  runId: string
}

export interface GetRunStatusResponse {
  ok: boolean
  status?: 'queued' | 'running' | 'success' | 'failed'
  error?: string
}

/**
 * Get cost projection run status
 */
export async function getRunStatus(
  request: GetRunStatusRequest
): Promise<GetRunStatusResponse> {
  const { runId } = request

  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/getRunStatus] User not authenticated')
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[cost-projections/getRunStatus] Supabase client not available')
      return { ok: false, error: 'Database connection unavailable' }
    }

    // TODO: When cost_projection_runs table is created, uncomment:
    // const { data: run, error } = await supabase
    //   .from('cost_projection_runs')
    //   .select('status')
    //   .eq('id', runId)
    //   .eq('owner_user_id', userId)
    //   .single()
    //
    // if (error) {
    //   console.error('[cost-projections/getRunStatus] Failed to get run status:', error)
    //   return { ok: false, error: `Failed to get run status: ${error.message}` }
    // }
    //
    // if (!run) {
    //   return { ok: false, error: 'Projection run not found' }
    // }

    // Stub: Simulate progress
    // In a real implementation, this would check the actual run status
    // For now, simulate: queued -> running -> success
    const runAge = Date.now() - parseInt(runId.split('_')[1] || '0')
    let status: 'queued' | 'running' | 'success' | 'failed' = 'queued'
    
    if (runAge > 10000) {
      status = 'success'
    } else if (runAge > 3000) {
      status = 'running'
    }

    return {
      ok: true,
      status,
    }
  } catch (error: any) {
    console.error('[cost-projections/getRunStatus] Error:', error)
    return { ok: false, error: error.message || 'Failed to get run status' }
  }
}

