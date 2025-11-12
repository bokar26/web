"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useShipmentRFQs, useShipmentBooking } from "../../hooks/useShipmentData"
import { createRFQ } from "../../actions/createRFQ"
import { TOAST_MESSAGES } from "../../constants"
import { formatMoney } from "../../utils/format"

interface RFQBookingTabProps {
  shipmentId?: string
}

export function RFQBookingTab({ shipmentId }: RFQBookingTabProps) {
  const { user } = useUser()
  const { data: quotes, loading: quotesLoading, error: quotesError } = useShipmentRFQs(shipmentId)
  const { data: booking, loading: bookingLoading, error: bookingError } = useShipmentBooking(shipmentId)
  const [isCreatingRFQ, setIsCreatingRFQ] = useState(false)

  const handleCreateRFQ = async () => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to create RFQ")
      return
    }

    setIsCreatingRFQ(true)
    try {
      // Get list of freight forwarders as providers (placeholder - should come from actual data)
      const providerIds: string[] = [] // TODO: Fetch from partners/forwarders table

      if (providerIds.length === 0) {
        toast.error("No providers available. Please add freight forwarders first.")
        return
      }

      await createRFQ({
        shipmentId,
        providerIds,
        ownerUserId: user.id,
      })

      toast.success(TOAST_MESSAGES.RFQ_SENT(providerIds.length))
      // Data will refresh via hook
    } catch (error) {
      console.error('[RFQBookingTab] Failed to create RFQ:', error)
      toast.error(error instanceof Error ? error.message : TOAST_MESSAGES.RFQ_ERROR)
    } finally {
      setIsCreatingRFQ(false)
    }
  }

  if (quotesLoading || bookingLoading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading RFQs and bookings...
      </div>
    )
  }

  if (quotesError || bookingError) {
    return (
      <div className="p-4 text-center text-red-400">
        {quotesError ? `Error loading quotes: ${quotesError.message}` : null}
        {bookingError ? `Error loading booking: ${bookingError.message}` : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Create RFQ Button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleCreateRFQ}
          disabled={isCreatingRFQ || !shipmentId}
        >
          {isCreatingRFQ ? "Creating..." : "Create RFQ"}
        </Button>
      </div>

      {/* Quotes List */}
      {quotes.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center text-gray-400">
            No RFQs yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {quotes.map((quote) => (
            <Card key={quote.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">
                    Quote {quote.id.slice(0, 8)}
                  </span>
                  <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                    {quote.status}
                  </Badge>
                </div>
                {quote.quoted_amount != null && (
                  <div className="text-sm text-gray-400">
                    {formatMoney(Number(quote.quoted_amount), quote.currency ?? 'USD')}
                  </div>
                )}
                {quote.provider_id && (
                  <div className="text-xs text-gray-500 mt-1">
                    Provider: {quote.provider_id}
                  </div>
                )}
                {quote.created_at && (
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {new Date(quote.created_at).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Info */}
      {booking && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">
                Booking {booking.id.slice(0, 8)}
              </span>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status}
              </Badge>
            </div>
            {booking.booking_reference && (
              <div className="text-sm text-gray-400 mb-2">
                Reference: {booking.booking_reference}
              </div>
            )}
            {booking.cutoff_date && (
              <div className="text-xs text-gray-500">
                Cutoff: {new Date(booking.cutoff_date).toLocaleDateString()}
              </div>
            )}
            {booking.voyage_number && (
              <div className="text-xs text-gray-500">
                Voyage: {booking.voyage_number}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

