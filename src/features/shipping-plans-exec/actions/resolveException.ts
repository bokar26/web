'use server'

import { auth } from '@clerk/nextjs/server'
import { getShipment } from '../data/shipments'
import { getException, resolveException as resolveExceptionData } from '../data/exceptions'
import { log } from '../data/audit'
import type { SupabaseException } from '../types'

export interface ResolveExceptionRequest {
  exceptionId: string
  ownerUserId: string
}

export interface ResolveExceptionResponse {
  exception: SupabaseException
}

/**
 * Resolve an exception by setting resolved_at timestamp
 */
export async function resolveException(
  request: ResolveExceptionRequest
): Promise<ResolveExceptionResponse> {
  const { exceptionId, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[shipping/resolveException] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[shipping/resolveException] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get exception to verify it exists and get shipment_id
    const exception = await getException(exceptionId)
    if (!exception) {
      console.error('[shipping/resolveException] Exception not found:', exceptionId)
      throw new Error('Exception not found')
    }

    // Verify shipment belongs to owner
    const shipment = await getShipment(ownerUserId, exception.shipment_id)
    if (!shipment) {
      console.error('[shipping/resolveException] Shipment not found or access denied:', exception.shipment_id)
      throw new Error('Shipment not found or access denied')
    }

    // Resolve exception
    const resolvedException = await resolveExceptionData(exceptionId)

    // Log audit
    await log(ownerUserId, 'exception', exceptionId, 'resolve_exception', {
      exception_type: exception.exception_type,
      severity: exception.severity,
      resolved: false,
    }, {
      exception_type: exception.exception_type,
      severity: exception.severity,
      resolved: true,
      resolved_at: resolvedException.resolved_at,
    })

    return {
      exception: resolvedException,
    }
  } catch (error) {
    console.error('[shipping/resolveException] Error:', error)
    throw error instanceof Error ? error : new Error('Failed to resolve exception')
  }
}

