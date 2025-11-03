"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Factory, 
  Truck, 
  Search, 
  Download,
  Filter,
  MoreVertical,
  MapPin,
  Globe,
  Mail,
  ExternalLink
} from "lucide-react"
import { sampleSuppliers, sampleFactories, sampleForwarders, sampleCarriers } from "@/lib/mock/search"
import { Supplier, Factory as FactoryType, FreightForwarder, Carrier } from "@/types/search"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UnifiedVendor = 
  | (Supplier & { __type: 'supplier' })
  | (FactoryType & { __type: 'factory' })
  | (FreightForwarder & { __type: 'forwarder' })
  | (Carrier & { __type: 'carrier' })

// Currency mapping by country
const countryCurrencyMap: Record<string, string> = {
  'China': 'CNY',
  'India': 'INR',
  'Bangladesh': 'BDT',
  'Vietnam': 'VND',
  'Indonesia': 'IDR',
  'Pakistan': 'PKR',
  'Turkey': 'TRY',
  'Mexico': 'MXN',
  'Brazil': 'BRL',
  'Thailand': 'THB',
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'Germany': 'EUR',
  'France': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'Australia': 'AUD',
  'Canada': 'CAD',
}

const getCurrency = (country: string): string => {
  return countryCurrencyMap[country] || 'USD'
}

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [vendorTypeFilter, setVendorTypeFilter] = useState<string>("all")

  // Combine all vendors with type markers
  const allVendors = useMemo(() => {
    const suppliers = sampleSuppliers.map(s => ({ ...s, __type: 'supplier' as const }))
    const factories = sampleFactories.map(f => ({ ...f, __type: 'factory' as const }))
    const forwarders = sampleForwarders.map(f => ({ ...f, __type: 'forwarder' as const }))
    const carriers = sampleCarriers.map(c => ({ ...c, __type: 'carrier' as const }))
    return [...suppliers, ...factories, ...forwarders, ...carriers] as UnifiedVendor[]
  }, [])

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let filtered = allVendors

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.country.toLowerCase().includes(query) ||
        ('specialties' in vendor && vendor.specialties.some(s => s.toLowerCase().includes(query))) ||
        ('capabilities' in vendor && vendor.capabilities.some(c => c.toLowerCase().includes(query)))
      )
    }

    // Apply type filter
    if (vendorTypeFilter !== 'all') {
      filtered = filtered.filter(v => v.__type === vendorTypeFilter)
    }

    return filtered
  }, [allVendors, searchQuery, vendorTypeFilter])

  const getVendorTypeLabel = (type: string) => {
    switch (type) {
      case 'supplier': return 'Supplier'
      case 'factory': return 'Factory'
      case 'forwarder': return 'Freight Forwarder'
      case 'carrier': return 'Carrier'
      default: return 'Unknown'
    }
  }

  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'supplier': return Building2
      case 'factory': return Factory
      case 'forwarder': return Truck
      case 'carrier': return Truck
      default: return Building2
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendors</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="dashboard-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-white" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={vendorTypeFilter}
            onChange={(e) => setVendorTypeFilter(e.target.value)}
            className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="supplier">Suppliers</option>
            <option value="factory">Factories</option>
            <option value="forwarder">Freight Forwarders</option>
            <option value="carrier">Carriers</option>
          </select>
        </div>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => {
          const Icon = getVendorTypeIcon(vendor.__type)
          const currency = getCurrency(vendor.country)
          
          return (
            <Card key={vendor.id} className="dashboard-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {vendor.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900">
                        {getVendorTypeLabel(vendor.__type)}
                      </Badge>
                    </div>
                  </div>
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
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.country}</span>
                    <Badge variant="outline" className="ml-2 text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                      {currency}
                    </Badge>
                  </div>

                  {vendor.__type === 'supplier' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">On-Time %</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.onTimePercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">MOQ</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.moq.toLocaleString()} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Rating</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.rating}/5.0</span>
                      </div>
                    </div>
                  )}

                  {vendor.__type === 'factory' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Capacity</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.capacity.toLocaleString()} units/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Utilization</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.utilization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">Compliance</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.complianceScore}%</span>
                      </div>
                    </div>
                  )}

                  {(vendor.__type === 'forwarder' || vendor.__type === 'carrier') && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-white">On-Time %</span>
                        <span className="text-gray-900 dark:text-white font-medium">{vendor.onTimePercent}%</span>
                      </div>
                      {vendor.__type === 'forwarder' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-white">Shipments</span>
                          <span className="text-gray-900 dark:text-white font-medium">{vendor.totalShipments.toLocaleString()}</span>
                        </div>
                      )}
                      {vendor.__type === 'carrier' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-white">Fleet Size</span>
                          <span className="text-gray-900 dark:text-white font-medium">{vendor.fleetSize} vehicles</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-white truncate">{vendor.contactEmail}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredVendors.length === 0 && (
        <Card className="dashboard-card p-12 text-center">
          <p className="text-gray-600 dark:text-white">No vendors found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}

