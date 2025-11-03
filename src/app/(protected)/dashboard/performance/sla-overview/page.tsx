"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Target,
  Shield,
  Zap,
  FileText,
  Calendar,
  Users,
  Package
} from "lucide-react"

// Mock data for SLA overview
const slaComplianceData = [
  { month: 'Jan', delivery: 95, quality: 98, cost: 92, overall: 95 },
  { month: 'Feb', delivery: 93, quality: 97, cost: 94, overall: 95 },
  { month: 'Mar', delivery: 96, quality: 99, cost: 91, overall: 95 },
  { month: 'Apr', delivery: 94, quality: 98, cost: 93, overall: 95 },
  { month: 'May', delivery: 97, quality: 99, cost: 90, overall: 95 },
  { month: 'Jun', delivery: 95, quality: 98, cost: 92, overall: 95 },
]

const slaBreaches = [
  { 
    id: 'BR-001', 
    supplier: 'Supplier A', 
    type: 'Delivery Delay', 
    severity: 'high', 
    impact: '$15,000', 
    date: '2024-01-15',
    status: 'resolved',
    description: 'Delivery delayed by 5 days due to customs clearance issues'
  },
  { 
    id: 'BR-002', 
    supplier: 'Supplier B', 
    type: 'Quality Issue', 
    severity: 'medium', 
    impact: '$8,500', 
    date: '2024-01-18',
    status: 'investigating',
    description: 'Quality defects found in 15% of delivered items'
  },
  { 
    id: 'BR-003', 
    supplier: 'Supplier C', 
    type: 'Cost Overrun', 
    severity: 'low', 
    impact: '$3,200', 
    date: '2024-01-20',
    status: 'resolved',
    description: 'Freight costs exceeded quoted amount by 12%'
  },
]

const slaMetrics = [
  { metric: 'On-Time Delivery', current: 95, target: 98, trend: 'up', status: 'warning' },
  { metric: 'Quality Compliance', current: 98, target: 99, trend: 'stable', status: 'good' },
  { metric: 'Cost Accuracy', current: 92, target: 95, trend: 'down', status: 'warning' },
  { metric: 'Response Time', current: 2.5, target: 2.0, trend: 'up', status: 'warning' },
]

const supplierSLA = [
  { supplier: 'Supplier A', delivery: 95, quality: 98, cost: 92, overall: 95, breaches: 2 },
  { supplier: 'Supplier B', delivery: 88, quality: 95, cost: 94, overall: 92, breaches: 1 },
  { supplier: 'Supplier C', delivery: 97, quality: 99, cost: 89, overall: 95, breaches: 0 },
  { supplier: 'Supplier D', delivery: 92, quality: 96, cost: 91, overall: 93, breaches: 1 },
  { supplier: 'Supplier E', delivery: 90, quality: 94, cost: 96, overall: 93, breaches: 0 },
]

const slaTrends = [
  { period: 'Q1 2023', compliance: 89, breaches: 12 },
  { period: 'Q2 2023', compliance: 91, breaches: 8 },
  { period: 'Q3 2023', compliance: 93, breaches: 6 },
  { period: 'Q4 2023', compliance: 95, breaches: 4 },
  { period: 'Q1 2024', compliance: 95, breaches: 3 },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white'
    case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white'
    case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white'
    case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white'
  }
}

export default function SLAOverviewPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SLA Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Shield className="h-4 w-4 mr-2" />
            Manage SLAs
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Overall SLA Compliance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% vs last month
                </p>
              </div>
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Active Breaches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5h</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Above target
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Financial Impact</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$26.7K</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -15% vs last month
                </p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Metrics */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">SLA Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {slaMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{metric.metric}</h3>
                  <span className={`text-sm font-medium ${
                    metric.status === 'good' ? 'text-emerald-600 dark:text-emerald-400' :
                    metric.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {metric.status === 'good' ? 'Good' : metric.status === 'warning' ? 'Warning' : 'Critical'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof metric.current === 'number' && metric.current < 10 ? metric.current : `${metric.current}%`}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-white">
                    Target: {typeof metric.target === 'number' && metric.target < 10 ? metric.target : `${metric.target}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.status === 'good' ? 'bg-emerald-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                    metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-white'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                     metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                     <div className="h-4 w-4" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="dashboard-card border">
          <TabsTrigger value="compliance" className="text-gray-700 dark:text-white">Compliance Trends</TabsTrigger>
          <TabsTrigger value="breaches" className="text-gray-700 dark:text-white">SLA Breaches</TabsTrigger>
          <TabsTrigger value="suppliers" className="text-gray-700 dark:text-white">Supplier Performance</TabsTrigger>
          <TabsTrigger value="trends" className="text-gray-700 dark:text-white">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">SLA Compliance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={slaComplianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="delivery" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    name="Delivery SLA"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="quality" 
                    stackId="2" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    name="Quality SLA"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stackId="3" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.3}
                    name="Cost SLA"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Recent SLA Breaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaBreaches.map((breach) => (
                  <div key={breach.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{breach.id}</h3>
                        <Badge className={getSeverityColor(breach.severity)}>
                          {breach.severity.charAt(0).toUpperCase() + breach.severity.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(breach.status)}>
                          {breach.status.charAt(0).toUpperCase() + breach.status.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-white">
                        {breach.date}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white">Supplier</p>
                        <p className="font-medium text-gray-900 dark:text-white">{breach.supplier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">{breach.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white">Financial Impact</p>
                        <p className="font-medium text-red-600 dark:text-red-400">{breach.impact}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white">{breach.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Supplier SLA Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Supplier</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Delivery SLA</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Quality SLA</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Cost SLA</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Overall</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Breaches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierSLA.map((supplier, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-200 dark:border-gray-800">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{supplier.supplier}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.delivery >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.delivery >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.delivery}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.quality >= 98 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.quality >= 95 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.quality}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.cost >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.cost >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.cost}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={
                            supplier.overall >= 95 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white' :
                            supplier.overall >= 90 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white'
                          }>
                            {supplier.overall}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.breaches === 0 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.breaches <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.breaches}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Historical SLA Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={slaTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Compliance %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="breaches" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Breaches"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
