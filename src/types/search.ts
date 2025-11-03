// Search entity types for the dashboard search section

export type Supplier = {
  id: string
  name: string
  country: string
  region: string
  onTimePercent: number
  defectRate: number
  avgLeadTimeDays: number
  riskIndex: number
  certifications: string[]
  moq: number
  minOrderValue: number
  lastOrderDate?: string
  totalOrders: number
  rating: number
  specialties: string[]
  contactEmail: string
  website?: string
}

export type Factory = {
  id: string
  name: string
  country: string
  region: string
  capabilities: string[]
  capacity: number
  utilization: number
  certifications: string[]
  complianceScore: number
  avgLeadTimeDays: number
  defectRate: number
  moq: number
  specialties: string[]
  establishedYear: number
  employeeCount: number
  contactEmail: string
  website?: string
}

export type Warehouse = {
  id: string
  name: string
  country: string
  region: string
  city: string
  capacity: number
  utilization: number
  slaPickRate: number
  slaPackRate: number
  inboundVolume: number
  outboundVolume: number
  services: string[]
  certifications: string[]
  temperatureControlled: boolean
  hazardousMaterials: boolean
  lastAuditDate: string
  contactEmail: string
  website?: string
}

export type FreightForwarder = {
  id: string
  name: string
  country: string
  region: string
  lanes: string[]
  avgTransitVariance: number
  quoteResponsiveness: number
  serviceRating: number
  modes: string[]
  specialties: string[]
  certifications: string[]
  establishedYear: number
  totalShipments: number
  onTimePercent: number
  contactEmail: string
  website?: string
}

export type Carrier = {
  id: string
  name: string
  country: string
  region: string
  modes: string[]
  lanes: string[]
  onTimePercent: number
  claimsRate: number
  costPerMile: number
  serviceLevel: string
  specialties: string[]
  certifications: string[]
  fleetSize: number
  establishedYear: number
  contactEmail: string
  website?: string
}

// Common filter types
export type FilterOption = {
  value: string
  label: string
  count?: number
}

export type SortOption = {
  value: string
  label: string
  direction: 'asc' | 'desc'
}

export type ViewMode = 'table' | 'grid'

export type SearchFilters = {
  search?: string
  country?: string[]
  region?: string[]
  certification?: string[]
  riskLevel?: string[]
  moqRange?: [number, number]
  capacityRange?: [number, number]
  utilizationRange?: [number, number]
  mode?: string[]
  service?: string[]
  specialty?: string[]
  partnerType?: string[]
  customProductTypes?: string[]
}

// Analytics event types
export type SearchEvent = 
  | 'search_view'
  | 'search_query'
  | 'filter_apply'
  | 'filter_clear'
  | 'sort_change'
  | 'view_toggle'
  | 'entity_open'
  | 'compare_click'
  | 'export_click'
  | 'saved_view_save'
  | 'saved_view_load'

export type SearchEventProperties = {
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier'
  filters?: SearchFilters
  sortBy?: string
  viewMode?: ViewMode
  entityId?: string
  resultCount?: number
}
