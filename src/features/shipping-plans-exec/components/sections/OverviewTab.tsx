"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Ship, DollarSign } from "lucide-react"
import { useShipmentCore } from "../../hooks/useShipmentData"
import { markShipmentBooked, markShipmentDelivered } from "../../actions/markShipmentStatus"
import { TOAST_MESSAGES } from "../../constants"
import { formatMoney } from "../../utils/format"

interface OverviewTabProps {
  shipmentId?: string
}

export function OverviewTab({ shipmentId }: OverviewTabProps) {
  const { user } = useUser()
  const { data: shipment, loading, error } = useShipmentCore(shipmentId)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleMarkBooked = async () => {
    if (!shipmentId || !user?.id || shipment?.status === 'booked') return

    setIsUpdating(true)
    try {
      await markShipmentBooked({ shipmentId, ownerUserId: user.id })
      toast.success("Shipment marked as booked")
      // Data will refresh via hook
    } catch (error) {
      console.error('[OverviewTab] Failed to mark booked:', error)
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkDelivered = async () => {
    if (!shipmentId || !user?.id || shipment?.status === 'delivered') return

    setIsUpdating(true)
    try {
      await markShipmentDelivered({ shipmentId, ownerUserId: user.id })
      toast.success("Shipment marked as delivered")
      // Data will refresh via hook
    } catch (error) {
      console.error('[OverviewTab] Failed to mark delivered:', error)
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading shipment details...
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="p-4 text-center text-red-400">
        {error ? `Error: ${error.message}` : "Shipment not found"}
      </div>
    )
  }

  const isBooked = shipment.status === 'booked'
  const isDelivered = shipment.status === 'delivered'

  return (
    <div className="space-y-4">
      {/* Status & Lane */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={isBooked ? 'default' : 'secondary'}>
                {shipment.status}
              </Badge>
              <span className="text-sm text-gray-400">
                {shipment.origin_port_id || 'N/A'} → {shipment.dest_port_id || 'N/A'}
              </span>
            </div>
          </div>

          {/* ETD/ETA */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-400">ETD Planned</div>
                <div className="text-sm text-white">
                  {shipment.etd_planned ? new Date(shipment.etd_planned).toLocaleDateString() : 'N/A'}
                </div>
                {shipment.etd_actual && (
                  <div className="text-xs text-gray-500">
                    Actual: {new Date(shipment.etd_actual).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-400">ETA Planned</div>
                <div className="text-sm text-white">
                  {shipment.eta_planned ? new Date(shipment.eta_planned).toLocaleDateString() : 'N/A'}
                </div>
                {shipment.eta_actual && (
                  <div className="text-xs text-gray-500">
                    Actual: {new Date(shipment.eta_actual).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Carrier */}
          {shipment.carrier_id && (
            <div className="flex items-center gap-2 mb-4">
              <Ship className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Carrier</div>
                <div className="text-sm text-white">Carrier ID: {shipment.carrier_id}</div>
              </div>
            </div>
          )}

          {/* Cost Summary */}
          {shipment.cost_planned_usd != null && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Planned Cost</div>
                <div className="text-sm text-white">
                  {formatMoney(Number(shipment.cost_planned_usd))}
                </div>
                {shipment.cost_actual_usd != null && (
                  <div className="text-xs text-gray-500">
                    Actual: {formatMoney(Number(shipment.cost_actual_usd))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleMarkBooked}
          disabled={isBooked || isDelivered || isUpdating}
          title={isBooked ? "Already booked" : isDelivered ? "Already delivered" : undefined}
        >
          Mark Booked
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleMarkDelivered}
          disabled={isDelivered || !isBooked || isUpdating}
          title={isDelivered ? "Already delivered" : !isBooked ? "Must be booked first" : undefined}
        >
          Mark Delivered
        </Button>
      </div>
    </div>
  )
}

