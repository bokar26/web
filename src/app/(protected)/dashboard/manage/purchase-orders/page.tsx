"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Truck
} from "lucide-react"

// Mock data for purchase orders
const purchaseOrders = [
  { 
    id: 'PO-2024-001', 
    supplier: 'Supplier A', 
    status: 'approved', 
    total: 125000, 
    items: 45, 
    orderDate: '2024-01-15', 
    expectedDelivery: '2024-02-15',
    priority: 'high',
    category: 'Raw Materials'
  },
  { 
    id: 'PO-2024-002', 
    supplier: 'Supplier B', 
    status: 'pending', 
    total: 85000, 
    items: 32, 
    orderDate: '2024-01-18', 
    expectedDelivery: '2024-02-20',
    priority: 'medium',
    category: 'Packaging'
  },
  { 
    id: 'PO-2024-003', 
    supplier: 'Supplier C', 
    status: 'shipped', 
    total: 95000, 
    items: 28, 
    orderDate: '2024-01-10', 
    expectedDelivery: '2024-02-10',
    priority: 'high',
    category: 'Components'
  },
  { 
    id: 'PO-2024-004', 
    supplier: 'Supplier D', 
    status: 'delivered', 
    total: 75000, 
    items: 15, 
    orderDate: '2024-01-05', 
    expectedDelivery: '2024-02-05',
    priority: 'low',
    category: 'Accessories'
  },
  { 
    id: 'PO-2024-005', 
    supplier: 'Supplier E', 
    status: 'cancelled', 
    total: 65000, 
    items: 22, 
    orderDate: '2024-01-12', 
    expectedDelivery: '2024-02-12',
    priority: 'medium',
    category: 'Raw Materials'
  },
]

const orderStatusData = [
  { status: 'Pending', count: 12, percentage: 24 },
  { status: 'Approved', count: 18, percentage: 36 },
  { status: 'Shipped', count: 8, percentage: 16 },
  { status: 'Delivered', count: 10, percentage: 20 },
  { status: 'Cancelled', count: 2, percentage: 4 },
]

const monthlyTrends = [
  { month: 'Jan', orders: 45, value: 450000 },
  { month: 'Feb', orders: 52, value: 520000 },
  { month: 'Mar', orders: 48, value: 480000 },
  { month: 'Apr', orders: 55, value: 550000 },
  { month: 'May', orders: 62, value: 620000 },
  { month: 'Jun', orders: 58, value: 580000 },
]

const supplierPerformance = [
  { supplier: 'Supplier A', orders: 15, onTime: 93, quality: 98, cost: 85 },
  { supplier: 'Supplier B', orders: 12, onTime: 88, quality: 95, cost: 92 },
  { supplier: 'Supplier C', orders: 10, onTime: 95, quality: 97, cost: 78 },
  { supplier: 'Supplier D', orders: 8, onTime: 90, quality: 96, cost: 88 },
  { supplier: 'Supplier E', orders: 5, onTime: 85, quality: 94, cost: 95 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || order.supplier === supplierFilter
    
    return matchesSearch && matchesStatus && matchesSupplier
  })

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Purchase Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage purchase orders, track deliveries, and monitor supplier performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">50</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  +12% vs last month
                </p>
              </div>
              <FileText className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting approval
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$2.8M</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  +8.5% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On-Time Delivery</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">92%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <Truck className="h-3 w-3 mr-1" />
                  Above target
                </p>
              </div>
              <Truck className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="search"
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier" className="text-gray-700 dark:text-gray-300">Supplier</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="Supplier A">Supplier A</SelectItem>
                  <SelectItem value="Supplier B">Supplier B</SelectItem>
                  <SelectItem value="Supplier C">Supplier C</SelectItem>
                  <SelectItem value="Supplier D">Supplier D</SelectItem>
                  <SelectItem value="Supplier E">Supplier E</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="orders" className="text-gray-700 dark:text-gray-300">Orders</TabsTrigger>
          <TabsTrigger value="analytics" className="text-gray-700 dark:text-gray-300">Analytics</TabsTrigger>
          <TabsTrigger value="suppliers" className="text-gray-700 dark:text-gray-300">Supplier Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Priority</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.supplier}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">${order.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-center">{order.items}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.orderDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.expectedDelivery}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {orderStatusData.map((entry, index) => (
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

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Monthly Order Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
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
                    <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
                    <Bar dataKey="value" fill="#10B981" name="Value ($K)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Supplier Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Orders</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">On-Time %</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Quality %</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Cost Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Overall Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierPerformance.map((supplier, index) => {
                      const overallRating = Math.round((supplier.onTime + supplier.quality + supplier.cost) / 3)
                      return (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">{supplier.supplier}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-center">{supplier.orders}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-sm font-medium ${
                              supplier.onTime >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                              supplier.onTime >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {supplier.onTime}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-sm font-medium ${
                              supplier.quality >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                              supplier.quality >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {supplier.quality}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-sm font-medium ${
                              supplier.cost >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                              supplier.cost >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {supplier.cost}/100
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={
                              overallRating >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                              overallRating >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }>
                              {overallRating}/100
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
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