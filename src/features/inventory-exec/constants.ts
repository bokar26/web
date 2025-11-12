/**
 * Constants for Inventory Execution feature
 */

// Feature keys
export const FEATURE_KEY = 'inventoryExec'

// Route names
export const ROUTES = {
  INVENTORY_PLANS: '/dashboard/plan/inventory',
} as const

// Toast messages
export const TOAST_MESSAGES = {
  PLANS_GENERATED: (count: number) => `Generated ${count} replenishment plan${count !== 1 ? 's' : ''}`,
  PLANS_ERROR: 'Failed to generate plans',
  PO_CREATED: 'Purchase order created',
  PO_ERROR: 'Failed to create purchase order',
  TRANSFER_CREATED: 'Transfer created',
  TRANSFER_ERROR: 'Failed to create transfer',
  ADJUSTMENT_POSTED: 'Adjustment posted',
  ADJUSTMENT_ERROR: 'Failed to post adjustment',
  POLICY_UPDATED: 'Policy updated',
  POLICY_ERROR: 'Failed to update policy',
  COUNT_SCHEDULED: 'Cycle count scheduled',
  COUNT_ERROR: 'Failed to schedule cycle count',
  COUNT_FINALIZED: 'Cycle count finalized',
  COUNT_FINALIZE_ERROR: 'Failed to finalize cycle count',
  PLAN_ACCEPTED: 'Plan accepted',
  PLAN_ACCEPT_ERROR: 'Failed to accept plan',
  PLAN_DISMISSED: 'Plan dismissed',
  PLAN_DISMISS_ERROR: 'Failed to dismiss plan',
} as const

// Exception types
export const EXCEPTION_TYPES = {
  STOCKOUT_RISK: 'stockout_risk',
  OVERSTOCK: 'overstock',
  NEGATIVE_ON_HAND: 'negative_on_hand',
  LATE_PO: 'late_po',
} as const

// Exception severity levels
export const EXCEPTION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

// Policy methods
export const POLICY_METHODS = {
  MINMAX: 'minmax',
  SS_DLT: 'ss-dlt',
  PERIODIC: 'periodic',
} as const

// Transaction types
export const TRANSACTION_TYPES = {
  RECEIPT: 'receipt',
  ISSUE: 'issue',
  RETURN: 'return',
  ADJUST: 'adjust',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
} as const

// Adjustment reasons
export const ADJUSTMENT_REASONS = {
  DAMAGE: 'damage',
  SHRINK: 'shrink',
  FOUND: 'found',
  OTHER: 'other',
} as const

// PO statuses
export const PO_STATUSES = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const

// Transfer statuses
export const TRANSFER_STATUSES = {
  PLANNED: 'planned',
  IN_TRANSIT: 'in_transit',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const

// Cycle count statuses
export const COUNT_STATUSES = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  POSTED: 'posted',
  CANCELLED: 'cancelled',
} as const

// Plan statuses
export const PLAN_STATUSES = {
  NEW: 'new',
  ACCEPTED: 'accepted',
  DISMISSED: 'dismissed',
  ORDERED: 'ordered',
} as const

// Plan priorities
export const PLAN_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

// Inventory Console tabs
export const INVENTORY_TABS = {
  PLANS: 'plans',
  POS: 'pos',
  TRANSFERS: 'transfers',
  ADJUSTMENTS: 'adjustments',
  COUNTS: 'counts',
  ACTIVITY: 'activity',
} as const

export type InventoryTab = typeof INVENTORY_TABS[keyof typeof INVENTORY_TABS]

// SKU Drawer tabs
export const SKU_DRAWER_TABS = {
  SNAPSHOT: 'snapshot',
  POLICY: 'policy',
  TRANSACTIONS: 'transactions',
  FORECAST: 'forecast',
  OPEN_POS_TRANSFERS: 'open-pos-transfers',
  ADJUST: 'adjust',
} as const

export type SKUDrawerTab = typeof SKU_DRAWER_TABS[keyof typeof SKU_DRAWER_TABS]

// Policy defaults
export const POLICY_DEFAULTS = {
  SERVICE_LEVEL_PCT: 95,
  LEAD_TIME_DAYS: 7,
  REVIEW_PERIOD_DAYS: 30,
  MOQ: 1,
  LOT_MULTIPLE: 1,
} as const

// Exception thresholds
export const EXCEPTION_THRESHOLDS = {
  STOCKOUT_RISK_MULTIPLIER: 0.5, // on_hand < safety_stock * 0.5
  OVERSTOCK_MULTIPLIER: 3, // on_hand > reorder_point * 3
} as const

