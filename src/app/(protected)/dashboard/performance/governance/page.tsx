"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function GovernanceContractsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 md:pt-3">
        <Button variant="outline">Export Contracts</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          New Contract
        </Button>
      </div>

      {/* Contract Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Active Contracts</p>
              <p className="text-3xl font-bold text-blue-400">47</p>
              <p className="text-sm text-blue-500 flex items-center mt-1">
                <FileText className="h-4 w-4 mr-1" />
                +3 this month
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Compliance Rate</p>
              <p className="text-3xl font-bold text-emerald-400">94.2%</p>
              <p className="text-sm text-emerald-500 flex items-center mt-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Above target
              </p>
            </div>
            <Shield className="h-8 w-8 text-emerald-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Renewals Due</p>
              <p className="text-3xl font-bold text-amber-400">8</p>
              <p className="text-sm text-amber-500 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Next 90 days
              </p>
            </div>
            <Calendar className="h-8 w-8 text-amber-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Risk Contracts</p>
              <p className="text-3xl font-bold text-red-400">3</p>
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Need attention
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals Timeline */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Renewals Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-red-400" />
              <div className="flex-1">
                <p className="font-medium text-red-200">TextileCorp Asia</p>
                <p className="text-sm text-red-300">Expires in 15 days</p>
              </div>
              <Badge className="bg-red-500/20 text-red-300">Urgent</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <p className="font-medium text-amber-200">Component Manufacturing Inc</p>
                <p className="text-sm text-amber-300">Expires in 45 days</p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300">Due Soon</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="font-medium text-blue-200">Packaging Solutions Ltd</p>
                <p className="text-sm text-blue-300">Expires in 60 days</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300">Scheduled</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="font-medium text-green-200">Accessory World</p>
                <p className="text-sm text-green-300">Expires in 90 days</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300">Planned</Badge>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Performance Trends</h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-600 dark:text-white mx-auto mb-2" />
              <p className="text-gray-600 dark:text-white">Performance trends chart</p>
              <p className="text-sm text-gray-500">Showing compliance improvements</p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* SLA Contracts Table */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SLA Contracts Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-900/50">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Contract ID</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Supplier</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">SLA Type</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Performance</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Expires</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">CON-2024-001</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">TextileCorp Asia</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Delivery SLA</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Progress value={95} className="w-16 h-2" />
                    <span className="text-sm text-gray-600 dark:text-white">95%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Compliant</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-02-15</td>
                <td className="py-4 px-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">CON-2024-002</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Component Manufacturing Inc</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Quality SLA</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="w-16 h-2" />
                    <span className="text-sm text-gray-600 dark:text-white">88%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-amber-500/20 text-amber-300">At Risk</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-03-20</td>
                <td className="py-4 px-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-4 px-4 text-gray-900 dark:text-white">CON-2024-003</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Packaging Solutions Ltd</td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Service SLA</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-16 h-2" />
                    <span className="text-sm text-gray-600 dark:text-white">92%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Compliant</Badge>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-white">2024-04-10</td>
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
