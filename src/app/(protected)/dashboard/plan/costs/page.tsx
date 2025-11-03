"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  FileText
} from "lucide-react"

// Mock data for cost projections
const costProjectionData = [
  { month: 'Jan', budget: 450000, actual: 420000, forecast: 480000, variance: -6.7 },
  { month: 'Feb', budget: 480000, actual: 465000, forecast: 520000, variance: -3.1 },
  { month: 'Mar', budget: 520000, actual: 510000, forecast: 560000, variance: -1.9 },
  { month: 'Apr', budget: 500000, actual: 520000, forecast: 540000, variance: 4.0 },
  { month: 'May', budget: 550000, actual: 540000, forecast: 580000, variance: -1.8 },
  { month: 'Jun', budget: 580000, actual: 600000, forecast: 620000, variance: 3.4 },
  { month: 'Jul', budget: 600000, actual: 590000, forecast: 640000, variance: -1.7 },
  { month: 'Aug', budget: 620000, actual: 650000, forecast: 660000, variance: 4.8 },
  { month: 'Sep', budget: 650000, actual: 640000, forecast: 680000, variance: -1.5 },
  { month: 'Oct', budget: 680000, actual: 700000, forecast: 720000, variance: 2.9 },
  { month: 'Nov', budget: 700000, actual: 720000, forecast: 750000, variance: 2.9 },
  { month: 'Dec', budget: 750000, actual: 0, forecast: 780000, variance: 0 },
]

const costBreakdown = [
  { category: 'Raw Materials', current: 35, projected: 38, trend: 'up' },
  { category: 'Labor', current: 25, projected: 26, trend: 'up' },
  { category: 'Transportation', current: 15, projected: 12, trend: 'down' },
  { category: 'Overhead', current: 12, projected: 13, trend: 'up' },
  { category: 'Packaging', current: 8, projected: 7, trend: 'down' },
  { category: 'Other', current: 5, projected: 4, trend: 'down' },
]

const supplierCosts = [
  { supplier: 'Supplier A', current: 120000, projected: 135000, variance: 12.5, status: 'high' },
  { supplier: 'Supplier B', current: 95000, projected: 98000, variance: 3.2, status: 'medium' },
  { supplier: 'Supplier C', current: 85000, projected: 82000, variance: -3.5, status: 'low' },
  { supplier: 'Supplier D', current: 75000, projected: 88000, variance: 17.3, status: 'high' },
  { supplier: 'Supplier E', current: 65000, projected: 62000, variance: -4.6, status: 'low' },
]

const costDrivers = [
  { driver: 'Material Price Inflation', impact: 15.2, confidence: 85 },
  { driver: 'Labor Cost Increase', impact: 8.7, confidence: 92 },
  { driver: 'Fuel Price Volatility', impact: 12.3, confidence: 78 },
  { driver: 'Currency Exchange Rate', impact: 6.8, confidence: 65 },
  { driver: 'Regulatory Changes', impact: 4.1, confidence: 45 },
]

const budgetVsActual = [
  { period: 'Q1', budget: 1450000, actual: 1395000, variance: -3.8 },
  { period: 'Q2', budget: 1630000, actual: 1740000, variance: 6.7 },
  { period: 'Q3', budget: 1870000, actual: 1880000, variance: 0.5 },
  { period: 'Q4', budget: 2130000, actual: 0, variance: 0 },
]

export default function CostProjectionsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("12")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState("all")

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cost Projections</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Calculator className="h-4 w-4 mr-2" />
            Update Projections
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Projection Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="period" className="text-gray-700 dark:text-white">Projection Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-700 dark:text-white">Cost Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="materials">Raw Materials</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier" className="text-gray-700 dark:text-white">Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="supplier-a">Supplier A</SelectItem>
                  <SelectItem value="supplier-b">Supplier B</SelectItem>
                  <SelectItem value="supplier-c">Supplier C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence" className="text-gray-700 dark:text-white">Confidence Level</Label>
              <Input 
                id="confidence" 
                type="number" 
                placeholder="85" 
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                defaultValue={85}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Total Projected Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$7.8M</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% vs current
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Budget Variance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">+2.3%</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Above budget
                </p>
              </div>
              <Target className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Cost Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  High accuracy
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Risk Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Medium</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Monitor closely
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="projections" className="space-y-6">
        <TabsList className="dashboard-card border">
          <TabsTrigger value="projections" className="text-gray-700 dark:text-white">Cost Projections</TabsTrigger>
          <TabsTrigger value="breakdown" className="text-gray-700 dark:text-white">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="suppliers" className="text-gray-700 dark:text-white">Supplier Costs</TabsTrigger>
          <TabsTrigger value="drivers" className="text-gray-700 dark:text-white">Cost Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Budget vs Actual vs Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={costProjectionData}>
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
                      dataKey="budget" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      name="Budget"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Actual"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecast" 
                      stackId="3" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      fillOpacity={0.3}
                      name="Forecast"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Quarterly Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetVsActual}>
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
                    <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                    <Bar dataKey="actual" fill="#10B981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Cost Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="current"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Category Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{category.category}</p>
                        <p className="text-sm text-gray-600 dark:text-white">
                          {category.current}% → {category.projected}%
                        </p>
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        category.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {category.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {category.trend === 'up' ? '+' : ''}{Math.abs(category.projected - category.current)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Supplier Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Supplier</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Current Cost</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Projected Cost</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Variance</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierCosts.map((supplier, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-200 dark:border-gray-800">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{supplier.supplier}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-white text-right">${supplier.current.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-white text-right">${supplier.projected.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-sm font-medium text-right ${
                          supplier.variance >= 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {supplier.variance >= 0 ? '+' : ''}{supplier.variance}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            supplier.status === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white' :
                            supplier.status === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white'
                          }`}>
                            {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
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

        <TabsContent value="drivers" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Cost Driver Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costDrivers.map((driver, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{driver.driver}</h3>
                      <span className="text-sm font-medium text-gray-600 dark:text-white">
                        {driver.confidence}% confidence
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-4">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(driver.impact * 2, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        driver.impact >= 10 ? 'text-red-600 dark:text-red-400' :
                        driver.impact >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {driver.impact}% impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
