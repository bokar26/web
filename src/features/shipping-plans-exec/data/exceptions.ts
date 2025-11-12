/**
 * Exceptions data service
 * CRUD operations for exceptions
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseException,
  Exception,
  ExceptionType,
  ExceptionSeverity,
} from '../types'

/**
 * Create an exception
 */
export async function createException(
  shipmentId: string,
  data: Omit<SupabaseException, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseException> {
  const supabase = createServerClient()

  const { data: exception, error } = await supabase
    .from('exceptions')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create exception:', error)
    throw new Error(`Failed to create exception: ${error.message}`)
  }

  return exception as SupabaseException
}

/**
 * Get exception by ID
 */
export async function getException(exceptionId: string): Promise<SupabaseException | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('exceptions')
    .select('*')
    .eq('id', exceptionId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseException
}

/**
 * List exceptions for shipment
 */
export async function listExceptionsForShipment(
  shipmentId: string,
  options?: {
    resolved?: boolean
    severity?: ExceptionSeverity
    type?: ExceptionType
  }
): Promise<SupabaseException[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('exceptions')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false })

  if (options?.resolved !== undefined) {
    if (options.resolved) {
      query = query.not('resolved_at', 'is', null)
    } else {
      query = query.is('resolved_at', null)
    }
  }

  if (options?.severity) {
    query = query.eq('severity', options.severity)
  }

  if (options?.type) {
    query = query.eq('exception_type', options.type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to list exceptions:', error)
    throw new Error(`Failed to list exceptions: ${error.message}`)
  }

  return (data || []) as SupabaseException[]
}

/**
 * Resolve exception
 */
export async function resolveException(
  exceptionId: string
): Promise<SupabaseException> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('exceptions')
    .update({
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', exceptionId)
    .select()
    .single()

  if (error) {
    console.error('Failed to resolve exception:', error)
    throw new Error(`Failed to resolve exception: ${error.message}`)
  }

  return data as SupabaseException
}

