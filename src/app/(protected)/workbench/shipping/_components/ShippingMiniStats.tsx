"use client"

import { SummaryHeader } from "@/components/dashboard/SummaryHeader"
import { Ship, DollarSign, CheckCircle } from "lucide-react"

interface ShippingMiniStatsProps {
  totalShipments: number
  costSaved: number
  routesOptimized: number
  onViewDetails?: () => void
}

export function ShippingMiniStats({
  totalShipments,
  costSaved,
  routesOptimized,
  onViewDetails,
}: ShippingMiniStatsProps) {
  return (
    <SummaryHeader
      metrics={[
        {
          label: 'Total Shipments',
          value: totalShipments,
          onClick: onViewDetails,
          icon: <Ship className="w-4 h-4" />,
        },
        {
          label: 'Cost Saved',
          value: `$${costSaved.toLocaleString()}`,
          onClick: onViewDetails,
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: 'Routes Optimized',
          value: routesOptimized,
          onClick: onViewDetails,
          icon: <CheckCircle className="w-4 h-4" />,
        },
      ]}
    />
  )
}

