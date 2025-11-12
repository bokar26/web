import { SupabaseSupplier } from '@/types/suppliers'
import { Supplier } from '@/types/search'

/**
 * Map country name to region for backward compatibility
 * Reused from logistics adapter for consistency
 */
function getRegionFromCountry(country: string | null | undefined): string {
  if (!country) return 'Unknown'
  
  const regionMap: Record<string, string> = {
    'China': 'Asia Pacific',
    'India': 'South Asia',
    'Bangladesh': 'South Asia',
    'Vietnam': 'Southeast Asia',
    'Indonesia': 'Southeast Asia',
    'Pakistan': 'South Asia',
    'Turkey': 'Middle East',
    'Mexico': 'North America',
    'Brazil': 'South America',
    'Thailand': 'Southeast Asia',
  }
  
  return regionMap[country] || 'Unknown'
}

/**
 * Adapts Supabase supplier data to the existing Supplier type.
 * 
 * Field mappings:
 * - dedupe_key → id
 * - supplier_name → name
 * - email → contactEmail
 * - website → website
 * - country → country (with region derivation)
 * 
 * Default values for UI fields not in Supabase schema:
 * - Performance metrics: onTimePercent (95), defectRate (0.02), avgLeadTimeDays (30), riskIndex (3)
 * - Business metrics: moq (1000), minOrderValue (10000), totalOrders (0), rating (4.0)
 * - Arrays: certifications, specialties (extracted from payload jsonb if available, else empty)
 */
export function adaptSupabaseToSupplier(
  supabaseData: SupabaseSupplier
): Supplier {
  const payload = supabaseData.payload || {}
  
  // Extract optional fields from payload jsonb
  const certifications = Array.isArray(payload.certifications) 
    ? payload.certifications 
    : (payload.certifications ? [payload.certifications] : [])
  
  const specialties = Array.isArray(payload.specialties)
    ? payload.specialties
    : (payload.specialties ? [payload.specialties] : [])

  return {
    id: supabaseData.dedupe_key,
    name: supabaseData.supplier_name,
    country: supabaseData.country || 'Unknown',
    region: getRegionFromCountry(supabaseData.country),
    onTimePercent: payload.onTimePercent ?? 95,
    defectRate: payload.defectRate ?? 0.02,
    avgLeadTimeDays: payload.avgLeadTimeDays ?? 30,
    riskIndex: payload.riskIndex ?? 3,
    certifications: certifications,
    moq: payload.moq ?? 1000,
    minOrderValue: payload.minOrderValue ?? 10000,
    lastOrderDate: payload.lastOrderDate || undefined,
    totalOrders: payload.totalOrders ?? 0,
    rating: payload.rating ?? 4.0,
    specialties: specialties,
    contactEmail: supabaseData.email || 'N/A',
    website: supabaseData.website || undefined,
  }
}

