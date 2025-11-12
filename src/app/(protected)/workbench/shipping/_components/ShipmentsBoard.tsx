"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ship, Package, Clock, CheckCircle } from "lucide-react"
// import { listShipments } from "@/features/shipping-plans-exec/data/shipments"
import type { SupabaseShipment } from "@/features/shipping-plans-exec/types"

const STATUS_COLUMNS = [
  { id: "planned", label: "Planned", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  { id: "booked", label: "Booked", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
  { id: "in_transit", label: "In Transit", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400" },
  { id: "delivered", label: "Delivered", color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
]

interface ShipmentsBoardProps {
  onShipmentClick?: (shipmentId: string) => void
  onBook?: (shipmentId: string) => void
}

export function ShipmentsBoard({ onShipmentClick, onBook }: ShipmentsBoardProps) {
  const { user } = useUser()
  const [shipments, setShipments] = useState<SupabaseShipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadShipments = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        // TODO: Create server action or API route for client-side fetching
        // For now, using mock data
        // const result = await listShipments({ ownerUserId: user.id })
        // setShipments(result.shipments || [])
        setShipments([])
      } catch (error) {
        console.error("[ShipmentsBoard] Failed to load shipments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadShipments()
  }, [user?.id])

  const getShipmentsByStatus = (status: string) => {
    return shipments.filter((s) => s.status === status)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Clock className="h-4 w-4" />
      case "booked":
        return <Package className="h-4 w-4" />
      case "in_transit":
        return <Ship className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading shipments...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUS_COLUMNS.map((column) => {
        const columnShipments = getShipmentsByStatus(column.id)
        return (
          <Card key={column.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {getStatusIcon(column.id)}
                  {column.label}
                </CardTitle>
                <Badge variant="secondary" className={column.color}>
                  {columnShipments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {columnShipments.length > 0 ? (
                columnShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                    onClick={() => onShipmentClick?.(shipment.id)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {shipment.origin_port_id || "Origin"} → {shipment.dest_port_id || "Destination"}
                    </div>
                    {shipment.planned_eta && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        ETA: {new Date(shipment.planned_eta).toLocaleDateString()}
                      </div>
                    )}
                    {shipment.status === "planned" && onBook && (
                      <Button
                        size="sm"
                        className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onBook(shipment.id)
                        }}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No shipments
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

