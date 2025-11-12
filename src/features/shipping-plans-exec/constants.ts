/**
 * Constants for Shipping Plans Execution feature
 */

// Feature keys
export const FEATURE_KEY = 'shippingPlansExec'

// Route names
export const ROUTES = {
  SHIPPING_PLANS: '/dashboard/plan/shipping',
} as const

// Toast messages
export const TOAST_MESSAGES = {
  PLAN_APPLIED: 'Plan applied successfully',
  PLAN_APPLY_ERROR: 'Failed to apply plan',
  RFQ_SENT: (count: number) => `RFQ sent to ${count} provider${count !== 1 ? 's' : ''}`,
  RFQ_ERROR: 'Failed to send RFQ',
  QUOTE_ACCEPTED: 'Quote accepted, booking created',
  QUOTE_ACCEPT_ERROR: 'Failed to accept quote',
  DOCUMENT_GENERATED: (type: string) => `${type} generated successfully`,
  DOCUMENT_ERROR: 'Failed to generate document',
  MILESTONE_UPDATED: 'Milestone updated',
  MILESTONE_ERROR: 'Failed to update milestone',
  TASK_CREATED: 'Task created',
  TASK_ERROR: 'Failed to create task',
  COST_RECORDED: 'Cost recorded',
  COST_ERROR: 'Failed to record cost',
  VARIANCE_FLAGGED: 'Cost variance exceeds threshold',
} as const

// Document types
export const DOCUMENT_TYPES = {
  ASN: 'ASN',
  CI: 'CI',
  PL: 'PL',
} as const

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES]

// Document type array for UI
export const DOC_TYPES = ['ASN', 'CI', 'PL'] as const

// Exception types
export const EXCEPTION_TYPES = {
  ETA_SLIP: 'eta_slip',
  SAILING_CANCELED: 'sailing_canceled',
  FREE_TIME_LOW: 'free_time_low',
  COST_VARIANCE: 'cost_variance',
} as const

// Exception severity levels
export const EXCEPTION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

// Variance threshold - primitive source of truth
export const VARIANCE_THRESHOLD_PCT = 8

// Thresholds - built from primitives
export const THRESHOLDS = {
  ETA_SLIP_HOURS: 24,
  FREE_TIME_HOURS: 48,
  COST_VARIANCE_PERCENT: VARIANCE_THRESHOLD_PCT,
} as const

// Execution Console tabs
export const EXECUTION_TABS = {
  CONTAINERIZATION: 'containerization',
  ALLOCATION: 'allocation',
  BOOKINGS_RFQ: 'bookings-rfq',
  DOCS: 'docs',
  TASKS: 'tasks',
  COSTS: 'costs',
  ACTIVITY: 'activity',
} as const

export type ExecutionTab = typeof EXECUTION_TABS[keyof typeof EXECUTION_TABS]

