// Supabase type for public.freight_forwarders table
export type SupabaseFreightForwarder = {
  id: string
  name: string
  ff_type?: string | null
  country_name?: string | null
  country_iso2?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  email_primary?: string | null
  phone_primary?: string | null
  fax?: string | null
  website?: string | null
  responsible_people?: string | null
  notes?: string | null
}

