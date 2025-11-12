"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { getShipmentKPIs } from "../actions/getKPIs"
import { formatMoney } from "../utils/format"
import type { ShipmentKPIData } from "../data/shipments"

export function ShippingKPIs() {
  const { user } = useUser()
  const [kpiData, setKpiData] = useState<ShipmentKPIData>({
    totalShipments: 0,
    bookedShipments: 0,
    totalPlannedCost: 0,
    avgTransitDays: 0,
  })
  const [loading, setLoading] = useState(true)

  const loadKPIs = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const data = await getShipmentKPIs()
      setKpiData(data)
    } catch (error) {
      console.error('[shipping/ShippingKPIs] Failed to load KPIs:', error)
      // Keep zeros on error (already set in initial state)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKPIs()
  }, [user?.id])

  // Refresh KPIs when shipments change (exposed via window event or prop)
  useEffect(() => {
    const handleRefresh = () => {
      loadKPIs()
    }
    
    // Listen for refresh events from page
    window.addEventListener('shipping-kpis-refresh', handleRefresh)
    return () => {
      window.removeEventListener('shipping-kpis-refresh', handleRefresh)
    }
  }, [])

  if (loading) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-white">Shipping KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  const { totalShipments, bookedShipments, totalPlannedCost, avgTransitDays } = kpiData

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-white">Shipping KPIs</CardTitle>
      </CardHeader>
      <CardContent>
        {totalShipments === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">No shipments yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Shipments</p>
              <p className="text-2xl font-bold text-white">{totalShipments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Booked</p>
              <p className="text-2xl font-bold text-white">{bookedShipments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Planned Cost</p>
              <p className="text-2xl font-bold text-white">{formatMoney(totalPlannedCost)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Transit (days)</p>
              <p className="text-2xl font-bold text-white">{avgTransitDays.toFixed(1)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

