"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Search, 
  Download,
  MoreVertical,
  DollarSign,
  Box,
  Settings,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock product data
type Product = {
  id: string
  sku: string
  name: string
  category: string
  unitPrice: number
  currency: string
  pieces: number
  units: string
  components: string[]
  supplier?: string
  lastUpdated: string
  status: 'active' | 'discontinued' | 'pending'
}

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Cotton T-Shirt - Men\'s',
    category: 'T-Shirts',
    unitPrice: 12.50,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Cotton Fabric', 'Thread', 'Labels'],
    supplier: 'Supplier A',
    lastUpdated: '2024-01-15',
    status: 'active'
  },
  {
    id: 'prod-2',
    sku: 'SKU-002',
    name: 'Denim Jeans - Men\'s',
    category: 'Jeans',
    unitPrice: 45.00,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Denim Fabric', 'Zipper', 'Buttons', 'Thread'],
    supplier: 'Supplier B',
    lastUpdated: '2024-01-18',
    status: 'active'
  },
  {
    id: 'prod-3',
    sku: 'SKU-003',
    name: 'Wool Sweater',
    category: 'Sweaters',
    unitPrice: 35.75,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Wool Yarn', 'Thread'],
    supplier: 'Supplier C',
    lastUpdated: '2024-01-20',
    status: 'active'
  },
  {
    id: 'prod-4',
    sku: 'SKU-004',
    name: 'Cotton Polo Shirt',
    category: 'Polo Shirts',
    unitPrice: 18.25,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Cotton Fabric', 'Buttons', 'Thread'],
    supplier: 'Supplier A',
    lastUpdated: '2024-01-12',
    status: 'active'
  },
  {
    id: 'prod-5',
    sku: 'SKU-005',
    name: 'Athletic Shorts',
    category: 'Shorts',
    unitPrice: 22.00,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Polyester Fabric', 'Elastic', 'Thread'],
    supplier: 'Supplier D',
    lastUpdated: '2024-01-14',
    status: 'active'
  },
  {
    id: 'prod-6',
    sku: 'SKU-006',
    name: 'Leather Belt',
    category: 'Accessories',
    unitPrice: 28.50,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Leather', 'Buckle', 'Stitching'],
    supplier: 'Supplier E',
    lastUpdated: '2024-01-16',
    status: 'active'
  },
  {
    id: 'prod-7',
    sku: 'SKU-007',
    name: 'Canvas Backpack',
    category: 'Bags',
    unitPrice: 55.00,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Canvas Fabric', 'Zippers', 'Straps', 'Hardware'],
    supplier: 'Supplier F',
    lastUpdated: '2024-01-19',
    status: 'active'
  },
  {
    id: 'prod-8',
    sku: 'SKU-008',
    name: 'Wool Socks (6-Pack)',
    category: 'Socks',
    unitPrice: 15.75,
    currency: 'USD',
    pieces: 6,
    units: 'pack',
    components: ['Wool Yarn', 'Thread'],
    supplier: 'Supplier C',
    lastUpdated: '2024-01-17',
    status: 'active'
  },
  {
    id: 'prod-9',
    sku: 'SKU-009',
    name: 'Cotton Dress Shirt',
    category: 'Dress Shirts',
    unitPrice: 42.00,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Cotton Fabric', 'Buttons', 'Collar Interfacing', 'Thread'],
    supplier: 'Supplier A',
    lastUpdated: '2024-01-13',
    status: 'active'
  },
  {
    id: 'prod-10',
    sku: 'SKU-010',
    name: 'Hooded Sweatshirt',
    category: 'Hoodies',
    unitPrice: 38.50,
    currency: 'USD',
    pieces: 1,
    units: 'piece',
    components: ['Cotton Blend Fabric', 'Drawstring', 'Zipper', 'Thread'],
    supplier: 'Supplier B',
    lastUpdated: '2024-01-21',
    status: 'active'
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.sku.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.supplier?.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    return filtered
  }, [searchQuery, categoryFilter])

  const categories = Array.from(new Set(mockProducts.map(p => p.category)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'discontinued':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 md:pt-3">
        <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-800">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="dashboard-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-white" />
            <Input
              placeholder="Search by SKU, name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="dashboard-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-900/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Product Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Unit Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Pieces/Units</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Components</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.sku}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{product.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.currency} {product.unitPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {product.pieces} {product.units}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.components.slice(0, 2).map((comp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900">
                          {comp}
                        </Badge>
                      ))}
                      {product.components.length > 2 && (
                        <Badge variant="secondary" className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900">
                          +{product.components.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{product.supplier || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800">
                        <DropdownMenuItem className="text-gray-900 dark:text-white">View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-900 dark:text-white">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-900 dark:text-white">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredProducts.length === 0 && (
        <Card className="dashboard-card p-12 text-center">
          <p className="text-gray-600 dark:text-white">No products found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}

