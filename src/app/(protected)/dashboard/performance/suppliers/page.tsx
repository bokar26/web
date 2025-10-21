"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from "recharts"
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  Package, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Award,
  Target,
  BarChart3
} from "lucide-react"

// Mock data for supplier performance
const supplierPerformance = [
  {
    id: 'SUP-001',
    name: 'Supplier A',
    category: 'Raw Materials',
    location: 'China',
    overallScore: 95,
    onTimeDelivery: 98,
    qualityScore: 97,
    costCompetitiveness: 92,
    communicationScore: 96,
    innovationScore: 88,
    totalOrders: 150,
    totalValue: 2500000,
    avgLeadTime: 14,
    defectRate: 0.8,
    lastOrder: '2024-01-15',
    status: 'excellent',
    certifications: ['ISO 9001', 'BSCI', 'OEKO-TEX'],
    riskLevel: 'low'
  },
  {
    id: 'SUP-002',
    name: 'Supplier B',
    category: 'Packaging',
    location: 'Vietnam',
    overallScore: 87,
    onTimeDelivery: 92,
    qualityScore: 89,
    costCompetitiveness: 95,
    communicationScore: 85,
    innovationScore: 82,
    totalOrders: 85,
    totalValue: 1200000,
    avgLeadTime: 18,
    defectRate: 1.2,
    lastOrder: '2024-01-18',
    status: 'good',
    certifications: ['ISO 9001', 'FSC'],
    riskLevel: 'medium'
  },
  {
    id: 'SUP-003',
    name: 'Supplier C',
    category: 'Components',
    location: 'India',
    overallScore: 78,
    onTimeDelivery: 85,
    qualityScore: 82,
    costCompetitiveness: 88,
    communicationScore: 75,
    innovationScore: 79,
    totalOrders: 65,
    totalValue: 950000,
    avgLeadTime: 22,
    defectRate: 2.1,
    lastOrder: '2024-01-12',
    status: 'fair',
    certifications: ['ISO 9001'],
    riskLevel: 'medium'
  },
  {
    id: 'SUP-004',
    name: 'Supplier D',
    category: 'Accessories',
    location: 'Bangladesh',
    overallScore: 91,
    onTimeDelivery: 94,
    qualityScore: 93,
    costCompetitiveness: 89,
    communicationScore: 92,
    innovationScore: 87,
    totalOrders: 120,
    totalValue: 1800000,
    avgLeadTime: 16,
    defectRate: 0.9,
    lastOrder: '2024-01-20',
    status: 'excellent',
    certifications: ['ISO 9001', 'WRAP', 'SA8000'],
    riskLevel: 'low'
  },
  {
    id: 'SUP-005',
    name: 'Supplier E',
    category: 'Raw Materials',
    location: 'Turkey',
    overallScore: 72,
    onTimeDelivery: 78,
    qualityScore: 75,
    costCompetitiveness: 82,
    communicationScore: 70,
    innovationScore: 68,
    totalOrders: 45,
    totalValue: 650000,
    avgLeadTime: 25,
    defectRate: 3.2,
    lastOrder: '2024-01-08',
    status: 'poor',
    certifications: ['ISO 9001'],
    riskLevel: 'high'
  },
]

const performanceTrends = [
  { month: 'Jan', supplierA: 95, supplierB: 87, supplierC: 78, supplierD: 91, supplierE: 72 },
  { month: 'Feb', supplierA: 96, supplierB: 88, supplierC: 79, supplierD: 92, supplierE: 73 },
  { month: 'Mar', supplierA: 94, supplierB: 86, supplierC: 77, supplierD: 90, supplierE: 71 },
  { month: 'Apr', supplierA: 97, supplierB: 89, supplierC: 80, supplierD: 93, supplierE: 74 },
  { month: 'May', supplierA: 95, supplierB: 87, supplierC: 78, supplierD: 91, supplierE: 72 },
  { month: 'Jun', supplierA: 98, supplierB: 90, supplierC: 81, supplierD: 94, supplierE: 75 },
]

const categoryPerformance = [
  { category: 'Raw Materials', avgScore: 83.5, suppliers: 2, totalValue: 3150000 },
  { category: 'Packaging', avgScore: 87, suppliers: 1, totalValue: 1200000 },
  { category: 'Components', avgScore: 78, suppliers: 1, totalValue: 950000 },
  { category: 'Accessories', avgScore: 91, suppliers: 1, totalValue: 1800000 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function SupplierPerformancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSuppliers = supplierPerformance.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Supplier Performance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor supplier performance, track KPIs, and manage supplier relationships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Users className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1 this month
                </p>
              </div>
              <Users className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">84.6%</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Above target
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On-Time Delivery</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">89.4%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  +2.1% vs last month
                </p>
              </div>
              <Clock className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk Suppliers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Filter Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="search"
                  placeholder="Search suppliers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                  <SelectItem value="Components">Components</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Performance Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk" className="text-gray-700 dark:text-gray-300">Risk Level</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All risk levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="overview" className="text-gray-700 dark:text-gray-300">Overview</TabsTrigger>
          <TabsTrigger value="detailed" className="text-gray-700 dark:text-gray-300">Detailed View</TabsTrigger>
          <TabsTrigger value="trends" className="text-gray-700 dark:text-gray-300">Performance Trends</TabsTrigger>
          <TabsTrigger value="categories" className="text-gray-700 dark:text-gray-300">Category Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">{supplier.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.category} • {supplier.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(supplier.status)}>
                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                      </Badge>
                      <Badge className={getRiskColor(supplier.riskLevel)}>
                        {supplier.riskLevel.charAt(0).toUpperCase() + supplier.riskLevel.slice(1)} Risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{supplier.overallScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{supplier.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">${(supplier.totalValue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Lead Time</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{supplier.avgLeadTime} days</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">On-Time Delivery</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{supplier.onTimeDelivery}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Quality Score</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{supplier.qualityScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Cost Competitiveness</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{supplier.costCompetitiveness}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Detailed Supplier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">On-Time %</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Quality %</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Cost Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Communication</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Innovation</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Defect Rate</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.category}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-lg font-bold ${
                            supplier.overallScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.overallScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                            supplier.overallScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.overallScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.onTimeDelivery >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.onTimeDelivery >= 90 ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.onTimeDelivery}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.qualityScore >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.qualityScore >= 90 ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.qualityScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.costCompetitiveness >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.costCompetitiveness >= 80 ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.costCompetitiveness}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.communicationScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.communicationScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.communicationScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.innovationScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.innovationScore >= 75 ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.innovationScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            supplier.defectRate <= 1 ? 'text-emerald-600 dark:text-emerald-400' :
                            supplier.defectRate <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {supplier.defectRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getStatusColor(supplier.status)}>
                            {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                          </Badge>
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
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Supplier Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceTrends}>
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
                  <Line type="monotone" dataKey="supplierA" stroke="#10B981" strokeWidth={2} name="Supplier A" />
                  <Line type="monotone" dataKey="supplierB" stroke="#3B82F6" strokeWidth={2} name="Supplier B" />
                  <Line type="monotone" dataKey="supplierC" stroke="#F59E0B" strokeWidth={2} name="Supplier C" />
                  <Line type="monotone" dataKey="supplierD" stroke="#8B5CF6" strokeWidth={2} name="Supplier D" />
                  <Line type="monotone" dataKey="supplierE" stroke="#EF4444" strokeWidth={2} name="Supplier E" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Category Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryPerformance.map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{category.category}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Score</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{category.avgScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Suppliers</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{category.suppliers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${(category.totalValue / 1000000).toFixed(1)}M</span>
                      </div>
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
