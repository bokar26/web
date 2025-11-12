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
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react"

// Mock data for demand forecasting
const demandForecastData = [
  { month: 'Jan', actual: 1200, forecast: 1150, accuracy: 95.8 },
  { month: 'Feb', actual: 1350, forecast: 1300, accuracy: 96.3 },
  { month: 'Mar', actual: 1420, forecast: 1400, accuracy: 98.6 },
  { month: 'Apr', actual: 1380, forecast: 1450, accuracy: 95.1 },
  { month: 'May', actual: 1500, forecast: 1480, accuracy: 98.7 },
  { month: 'Jun', actual: 1650, forecast: 1600, accuracy: 97.0 },
  { month: 'Jul', actual: 1580, forecast: 1620, accuracy: 97.5 },
  { month: 'Aug', actual: 1720, forecast: 1680, accuracy: 97.7 },
  { month: 'Sep', actual: 1680, forecast: 1700, accuracy: 98.8 },
  { month: 'Oct', actual: 1800, forecast: 1750, accuracy: 97.2 },
  { month: 'Nov', actual: 1850, forecast: 1820, accuracy: 98.4 },
  { month: 'Dec', actual: 2000, forecast: 1950, accuracy: 97.5 },
]

const seasonalTrends = [
  { season: 'Spring', demand: 4200, growth: 12.5 },
  { season: 'Summer', demand: 4800, growth: 8.2 },
  { season: 'Fall', demand: 5200, growth: 15.3 },
  { season: 'Winter', demand: 3800, growth: -5.1 },
]

const channelBreakdown = [
  { name: 'Online', value: 45, color: '#10B981' },
  { name: 'Retail', value: 30, color: '#3B82F6' },
  { name: 'Wholesale', value: 20, color: '#F59E0B' },
  { name: 'Direct', value: 5, color: '#EF4444' },
]

const skuPerformance = [
  { sku: 'SKU-001', category: 'T-Shirts', forecast: 2500, actual: 2400, variance: -4.0 },
  { sku: 'SKU-002', category: 'Jeans', forecast: 1800, actual: 1950, variance: 8.3 },
  { sku: 'SKU-003', category: 'Dresses', forecast: 1200, actual: 1150, variance: -4.2 },
  { sku: 'SKU-004', category: 'Jackets', forecast: 800, actual: 850, variance: 6.3 },
  { sku: 'SKU-005', category: 'Shoes', forecast: 1500, actual: 1600, variance: 6.7 },
]

export default function DemandForecastPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("12")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header row with actions */}
      <div className="flex items-center justify-between gap-3 pt-2 md:pt-3">
        <div></div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800 h-10">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-10">
            <Target className="h-4 w-4 mr-2" />
            Update Forecast
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Forecast Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="period" className="text-gray-700 dark:text-white">Forecast Period</Label>
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
              <Label htmlFor="channel" className="text-gray-700 dark:text-white">Sales Channel</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-700 dark:text-white">Product Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence" className="text-gray-700 dark:text-white">Confidence Level</Label>
              <Input 
                id="confidence" 
                type="number" 
                placeholder="95" 
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                defaultValue={95}
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
                <p className="text-sm font-medium text-gray-600 dark:text-white">Forecast Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">97.2%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% vs last month
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Next Month Forecast</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">18,500</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% vs current
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
                <p className="text-sm font-medium text-gray-600 dark:text-white">Seasonal Variance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">±12.5%</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Peak season ahead
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Model Confidence</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94.8%</p>
                <p className="text-xs text-gray-600 dark:text-white flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  High confidence
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList className="dashboard-card border">
          <TabsTrigger value="forecast" className="text-gray-700 dark:text-white">Forecast Trends</TabsTrigger>
          <TabsTrigger value="seasonal" className="text-gray-700 dark:text-white">Seasonal Analysis</TabsTrigger>
          <TabsTrigger value="channels" className="text-gray-700 dark:text-white">Channel Breakdown</TabsTrigger>
          <TabsTrigger value="sku" className="text-gray-700 dark:text-white">SKU Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">Demand Forecast vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={demandForecastData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Actual Demand"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Seasonal Demand Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="season" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="demand" fill="#10B981" name="Demand" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Seasonal Growth Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalTrends.map((season, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{season.season}</p>
                        <p className="text-sm text-gray-600 dark:text-white">{season.demand.toLocaleString()} units</p>
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        season.growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {season.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {season.growth >= 0 ? '+' : ''}{season.growth}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title">Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardTitle className="dashboard-card-title">Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelBreakdown.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{channel.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-white">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sku" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title">SKU Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">SKU</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Forecast</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Actual</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skuPerformance.map((sku, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-200 dark:border-gray-800">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{sku.sku}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">{sku.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-white text-right">{sku.forecast.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-white text-right">{sku.actual.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-sm font-medium text-right ${
                          sku.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {sku.variance >= 0 ? '+' : ''}{sku.variance}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
