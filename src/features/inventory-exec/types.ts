/**
 * Types for Inventory Execution feature
 */

// ============================================================================
// Status Enums
// ============================================================================

export type POStatus = 'draft' | 'confirmed' | 'closed' | 'cancelled'
export type TransferStatus = 'planned' | 'in_transit' | 'received' | 'cancelled'
export type CycleCountStatus = 'scheduled' | 'in_progress' | 'posted' | 'cancelled'
export type PlanStatus = 'new' | 'accepted' | 'dismissed' | 'ordered'
export type PlanPriority = 'low' | 'medium' | 'high'
export type TransactionType = 'receipt' | 'issue' | 'return' | 'adjust' | 'transfer_in' | 'transfer_out'
export type AdjustmentReason = 'damage' | 'shrink' | 'found' | 'other'
export type PolicyMethod = 'minmax' | 'ss-dlt' | 'periodic'
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ExceptionType = 'stockout_risk' | 'overstock' | 'negative_on_hand' | 'late_po'

// ============================================================================
// Core Entity Types (Supabase table row types)
// ============================================================================

export type SupabaseWarehouse = {
  id: string
  owner_user_id: string
  code: string
  name: string
  address?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseInventorySnapshot = {
  id: string
  owner_user_id: string
  date: string
  sku_id: string
  warehouse_id: string
  on_hand: number
  reserved: number
  on_order: number
  backorder: number
  created_at: string
  updated_at: string
}

export type SupabaseInventoryTransaction = {
  id: string
  owner_user_id: string
  ts: string
  type: TransactionType
  sku_id: string
  warehouse_id: string
  qty: number
  unit_cost?: number | null
  doc_ref?: string | null
  meta_json?: Record<string, any> | null
  created_at: string
  updated_at: string
}

export type SupabaseReorderPolicy = {
  id: string
  owner_user_id: string
  sku_id: string
  warehouse_id: string
  method: PolicyMethod
  safety_stock?: number | null
  reorder_point?: number | null
  reorder_qty?: number | null
  lead_time_days: number
  review_period_days?: number | null
  service_level_pct?: number | null
  moq?: number | null
  lot_multiple?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseForecast = {
  id: string
  owner_user_id: string
  horizon_date: string
  sku_id: string
  warehouse_id: string
  forecast_qty: number
  model?: string | null
  version?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseReplenishmentPlan = {
  id: string
  owner_user_id: string
  sku_id: string
  warehouse_id: string
  recommended_qty: number
  priority: PlanPriority
  reason_json?: Record<string, any> | null
  status: PlanStatus
  created_at: string
  updated_at: string
}

export type SupabasePurchaseOrder = {
  id: string
  owner_user_id: string
  number: string
  supplier_id: string
  status: POStatus
  expected_date?: string | null
  created_at: string
  updated_at: string
}

export type SupabasePOLine = {
  id: string
  owner_user_id: string
  po_id: string
  sku_id: string
  qty: number
  price: number
  warehouse_id: string
  promised_date?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseTransfer = {
  id: string
  owner_user_id: string
  from_warehouse_id: string
  to_warehouse_id: string
  status: TransferStatus
  created_at: string
  updated_at: string
}

export type SupabaseTransferLine = {
  id: string
  owner_user_id: string
  transfer_id: string
  sku_id: string
  qty: number
  created_at: string
  updated_at: string
}

export type SupabaseCycleCount = {
  id: string
  owner_user_id: string
  scheduled_date: string
  warehouse_id: string
  status: CycleCountStatus
  created_at: string
  updated_at: string
}

export type SupabaseCountLine = {
  id: string
  owner_user_id: string
  cycle_count_id: string
  sku_id: string
  system_qty: number
  counted_qty?: number | null
  variance?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseStockAdjustment = {
  id: string
  owner_user_id: string
  sku_id: string
  warehouse_id: string
  qty_delta: number
  reason: AdjustmentReason
  created_at: string
  updated_at: string
}

export type SupabaseAuditLog = {
  id: string
  owner_user_id: string
  entity_type: string
  entity_id: string
  action: string
  before_state?: Record<string, any> | null
  after_state?: Record<string, any> | null
  created_at: string
}

// ============================================================================
// UI/DTO Types (for client-side use)
// ============================================================================

export type Warehouse = SupabaseWarehouse

export type InventorySnapshot = SupabaseInventorySnapshot

export type InventoryTransaction = SupabaseInventoryTransaction

export type ReorderPolicy = SupabaseReorderPolicy

export type Forecast = SupabaseForecast

export type ReplenishmentPlan = SupabaseReplenishmentPlan & {
  sku?: string
  warehouse?: Warehouse
}

export type PurchaseOrder = SupabasePurchaseOrder & {
  lines?: POLine[]
  supplier?: { id: string; name: string }
}

export type POLine = SupabasePOLine & {
  sku?: string
  warehouse?: Warehouse
}

export type Transfer = SupabaseTransfer & {
  lines?: TransferLine[]
  from_warehouse?: Warehouse
  to_warehouse?: Warehouse
}

export type TransferLine = SupabaseTransferLine & {
  sku?: string
}

export type CycleCount = SupabaseCycleCount & {
  lines?: CountLine[]
  warehouse?: Warehouse
}

export type CountLine = SupabaseCountLine & {
  sku?: string
}

export type StockAdjustment = SupabaseStockAdjustment & {
  sku?: string
  warehouse?: Warehouse
}

export type AuditLog = SupabaseAuditLog

// ============================================================================
// Request/Response DTOs for Server Actions
// ============================================================================

// Generate Replenishment Plans
export type GenerateReplenishmentPlansRequest = {
  horizonDays: number
  reviewPolicy?: 'rolling' | 'periodic'
  ownerUserId: string
}

export type GenerateReplenishmentPlansResponse = {
  planIds: string[]
  count: number
}

// Accept Replan
export type AcceptReplanRequest = {
  planId: string
  split?: {
    poPct?: number
    transferPct?: number
  }
  ownerUserId: string
}

export type POCreateRequest = {
  supplier_id: string
  lines: Array<{
    sku_id: string
    qty: number
    price: number
    warehouse_id: string
    promised_date?: string
  }>
}

export type TransferCreateRequest = {
  from_warehouse_id: string
  to_warehouse_id: string
  lines: Array<{
    sku_id: string
    qty: number
  }>
}

export type AcceptReplanResponse = {
  po?: POCreateRequest
  transfer?: TransferCreateRequest
}

// Create PO
export type CreatePORequest = {
  supplier_id: string
  lines: Array<{
    sku_id: string
    qty: number
    price: number
    warehouse_id: string
    promised_date?: string
  }>
  ownerUserId: string
}

export type CreatePOResponse = {
  poId: string
  number: string
}

// Create Transfer
export type CreateTransferRequest = {
  from_warehouse_id: string
  to_warehouse_id: string
  lines: Array<{
    sku_id: string
    qty: number
  }>
  ownerUserId: string
}

export type CreateTransferResponse = {
  transferId: string
}

// Post Adjustment
export type PostAdjustmentRequest = {
  sku_id: string
  warehouse_id: string
  qty_delta: number
  reason: AdjustmentReason
  ownerUserId: string
}

export type PostAdjustmentResponse = {
  adjustmentId: string
  transactionId: string
}

// Upsert Policy
export type UpsertPolicyRequest = {
  sku_id: string
  warehouse_id: string
  method?: PolicyMethod
  safety_stock?: number
  reorder_point?: number
  reorder_qty?: number
  lead_time_days?: number
  review_period_days?: number
  service_level_pct?: number
  moq?: number
  lot_multiple?: number
  ownerUserId: string
}

export type UpsertPolicyResponse = {
  policyId: string
}

// Schedule Cycle Count
export type ScheduleCycleCountRequest = {
  scheduled_date: string
  warehouse_id: string
  skuIds?: string[]
  ownerUserId: string
}

export type ScheduleCycleCountResponse = {
  countId: string
}

// Finalize Cycle Count
export type FinalizeCycleCountRequest = {
  cycle_count_id: string
  lines: Array<{
    sku_id: string
    counted_qty: number
  }>
  ownerUserId: string
}

export type FinalizeCycleCountResponse = {
  transactionIds: string[]
}

// Get Inventory Execution Data
export type GetInventoryExecutionDataRequest = {
  skuId?: string
  warehouseId?: string
}

export type GetInventoryExecutionDataResponse = {
  plans: ReplenishmentPlan[]
  pos: PurchaseOrder[]
  transfers: Transfer[]
  adjustments: StockAdjustment[]
  counts: CycleCount[]
  auditLogs: AuditLog[]
}

// Dismiss Plan
export type DismissPlanRequest = {
  planId: string
  ownerUserId: string
}

export type DismissPlanResponse = {
  success: boolean
}

// ============================================================================
// Error Types
// ============================================================================

export type ActionError = {
  message: string
  code?: string
  details?: Record<string, any>
}

