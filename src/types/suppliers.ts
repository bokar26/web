// Supabase type for public.suppliers table
export type SupabaseSupplier = {
  dedupe_key: string
  supplier_name: string
  website?: string | null
  email?: string | null
  phone?: string | null
  country?: string | null
  payload?: Record<string, any> | null
  source_file?: string | null
  source_row_id?: string | null
  updated_at?: string | null
}

