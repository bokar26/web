'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface CreateReplenishmentPlanParams {
  skuIds: string[]
  warehouseId: string
  parameters: {
    method?: 'minmax' | 'ss-dlt' | 'periodic'
    safetyStock?: number
    reorderPoint?: number
    leadTimeDays?: number
    serviceLevelPct?: number
  }
  applyPolicies?: boolean
}

export interface CreateReplenishmentPlanResult {
  planId: string
  lineCount: number
}

/**
 * Create replenishment_plans from selected SKUs
 */
export async function createReplenishmentPlan(
  params: CreateReplenishmentPlanParams
): Promise<ActionResult<CreateReplenishmentPlanResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Create replenishment plan rows (one per SKU)
    const plans = params.skuIds.map((skuId) => ({
      owner_user_id: userId,
      sku_id: skuId,
      warehouse_id: params.warehouseId,
      recommended_qty: 0, // Would be calculated in production
      priority: 'medium' as const,
      status: 'new' as const,
      reason_json: params.parameters,
    }))

    const { data: createdPlans, error: plansError } = await supabase
      .from('replenishment_plans')
      .insert(plans)
      .select()

    if (plansError || !createdPlans || createdPlans.length === 0) {
      return { ok: false, error: plansError?.message || 'Failed to create replenishment plans' }
    }

    // Optionally create/update reorder policies
    if (params.applyPolicies) {
      for (const skuId of params.skuIds) {
        await supabase
          .from('reorder_policies')
          .upsert(
            {
              owner_user_id: userId,
              sku_id: skuId,
              warehouse_id: params.warehouseId,
              method: params.parameters.method || 'minmax',
              safety_stock: params.parameters.safetyStock,
              reorder_point: params.parameters.reorderPoint,
              lead_time_days: params.parameters.leadTimeDays || 7,
              service_level_pct: params.parameters.serviceLevelPct || 95,
            },
            {
              onConflict: 'sku_id,warehouse_id',
            }
          )
      }
    }

    // Log audit event for first plan
    if (createdPlans.length > 0) {
      await logAuditEvent({
        entityType: 'replenishment_plan',
        entityId: createdPlans[0].id,
        action: 'create',
        afterState: { skuCount: params.skuIds.length, warehouseId: params.warehouseId },
      })
    }

    return {
      ok: true,
      data: {
        planId: createdPlans[0].id,
        lineCount: createdPlans.length,
      },
    }
  } catch (error: any) {
    console.error('[replenishment.plan] Error:', error)
    return { ok: false, error: error.message || 'Failed to create replenishment plan' }
  }
}

