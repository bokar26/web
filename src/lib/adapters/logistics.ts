import { SupabaseFreightForwarder } from '@/types/logistics'
import { FreightForwarder } from '@/types/search'

/**
 * Map country name to region for backward compatibility
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
 * Adapts Supabase freight_forwarder data to the existing FreightForwarder type
 * Used for backward compatibility with existing UI components
 */
export function adaptSupabaseToForwarder(
  supabaseData: SupabaseFreightForwarder
): FreightForwarder {
  return {
    id: supabaseData.id,
    name: supabaseData.name,
    country: supabaseData.country_name || 'Unknown',
    region: getRegionFromCountry(supabaseData.country_name),
    lanes: [], // Not available in Supabase schema
    avgTransitVariance: 3, // Default value
    quoteResponsiveness: 90, // Default value
    serviceRating: 4.0, // Default value
    modes: ['Sea', 'Air'], // Default value
    specialties: [], // Not available in Supabase schema
    certifications: [], // Not available in Supabase schema
    establishedYear: 2000, // Default value
    totalShipments: 1000, // Default value
    onTimePercent: 95, // Default value
    contactEmail: supabaseData.email_primary || 'N/A',
    website: supabaseData.website || undefined,
  }
}

