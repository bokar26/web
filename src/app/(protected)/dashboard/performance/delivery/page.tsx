"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Truck, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react"

export default function DeliveryPerformancePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 md:pt-3">
        <Button variant="outline">Export Report</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          View Analytics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">On-Time Delivery</p>
              <p className="text-3xl font-bold text-emerald-400">94.2%</p>
              <p className="text-sm text-emerald-500 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.1% from last month
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </Card>

        <Card className="dashboard-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Average Delay</p>
              <p className="text-3xl font-bold text-red-400">2.3 days</p>
              <p className="text-sm text-red-500 flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                -0.5 days from last month
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-400" />
          </div>
        </Card>

        <Card className="dashboard-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Active Shipments</p>
              <p className="text-3xl font-bold text-blue-400">127</p>
              <p className="text-sm text-blue-500 flex items-center mt-1">
                <Truck className="h-4 w-4 mr-1" />
                In transit
              </p>
            </div>
            <Truck className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="dashboard-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">At Risk</p>
              <p className="text-3xl font-bold text-amber-400">8</p>
              <p className="text-sm text-amber-500 flex items-center mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Potential delays
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-400" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Map */}
        <Card className="dashboard-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Delivery Status</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-600 dark:text-white dark:text-gray-600 dark:text-white mx-auto mb-2" />
              <p className="text-gray-600 dark:text-white">Interactive delivery map</p>
              <p className="text-sm text-gray-500 dark:text-gray-600 dark:text-white">Showing 127 active shipments</p>
            </div>
          </div>
        </Card>

        {/* Delay Analysis */}
        <Card className="dashboard-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delay Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-white">Weather Delays</span>
              <div className="flex items-center gap-2">
                <Progress value={35} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-white">Customs Hold</span>
              <div className="flex items-center gap-2">
                <Progress value={28} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">28%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-white">Port Congestion</span>
              <div className="flex items-center gap-2">
                <Progress value={22} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">22%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-white">Other</span>
              <div className="flex items-center gap-2">
                <Progress value={15} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">15%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Shipment Tracking Table */}
      <Card className="dashboard-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Shipments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-900/50">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Shipment ID</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Route</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">ETA</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">SH-2024-001</td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">Shanghai → Los Angeles</td>
                <td className="py-4 px-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300">On Track</Badge>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">2024-01-15</td>
                <td className="py-4 px-4">
                  <Progress value={75} className="w-24 h-2" />
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">SH-2024-002</td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">Hamburg → New York</td>
                <td className="py-4 px-4">
                  <Badge className="bg-amber-500/20 text-amber-300">Delayed</Badge>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">2024-01-18</td>
                <td className="py-4 px-4">
                  <Progress value={45} className="w-24 h-2" />
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">SH-2024-003</td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">Singapore → Miami</td>
                <td className="py-4 px-4">
                  <Badge className="bg-blue-500/20 text-blue-300">In Transit</Badge>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">2024-01-20</td>
                <td className="py-4 px-4">
                  <Progress value={60} className="w-24 h-2" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
