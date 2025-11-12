/**
 * Types for Shipping Plans Execution feature
 * Extends existing domain types from @/types/search
 */

import { FreightForwarder, Carrier } from '@/types/search'

// ============================================================================
// Status Enums
// ============================================================================

export type ShipmentStatus = 'draft' | 'planned' | 'booked' | 'in_transit' | 'delivered' | 'cancelled'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type QuoteStatus = 'rfq' | 'quoted' | 'accepted' | 'rejected' | 'expired'
export type MilestoneStatus = 'planned' | 'in_progress' | 'completed' | 'delayed'
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical'
export type DocumentType = 'ASN' | 'CI' | 'PL'
export type ExceptionType = 'eta_slip' | 'sailing_canceled' | 'free_time_low' | 'cost_variance'

// ============================================================================
// Core Entity Types (Supabase table row types)
// ============================================================================

export type SupabaseShipment = {
  id: string
  owner_user_id: string
  plan_id?: string | null
  origin_port_id?: string | null
  dest_port_id?: string | null
  carrier_id?: string | null
  status: ShipmentStatus
  planned_eta?: string | null
  actual_eta?: string | null
  planned_cost?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseShipmentLeg = {
  id: string
  shipment_id: string
  leg_sequence: number
  origin_port_id?: string | null
  dest_port_id?: string | null
  carrier_id?: string | null
  mode?: string | null
  planned_departure?: string | null
  actual_departure?: string | null
  planned_arrival?: string | null
  actual_arrival?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseContainer = {
  id: string
  shipment_id: string
  container_type?: string | null
  container_number?: string | null
  status?: string | null
  utilization_pct?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseContainerItem = {
  id: string
  container_id: string
  sku_id?: string | null
  quantity?: number | null
  weight_kg?: number | null
  volume_cbm?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseAllocation = {
  id: string
  shipment_id: string
  sku_id?: string | null
  supplier_id?: string | null
  warehouse_id?: string | null
  quantity_reserved?: number | null
  quantity_allocated?: number | null
  created_at: string
  updated_at: string
}

export type SupabaseQuote = {
  id: string
  shipment_id: string
  provider_id?: string | null
  status: QuoteStatus
  quoted_amount?: number | null
  currency?: string | null
  valid_until?: string | null
  response_due?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseBooking = {
  id: string
  shipment_id: string
  quote_id?: string | null
  carrier_id?: string | null
  voyage_number?: string | null
  sailing_date?: string | null
  cutoff_date?: string | null
  booking_reference?: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
}

export type SupabaseDocument = {
  id: string
  shipment_id: string
  document_type: DocumentType
  version: number
  storage_path?: string | null
  generated_at: string
  created_by?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseCost = {
  id: string
  shipment_id: string
  cost_type?: string | null
  planned_amount?: number | null
  actual_amount?: number | null
  currency?: string | null
  variance_pct?: number | null
  recorded_at: string
  created_at: string
  updated_at: string
}

export type SupabaseException = {
  id: string
  shipment_id: string
  exception_type: ExceptionType
  severity: ExceptionSeverity
  message?: string | null
  threshold_value?: number | null
  actual_value?: number | null
  resolved_at?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseTask = {
  id: string
  shipment_id: string
  exception_id?: string | null
  title: string
  description?: string | null
  status: TaskStatus
  assigned_to?: string | null
  due_date?: string | null
  completed_at?: string | null
  created_at: string
  updated_at: string
}

export type SupabaseMilestone = {
  id: string
  shipment_id: string
  milestone_type?: string | null
  planned_date?: string | null
  actual_date?: string | null
  status: MilestoneStatus
  notes?: string | null
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

export type Shipment = SupabaseShipment & {
  legs?: ShipmentLeg[]
  containers?: Container[]
  allocations?: Allocation[]
  costs?: Cost[]
  exceptions?: Exception[]
  tasks?: Task[]
  milestones?: Milestone[]
  quotes?: Quote[]
  booking?: Booking
}

export type ShipmentLeg = SupabaseShipmentLeg

export type Container = SupabaseContainer & {
  items?: ContainerItem[]
}

export type ContainerItem = SupabaseContainerItem

export type Allocation = SupabaseAllocation

export type Quote = SupabaseQuote & {
  provider?: FreightForwarder | Carrier
}

export type Booking = SupabaseBooking

export type Document = SupabaseDocument & {
  downloadUrl?: string
}

export type Cost = SupabaseCost

export type Exception = SupabaseException

export type Task = SupabaseTask

export type Milestone = SupabaseMilestone

export type AuditLog = SupabaseAuditLog

// ============================================================================
// Request/Response DTOs for Server Actions
// ============================================================================

// Apply Plan
export type PlanPayload = {
  planId: string
  origin: { name: string; lat?: number; lng?: number }
  destination: { name: string; lat?: number; lng?: number }
  carrier: string
  recommendedETA?: string
  recommendedCost: number
  recommendedRoute?: string
  notes?: string
}

export type ApplyPlanRequest = {
  plans: PlanPayload[]
  ownerUserId: string
}

export type ShipmentSummary = {
  id: string
  planId: string
  origin: string
  destination: string
  carrier: string
  status: ShipmentStatus
  plannedEta: string | null
  plannedCost: number | null
}

export type ApplyPlanResponse = {
  shipments: ShipmentSummary[]
  createdCount: number
}

// Create RFQ
export type CreateRFQRequest = {
  shipmentIds: string[]
  providerIds: string[]
  ownerUserId: string
}

export type CreateRFQResponse = {
  quotes: Quote[]
  emailsSent: number
}

// Accept Quote
export type SailingInfo = {
  voyageNumber: string
  sailingDate: string
  cutoffDate: string
}

export type AcceptQuoteRequest = {
  quoteId: string
  sailingInfo: SailingInfo
  ownerUserId: string
}

export type AcceptQuoteResponse = {
  booking: Booking
  shipment: Shipment
}

// Generate Document
export type GenerateDocumentRequest = {
  shipmentId: string
  documentType: DocumentType
  ownerUserId: string
}

export type GenerateDocumentResponse = {
  documentId: string
  url: string
  version: number
}

// Upsert Milestone
export type MilestoneData = {
  id?: string
  milestoneType: string
  plannedDate: string
  actualDate?: string
  status: MilestoneStatus
  notes?: string
}

export type UpsertMilestoneRequest = {
  shipmentId: string
  milestone: MilestoneData
  ownerUserId: string
}

export type UpsertMilestoneResponse = {
  milestone: Milestone
  exceptions: Exception[]
}

// Create Task
export type TaskData = {
  title: string
  description?: string
  status: TaskStatus
  assignedTo?: string
  dueDate?: string
  exceptionId?: string
}

export type CreateTaskRequest = {
  shipmentId: string
  task: TaskData
  ownerUserId: string
}

export type CreateTaskResponse = {
  task: Task
}

// Upsert Cost
export type CostData = {
  id?: string
  costType: string
  plannedAmount?: number
  actualAmount?: number
  currency: string
}

export type UpsertCostRequest = {
  shipmentId: string
  cost: CostData
  ownerUserId: string
}

export type UpsertCostResponse = {
  cost: Cost
  exception?: Exception
  plannedTotal: number
  actualTotal: number
  variancePct: number
  exceptionRaised?: boolean
}

// ============================================================================
// Static Data Types
// ============================================================================

export type StaticSailing = {
  lane: string
  carrier: string
  voyageNumber: string
  sailingDate: string
  cutoffDate: string
  originPort: string
  destinationPort: string
}

export type StaticSailingsData = {
  [lane: string]: {
    [carrier: string]: StaticSailing[]
  }
}

// ============================================================================
// Error Types
// ============================================================================

export type ActionError = {
  message: string
  code?: string
  details?: Record<string, any>
}

