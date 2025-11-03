"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Clock,
  XCircle,
  CheckCircle,
  BarChart3
} from "lucide-react"

export default function BreachesExceptionsPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Breaches & Exceptions</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export Report</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Create Exception
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Dashboard</span>
        <span>/</span>
        <span>Performance</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Breaches & Exceptions</span>
      </nav>

      {/* Breach Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Critical Breaches</p>
              <p className="text-2xl font-bold text-red-400">3</p>
            </div>
          </div>
        </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Warning Breaches</p>
              <p className="text-2xl font-bold text-amber-400">12</p>
            </div>
          </div>
        </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Pending Resolution</p>
              <p className="text-2xl font-bold text-blue-400">8</p>
            </div>
          </div>
        </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Resolved This Week</p>
              <p className="text-2xl font-bold text-emerald-400">15</p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breach Trends */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Breach Trends (Last 30 Days)</h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-600 dark:text-white mx-auto mb-2" />
              <p className="text-gray-600 dark:text-white">Breach trend chart</p>
              <p className="text-sm text-gray-500">Showing decreasing trend</p>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Breach Types */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Breach Types Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Delivery Delays</span>
              <div className="flex items-center gap-2">
                <Progress value={45} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Quality Issues</span>
              <div className="flex items-center gap-2">
                <Progress value={28} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">28%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Communication Failures</span>
              <div className="flex items-center gap-2">
                <Progress value={15} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Documentation Errors</span>
              <div className="flex items-center gap-2">
                <Progress value={12} className="w-24 h-2" />
                <span className="text-sm text-gray-600 dark:text-white">12%</span>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Breach Events Table */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Breach Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-900/50">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Event ID</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Type</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Supplier</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Severity</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Created</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">BE-2024-001</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Delivery Delay</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">TextileCorp Asia</td>
                <td className="py-4 px-4">
                  <Badge className="bg-red-500/20 text-red-300">Critical</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-blue-500/20 text-blue-300">Investigating</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-01-10</td>
                <td className="py-4 px-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">BE-2024-002</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Quality Issue</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Component Manufacturing Inc</td>
                <td className="py-4 px-4">
                  <Badge className="bg-amber-500/20 text-amber-300">Warning</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Resolved</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-01-08</td>
                <td className="py-4 px-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">BE-2024-003</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Communication Failure</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Packaging Solutions Ltd</td>
                <td className="py-4 px-4">
                  <Badge className="bg-blue-500/20 text-blue-300">Low</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-gray-500/20 text-gray-900 dark:text-white">Pending</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-01-12</td>
                <td className="py-4 px-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
        </Card>
    </div>
  )
}
