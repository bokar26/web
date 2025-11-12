import { VendorSource, SupabaseVendor } from '@/types/vendors'
import { Supplier } from '@/types/search'
import { FreightForwarder } from '@/types/search'
import { Warehouse } from '@/types/search'
import { SupabaseSupplier } from '@/types/suppliers'
import { SupabaseFreightForwarder } from '@/types/logistics'

/**
 * Maps a supplier row to vendor fields for saving to public.vendors
 */
export function mapSupplierToVendor(
  supplier: Supplier | SupabaseSupplier,
  sourceId: string
): Omit<SupabaseVendor, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'> {
  // Handle both adapted Supplier and raw SupabaseSupplier
  const name = 'supplier_name' in supplier ? supplier.supplier_name : supplier.name
  const email = 'email' in supplier ? supplier.email : (supplier as Supplier).contactEmail
  const country = 'country' in supplier ? supplier.country : supplier.country
  const website = 'website' in supplier ? supplier.website : supplier.website
  const phone = 'phone' in supplier ? supplier.phone : null

  return {
    source: 'supplier' as VendorSource,
    source_id: sourceId,
    name: name || 'Unknown Supplier',
    email: email && email !== 'N/A' ? email : null,
    phone: phone || null,
    website: website || null,
    country: country || null,
    status: 'saved' as const,
    notes: null,
    payload: supplier as Record<string, any>,
  }
}

/**
 * Maps a logistics/forwarder row to vendor fields for saving to public.vendors
 */
export function mapLogisticsToVendor(
  forwarder: FreightForwarder | SupabaseFreightForwarder,
  sourceId: string
): Omit<SupabaseVendor, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'> {
  // Handle both adapted FreightForwarder and raw SupabaseFreightForwarder
  const name = forwarder.name
  const email = 'email_primary' in forwarder ? forwarder.email_primary : (forwarder as FreightForwarder).contactEmail
  const country = 'country_name' in forwarder ? forwarder.country_name : (forwarder as FreightForwarder).country
  const website = forwarder.website
  const phone = 'phone_primary' in forwarder ? forwarder.phone_primary : null

  return {
    source: 'logistics' as VendorSource,
    source_id: sourceId,
    name: name || 'Unknown Forwarder',
    email: email && email !== 'N/A' ? email : null,
    phone: phone || null,
    website: website || null,
    country: country || null,
    status: 'saved' as const,
    notes: null,
    payload: forwarder as Record<string, any>,
  }
}

/**
 * Maps a warehouse row to vendor fields for saving to public.vendors
 */
export function mapWarehouseToVendor(
  warehouse: Warehouse,
  sourceId: string
): Omit<SupabaseVendor, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'> {
  return {
    source: 'warehouse' as VendorSource,
    source_id: sourceId,
    name: warehouse.name || 'Unknown Warehouse',
    email: warehouse.contactEmail && warehouse.contactEmail !== 'N/A' ? warehouse.contactEmail : null,
    phone: null, // Warehouses may not have phone in current schema
    website: warehouse.website || null,
    country: warehouse.country || null,
    status: 'saved' as const,
    notes: null,
    payload: warehouse as Record<string, any>,
  }
}

