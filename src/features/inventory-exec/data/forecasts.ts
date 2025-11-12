/**
 * Forecasts data service
 * CRUD operations for forecasts
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseForecast, Forecast } from '../types'

/**
 * Create or update forecast
 */
export async function upsertForecast(
  ownerUserId: string,
  data: Omit<SupabaseForecast, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseForecast> {
  const supabase = createServerClient()

  const { data: forecast, error } = await supabase
    .from('forecasts')
    .upsert({
      ...data,
      owner_user_id: ownerUserId,
    }, {
      onConflict: 'owner_user_id,horizon_date,sku_id,warehouse_id',
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/forecasts] Failed to upsert forecast:', error)
    throw new Error(`Failed to upsert forecast: ${error.message}`)
  }

  return forecast as SupabaseForecast
}

/**
 * List forecasts for SKU/warehouse
 */
export async function listForecasts(
  ownerUserId: string,
  options?: {
    skuId?: string
    warehouseId?: string
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<Forecast[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('forecasts')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('horizon_date', { ascending: true })

  if (options?.skuId) {
    query = query.eq('sku_id', options.skuId)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.startDate) {
    query = query.gte('horizon_date', options.startDate)
  }

  if (options?.endDate) {
    query = query.lte('horizon_date', options.endDate)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/forecasts] Failed to list forecasts:', error)
    return []
  }

  return (data || []) as Forecast[]
}

/**
 * Calculate average daily demand from forecasts
 */
export async function calculateAvgDailyDemandFromForecasts(
  ownerUserId: string,
  skuId: string,
  warehouseId: string,
  horizonDays: number = 30
): Promise<number> {
  const supabase = createServerClient()

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + horizonDays)

  const { data, error } = await supabase
    .from('forecasts')
    .select('forecast_qty, horizon_date')
    .eq('owner_user_id', ownerUserId)
    .eq('sku_id', skuId)
    .eq('warehouse_id', warehouseId)
    .gte('horizon_date', startDate.toISOString().split('T')[0])
    .lte('horizon_date', endDate.toISOString().split('T')[0])
    .order('horizon_date', { ascending: true })

  if (error || !data || data.length === 0) {
    return 0
  }

  const totalForecast = data.reduce((sum, f) => sum + Number(f.forecast_qty), 0)
  return totalForecast / horizonDays
}

