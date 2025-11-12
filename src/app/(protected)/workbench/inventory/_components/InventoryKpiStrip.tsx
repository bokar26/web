"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Clock } from "lucide-react"

// Mock data - replace with actual Supabase query
const mockKPIs = {
  onHand: 12500,
  onOrder: 3200,
  backorder: 450,
  turns: 8.5,
  daysOfCover: 45,
}

export function InventoryKpiStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card className="dashboard-card bg-gradient-to-br from-blue-900/50 to-blue-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 mb-1">On Hand</p>
              <p className="text-2xl font-bold text-blue-200">{mockKPIs.onHand.toLocaleString()}</p>
            </div>
            <Package className="h-6 w-6 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="dashboard-card bg-gradient-to-br from-purple-900/50 to-purple-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 mb-1">On Order</p>
              <p className="text-2xl font-bold text-purple-200">{mockKPIs.onOrder.toLocaleString()}</p>
            </div>
            <Clock className="h-6 w-6 text-purple-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="dashboard-card bg-gradient-to-br from-red-900/50 to-red-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 mb-1">Backorder</p>
              <p className="text-2xl font-bold text-red-200">{mockKPIs.backorder.toLocaleString()}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="dashboard-card bg-gradient-to-br from-emerald-900/50 to-emerald-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 mb-1">Turns</p>
              <p className="text-2xl font-bold text-emerald-200">{mockKPIs.turns}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="dashboard-card bg-gradient-to-br from-cyan-900/50 to-cyan-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 mb-1">Days of Cover</p>
              <p className="text-2xl font-bold text-cyan-200">{mockKPIs.daysOfCover}</p>
            </div>
            <Clock className="h-6 w-6 text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

