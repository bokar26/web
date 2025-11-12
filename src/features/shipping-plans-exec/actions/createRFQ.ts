'use server'

import { auth } from '@clerk/nextjs/server'
import {
  CreateRFQRequest,
  CreateRFQResponse,
  Quote,
} from '../types'
import { createQuote } from '../data/quotes'
import { getShipment } from '../data/shipments'
import { log } from '../data/audit'
import { sendRFQEmail } from '@/lib/email/resend'

/**
 * Create RFQ for selected shipments and providers
 */
export async function createRFQ(
  request: CreateRFQRequest
): Promise<CreateRFQResponse> {
  const { shipmentIds, providerIds, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    throw new Error('User ID mismatch')
  }

  const createdQuotes: Quote[] = []
  let emailsSent = 0

  try {
    // Get shipments to include in RFQ (scoped by owner_user_id)
    const shipments = await Promise.all(
      shipmentIds.map((id) => getShipment(ownerUserId, id))
    )

    const validShipments = shipments.filter((s) => s !== null)

    if (validShipments.length === 0) {
      console.error('[shipping/createRFQ] No valid shipments found for owner:', ownerUserId)
      throw new Error('No valid shipments found')
    }

    // Create quotes for each provider
    for (const providerId of providerIds) {
      // Create quote for each shipment
      for (const shipment of validShipments) {
        if (!shipment) continue

        try {
          const quote = await createQuote(shipment.id, {
            provider_id: providerId,
            status: 'rfq',
            currency: 'USD',
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            response_due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
          })

          createdQuotes.push(quote as Quote)

          // Log audit
          await log(ownerUserId, 'quote', quote.id, 'create_rfq', undefined, {
            shipment_id: shipment.id,
            provider_id: providerId,
            status: 'rfq',
          })
        } catch (quoteError: any) {
          console.error('[shipping/createRFQ] Failed to create quote:', {
            shipmentId: shipment.id,
            providerId,
            error: quoteError,
          })
          // Continue with other quotes even if one fails
        }
      }

      // Send email to provider (one email per provider with all shipments)
      try {
        await sendRFQEmail({
          to: `provider-${providerId}@example.com`, // TODO: Get actual email from provider
          providerName: `Provider ${providerId}`,
          shipmentIds: validShipments.map((s) => s!.id),
          shipmentDetails: validShipments.map((s) => ({
            id: s!.id,
            origin: s.origin_port_id || 'Unknown',
            destination: s.dest_port_id || 'Unknown',
            plannedEta: s.planned_eta,
          })),
          responseDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        })
        emailsSent++
      } catch (emailError) {
        console.error(`Failed to send email to provider ${providerId}:`, emailError)
        // Continue even if email fails
      }
    }

    return {
      quotes: createdQuotes,
      emailsSent,
    }
  } catch (error) {
    console.error('[shipping/createRFQ] Error:', error)
    
    // Handle RLS permission errors with user-friendly message
    if (error instanceof Error && (error.message.includes('Permission') || error.message.includes('permission'))) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[shipping/createRFQ] Permission issue detected - check RLS policies')
      }
    }
    
    throw error instanceof Error ? error : new Error('Failed to create RFQ')
  }
}

