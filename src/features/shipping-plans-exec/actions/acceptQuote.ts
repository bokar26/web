'use server'

import { auth } from '@clerk/nextjs/server'
import {
  AcceptQuoteRequest,
  AcceptQuoteResponse,
} from '../types'
import { getQuote, updateQuote, createBooking } from '../data/quotes'
import { getShipment, updateShipment } from '../data/shipments'
import { log } from '../data/audit'
import type { StaticSailingsData } from '../types'

/**
 * Accept a quote and create booking
 */
export async function acceptQuote(
  request: AcceptQuoteRequest
): Promise<AcceptQuoteResponse> {
  const { quoteId, sailingInfo, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    throw new Error('User ID mismatch')
  }

  try {
    // Get quote
    const quote = await getQuote(quoteId)
    if (!quote) {
      throw new Error('Quote not found')
    }

    if (quote.status !== 'rfq' && quote.status !== 'quoted') {
      throw new Error(`Quote cannot be accepted in status: ${quote.status}`)
    }

    // Get shipment
    const shipment = await getShipment(ownerUserId, quote.shipment_id)
    if (!shipment) {
      throw new Error('Shipment not found')
    }

    // Update quote status
    const updatedQuote = await updateQuote(quoteId, {
      status: 'accepted',
    })

    // Create booking
    const booking = await createBooking(shipment.id, {
      quote_id: quoteId,
      carrier_id: shipment.carrier_id || null,
      voyage_number: sailingInfo.voyageNumber,
      sailing_date: sailingInfo.sailingDate,
      cutoff_date: sailingInfo.cutoffDate,
      booking_reference: `BK-${Date.now()}`,
      status: 'confirmed',
    })

    // Update shipment status
    const updatedShipment = await updateShipment(ownerUserId, shipment.id, {
      status: 'booked',
    })

    // Log audit
    await log(ownerUserId, 'quote', quoteId, 'accepted', {
      status: quote.status,
    }, {
      status: 'accepted',
    })

    await log(ownerUserId, 'booking', booking.id, 'created', undefined, {
      shipment_id: shipment.id,
      quote_id: quoteId,
      status: 'confirmed',
    })

    await log(ownerUserId, 'shipment', shipment.id, 'status_updated', {
      status: shipment.status,
    }, {
      status: 'booked',
    })

    return {
      booking,
      shipment: {
        ...updatedShipment,
        legs: shipment.legs,
        containers: shipment.containers,
        allocations: shipment.allocations,
      },
    }
  } catch (error) {
    console.error('Failed to accept quote:', error)
    throw error instanceof Error ? error : new Error('Failed to accept quote')
  }
}

