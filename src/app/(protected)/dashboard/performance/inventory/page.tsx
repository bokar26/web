"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Warehouse,
  BarChart3
} from "lucide-react"

export default function InventoryAvailabilityPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Availability</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export Report</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Generate Forecast
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Dashboard</span>
        <span>/</span>
        <span>Performance</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Inventory Availability</span>
      </nav>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Total SKUs</p>
              <p className="text-3xl font-bold text-blue-400">2,847</p>
              <p className="text-sm text-blue-500 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12 this month
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Stock-Out Risk</p>
              <p className="text-3xl font-bold text-red-400">23</p>
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                High priority
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Avg Turnover</p>
              <p className="text-3xl font-bold text-emerald-400">4.2x</p>
              <p className="text-sm text-emerald-500 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +0.3x improvement
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-emerald-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Warehouses</p>
              <p className="text-3xl font-bold text-purple-400">8</p>
              <p className="text-sm text-purple-500 flex items-center mt-1">
                <Warehouse className="h-4 w-4 mr-1" />
                Active locations
              </p>
            </div>
            <Warehouse className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Stock-Out Alerts */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock-Out Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-red-200">FAB-001</span>
              <Badge className="bg-red-500/20 text-red-300">Critical</Badge>
            </div>
            <p className="text-sm text-red-300">Cotton Fabric 100%</p>
            <p className="text-xs text-red-400 mt-1">2 days remaining</p>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-amber-200">TRM-001</span>
              <Badge className="bg-amber-500/20 text-amber-300">Warning</Badge>
            </div>
            <p className="text-sm text-amber-300">Zippers & Trims</p>
            <p className="text-xs text-amber-400 mt-1">5 days remaining</p>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-orange-200">PKG-001</span>
              <Badge className="bg-orange-500/20 text-orange-300">Low</Badge>
            </div>
            <p className="text-sm text-orange-300">Cardboard Boxes</p>
            <p className="text-xs text-orange-400 mt-1">8 days remaining</p>
          </div>
        </div>
      </CardContent>
        </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Inventory Levels */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Warehouse Inventory Levels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Shanghai Hub</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-32 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Los Angeles DC</span>
              <div className="flex items-center gap-2">
                <Progress value={72} className="w-32 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Hamburg Hub</span>
              <div className="flex items-center gap-2">
                <Progress value={91} className="w-32 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">91%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Miami Warehouse</span>
              <div className="flex items-center gap-2">
                <Progress value={68} className="w-32 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">68%</span>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* AI Prediction Widget */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Inventory Predictions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-200">Demand Surge Predicted</span>
              </div>
              <p className="text-sm text-blue-300">FAB-002 expected to increase 40% in next 2 weeks</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-200">Optimal Reorder Point</span>
              </div>
              <p className="text-sm text-green-300">TRM-003 should be reordered when stock reaches 500 units</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-200">Seasonal Pattern</span>
              </div>
              <p className="text-sm text-purple-300">PKG-002 shows 25% higher demand in Q4</p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* SKU Inventory Status Table */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SKU Inventory Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-900/50">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">SKU</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Description</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Current Stock</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Min Level</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">FAB-001</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Cotton Fabric 100%</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">150</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">200</td>
                <td className="py-4 px-4">
                  <Badge className="bg-red-500/20 text-red-300">Critical</Badge>
                </td>
                <td className="py-4 px-4 text-red-400">2</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">TRM-001</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Zippers & Trims</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">800</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">1000</td>
                <td className="py-4 px-4">
                  <Badge className="bg-amber-500/20 text-amber-300">Warning</Badge>
                </td>
                <td className="py-4 px-4 text-amber-400">5</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">PKG-001</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Cardboard Boxes</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2,500</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">3,000</td>
                <td className="py-4 px-4">
                  <Badge className="bg-green-500/20 text-green-300">Good</Badge>
                </td>
                <td className="py-4 px-4 text-green-400">15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
        </Card>
    </div>
  )
}
