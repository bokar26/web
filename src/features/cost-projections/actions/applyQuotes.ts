'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export interface MappedQuote {
  supplierId: string
  category: string
  items: string
  currentRate: number
  newRate: number
}

export interface ApplyQuotesRequest {
  mappedQuotes: MappedQuote[]
  scope: {
    period?: string
    category?: string
    supplier?: string
  }
  ownerUserId: string
}

export interface ApplyQuotesResponse {
  ok: boolean
  appliedCount?: number
  error?: string
}

/**
 * Apply supplier quotes to cost projections
 */
export async function applyQuotes(
  request: ApplyQuotesRequest
): Promise<ApplyQuotesResponse> {
  const { mappedQuotes, scope, ownerUserId } = request

  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/applyQuotes] User not authenticated')
      return { ok: false, error: 'User not authenticated' }
    }

    if (ownerUserId !== userId) {
      console.error('[cost-projections/applyQuotes] User ID mismatch', { ownerUserId, userId })
      return { ok: false, error: 'User ID mismatch' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[cost-projections/applyQuotes] Supabase client not available')
      return { ok: false, error: 'Database connection unavailable' }
    }

    // TODO: When supplier_quotes table is created, implement:
    // for (const quote of mappedQuotes) {
    //   await supabase
    //     .from('supplier_quotes')
    //     .upsert({
    //       owner_user_id: userId,
    //       supplier_id: quote.supplierId,
    //       category: quote.category,
    //       items: quote.items,
    //       current_rate: quote.currentRate,
    //       new_rate: quote.newRate,
    //       applied_at: new Date().toISOString(),
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
      appliedCount: mappedQuotes.length,
    }
  } catch (error: any) {
    console.error('[cost-projections/applyQuotes] Error:', error)
    return { ok: false, error: error.message || 'Failed to apply quotes' }
  }
}

