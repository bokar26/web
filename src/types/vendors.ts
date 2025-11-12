// Vendor types for public.vendors table

export type VendorSource = 'supplier' | 'warehouse' | 'logistics'
export type VendorStatus = 'saved' | 'contacted' | 'approved' | 'archived'

// Supabase type for public.vendors table
export type SupabaseVendor = {
  id: string
  owner_user_id: string
  source: VendorSource
  source_id: string
  name: string
  email?: string | null
  phone?: string | null
  website?: string | null
  country?: string | null
  status: VendorStatus
  notes?: string | null
  payload?: Record<string, any> | null
  created_at?: string | null
  updated_at?: string | null
}

// UI type for vendor (matches what the Vendors page displays)
export type Vendor = {
  id: string
  source: VendorSource
  sourceId: string
  name: string
  email?: string
  phone?: string
  website?: string
  country?: string
  status: VendorStatus
  notes?: string
  payload?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

// Server action params and results
export interface SaveVendorParams {
  source: VendorSource
  sourceId: string
  ownerUserId: string
  row: Record<string, any> // Full row from source (supplier/warehouse/logistics)
}

export interface SaveVendorResult {
  upserted: boolean
  vendorId: string
  wasInsert: boolean
  error?: string
}

export interface ListVendorsParams {
  ownerUserId: string
  page?: number
  pageSize?: number
  q?: string
  status?: VendorStatus
}

export interface ListVendorsResult {
  data: SupabaseVendor[]
  total: number
  hasMore: boolean
  error?: string
}

