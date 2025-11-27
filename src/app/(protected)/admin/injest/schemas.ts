import { z } from 'zod'

// Schema for manual vendor creation
export const vendorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  website: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
  payload: z.record(z.any()).optional(), // Custom fields stored in JSONB
})

// Schema for bulk vendor upload (array of vendor rows)
export const bulkVendorSchema = z.array(vendorCreateSchema)

// Type exports
export type VendorCreateInput = z.infer<typeof vendorCreateSchema>

