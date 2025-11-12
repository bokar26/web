/**
 * Quotes and bookings data service
 * CRUD operations for quotes and bookings
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseQuote,
  SupabaseBooking,
  Quote,
  Booking,
  QuoteStatus,
  BookingStatus,
} from '../types'

/**
 * Create a quote
 * Note: quotes table doesn't have owner_user_id, but we scope via shipment.owner_user_id
 */
export async function createQuote(
  shipmentId: string,
  data: Omit<SupabaseQuote, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseQuote> {
  const supabase = createServerClient()

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('[shipping/createQuote] Failed to create quote:', error)
    
    // Handle RLS permission errors
    if (error.code === 'PGRST116' || error.message?.includes('permission') || error.message?.includes('row-level')) {
      console.error('[shipping/createQuote] Permission issue - RLS may be blocking access')
      throw new Error('Permission issue: Unable to create quote. Please check your access.')
    }
    
    throw new Error(`Failed to create quote: ${error.message}`)
  }

  return quote as SupabaseQuote
}

/**
 * Get quote by ID
 */
export async function getQuote(quoteId: string): Promise<SupabaseQuote | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseQuote
}

/**
 * List quotes for shipment
 */
export async function listQuotesForShipment(
  shipmentId: string
): Promise<SupabaseQuote[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to list quotes:', error)
    throw new Error(`Failed to list quotes: ${error.message}`)
  }

  return (data || []) as SupabaseQuote[]
}

/**
 * Update quote status
 */
export async function updateQuote(
  quoteId: string,
  updates: Partial<Omit<SupabaseQuote, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseQuote> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('quotes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', quoteId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update quote:', error)
    throw new Error(`Failed to update quote: ${error.message}`)
  }

  return data as SupabaseQuote
}

/**
 * Create a booking
 */
export async function createBooking(
  shipmentId: string,
  data: Omit<SupabaseBooking, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseBooking> {
  const supabase = createServerClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create booking:', error)
    throw new Error(`Failed to create booking: ${error.message}`)
  }

  return booking as SupabaseBooking
}

/**
 * Get booking by ID
 */
export async function getBooking(bookingId: string): Promise<SupabaseBooking | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseBooking
}

/**
 * Get booking for shipment
 */
export async function getBookingForShipment(
  shipmentId: string
): Promise<SupabaseBooking | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('shipment_id', shipmentId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data as SupabaseBooking
}

/**
 * Update booking
 */
export async function updateBooking(
  bookingId: string,
  updates: Partial<Omit<SupabaseBooking, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseBooking> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update booking:', error)
    throw new Error(`Failed to update booking: ${error.message}`)
  }

  return data as SupabaseBooking
}

