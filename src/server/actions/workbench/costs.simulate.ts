'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'

export interface SimulateCostParams {
  skuIds: string[]
  originPortId?: string
  destinationPortId?: string
  freightForwarderId?: string
  quantity?: number
}

export interface CostBreakdown {
  category: string
  amount: number
  currency: string
}

export interface SimulateCostResult {
  totalCost: number
  currency: string
  breakdown: CostBreakdown[]
}

/**
 * Simulate landed cost pulling quotes, ports, freight_forwarders, costs
 */
export async function simulateCost(
  params: SimulateCostParams
): Promise<ActionResult<SimulateCostResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    const breakdown: CostBreakdown[] = []
    let totalCost = 0
    const currency = 'USD' // Default, could be pulled from quotes

    // Get quotes for SKUs
    if (params.skuIds.length > 0) {
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .in('sku_id', params.skuIds)
        .eq('owner_user_id', userId)

      if (quotes && quotes.length > 0) {
        const productCost = quotes.reduce((sum, q) => sum + (q.unit_price || 0), 0) * (params.quantity || 1)
        breakdown.push({
          category: 'Product Cost',
          amount: productCost,
          currency,
        })
        totalCost += productCost
      }
    }

    // Get freight costs if ports/forwarder specified
    if (params.originPortId && params.destinationPortId) {
      const { data: freightCosts } = await supabase
        .from('costs')
        .select('*')
        .eq('origin_port_id', params.originPortId)
        .eq('destination_port_id', params.destinationPortId)
        .eq('owner_user_id', userId)
        .maybeSingle()

      if (freightCosts) {
        const freightAmount = freightCosts.amount || 0
        breakdown.push({
          category: 'Freight',
          amount: freightAmount,
          currency,
        })
        totalCost += freightAmount
      }
    }

    // Add other cost categories (duties, insurance, etc.)
    breakdown.push({
      category: 'Duties & Taxes',
      amount: totalCost * 0.1, // 10% estimate
      currency,
    })
    totalCost += totalCost * 0.1

    breakdown.push({
      category: 'Insurance',
      amount: totalCost * 0.02, // 2% estimate
      currency,
    })
    totalCost += totalCost * 0.02

    return {
      ok: true,
      data: {
        totalCost,
        currency,
        breakdown,
      },
    }
  } catch (error: any) {
    console.error('[costs.simulate] Error:', error)
    return { ok: false, error: error.message || 'Failed to simulate cost' }
  }
}

