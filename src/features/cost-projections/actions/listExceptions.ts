'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface CostProjectionException {
  id: string
  type: 'stale_quote' | 'expired_assumption' | 'missing_data'
  severity: 'low' | 'medium' | 'high'
  message: string
  detectedAt: string
}

export interface ListExceptionsRequest {
  scope?: {
    period?: string
    category?: string
    supplier?: string
  }
}

export interface ListExceptionsResponse {
  ok: boolean
  exceptions: CostProjectionException[]
  error?: string
}

/**
 * List cost projection exceptions (e.g., stale quotes)
 */
export async function listExceptions(
  request?: ListExceptionsRequest
): Promise<ListExceptionsResponse> {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/listExceptions] User not authenticated')
      return { ok: false, exceptions: [], error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[cost-projections/listExceptions] Supabase client not available')
      return { ok: true, exceptions: [], error: 'Database connection unavailable' }
    }

    // TODO: When cost_projection_exceptions table is created, implement:
    // const { data: exceptions, error } = await supabase
    //   .from('cost_projection_exceptions')
    //   .select('*')
    //   .eq('owner_user_id', userId)
    //   .eq('resolved_at', null)
    //   .order('detected_at', { ascending: false })
    //
    // if (error) {
    //   console.error('[cost-projections/listExceptions] Failed to list exceptions:', error)
    //   return { ok: false, exceptions: [], error: `Failed to list exceptions: ${error.message}` }
    // }

    // Stub: Return mock exceptions (e.g., stale quotes with expired valid_to)
    const mockExceptions: CostProjectionException[] = [
      {
        id: 'ex1',
        type: 'stale_quote',
        severity: 'medium',
        message: '3 supplier quotes have expired (valid_to date passed)',
        detectedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'ex2',
        type: 'expired_assumption',
        severity: 'low',
        message: 'FX rate assumption is older than 30 days',
        detectedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      },
    ]

    return {
      ok: true,
      exceptions: mockExceptions,
    }
  } catch (error: any) {
    console.error('[cost-projections/listExceptions] Error:', error)
    return { ok: false, exceptions: [], error: error.message || 'Failed to list exceptions' }
  }
}

