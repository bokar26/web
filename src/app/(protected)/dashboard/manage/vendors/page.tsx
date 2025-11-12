"use client"

import { useState, useMemo, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
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
import { listVendors } from "./actions"
import { SupabaseVendor, VendorStatus } from "@/types/vendors"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Vendor type for display (adapted from SupabaseVendor)
type DisplayVendor = {
  id: string
  source: 'supplier' | 'warehouse' | 'logistics'
  sourceId: string
  name: string
  email?: string
  phone?: string
  website?: string
  country?: string
  status: VendorStatus
  notes?: string
  payload?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

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
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [vendorTypeFilter, setVendorTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allVendors, setAllVendors] = useState<DisplayVendor[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const pageSize = 25

  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      if (!user?.id) {
        // Don't set error if user is not loaded yet - just wait
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        // Defensive guard: ensure user.id exists before calling
        if (!user?.id) {
          console.warn('[vendors/page] User ID not available, skipping fetch')
          return
        }

        const result = await listVendors({
          ownerUserId: user.id,
          page: currentPage,
          pageSize,
          q: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        })

        // Defensive guard: ensure result exists
        if (!result) {
          console.warn('[vendors/page] No result returned from listVendors')
          setAllVendors([])
          setTotalResults(0)
          return
        }

        // Adapt SupabaseVendor to DisplayVendor with defensive guards
        const adapted: DisplayVendor[] = (result.data || []).map(v => ({
          id: v.id,
          source: v.source,
          sourceId: v.source_id,
          name: v.name,
          email: v.email || undefined,
          phone: v.phone || undefined,
          website: v.website || undefined,
          country: v.country || undefined,
          status: v.status,
          notes: v.notes || undefined,
          payload: v.payload || undefined,
          createdAt: v.created_at || undefined,
          updatedAt: v.updated_at || undefined,
        }))

        setAllVendors(adapted)
        setTotalResults(result.total || 0)
      } catch (err: any) {
        // Page-local error logging with prefix and full error details
        console.error('[vendors/page] Failed to fetch vendors:', {
          error: err,
          message: err?.message,
          stack: err?.stack,
          user: user?.id,
        })
        setError(err?.message || 'Failed to load vendors')
        setAllVendors([])
        setTotalResults(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [user?.id, currentPage, searchQuery, statusFilter])

  // Filter vendors (client-side filtering for type only, search is server-side)
  const filteredVendors = useMemo(() => {
    let filtered = allVendors

    // Apply type filter (server already handles search and status)
    if (vendorTypeFilter !== 'all') {
      filtered = filtered.filter(v => v.source === vendorTypeFilter)
    }

    return filtered
  }, [allVendors, vendorTypeFilter])

  const getVendorTypeLabel = (source: string) => {
    switch (source) {
      case 'supplier': return 'Supplier'
      case 'warehouse': return 'Warehouse'
      case 'logistics': return 'Logistics'
      default: return 'Unknown'
    }
  }

  const getVendorTypeIcon = (source: string) => {
    switch (source) {
      case 'supplier': return Building2
      case 'warehouse': return Factory
      case 'logistics': return Truck
      default: return Building2
    }
  }

  // Extract metrics from payload for display
  const getVendorMetrics = (vendor: DisplayVendor) => {
    if (!vendor.payload) return null

    try {
      if (vendor.source === 'supplier') {
        return {
          onTimePercent: vendor.payload.onTimePercent,
          moq: vendor.payload.moq,
          rating: vendor.payload.rating,
        }
      } else if (vendor.source === 'warehouse') {
        return {
          capacity: vendor.payload.capacity,
          utilization: vendor.payload.utilization,
          slaPickRate: vendor.payload.slaPickRate,
        }
      } else if (vendor.source === 'logistics') {
        return {
          onTimePercent: vendor.payload.onTimePercent,
          totalShipments: vendor.payload.totalShipments,
          serviceRating: vendor.payload.serviceRating,
        }
      }
    } catch (err) {
      console.error('[vendors/page] Error extracting metrics:', err)
      return null
    }
    return null
  }

  // Render function wrapped in try/catch for error boundary
  const renderContent = () => {
    try {
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
            onChange={(e) => {
              setVendorTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="supplier">Suppliers</option>
            <option value="warehouse">Warehouses</option>
            <option value="logistics">Logistics</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as VendorStatus | "all")
              setCurrentPage(1)
            }}
            className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="saved">Saved</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="dashboard-card p-12 text-center">
          <p className="text-gray-600 dark:text-white">Loading vendors...</p>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="dashboard-card p-12 text-center border-red-500">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Vendors Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              const Icon = getVendorTypeIcon(vendor.source)
              const currency = vendor.country ? getCurrency(vendor.country) : 'USD'
              const metrics = getVendorMetrics(vendor)
              
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
                            {getVendorTypeLabel(vendor.source)}
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
                      {vendor.country && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.country}</span>
                          <Badge variant="outline" className="ml-2 text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                            {currency}
                          </Badge>
                        </div>
                      )}

                      {vendor.source === 'supplier' && metrics && 'onTimePercent' in metrics && (
                        <div className="space-y-2 text-sm">
                          {metrics.onTimePercent !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">On-Time %</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.onTimePercent}%</span>
                            </div>
                          )}
                          {metrics.moq !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">MOQ</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.moq.toLocaleString()} units</span>
                            </div>
                          )}
                          {metrics.rating !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Rating</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.rating}/5.0</span>
                            </div>
                          )}
                        </div>
                      )}

                      {vendor.source === 'warehouse' && metrics && 'capacity' in metrics && (
                        <div className="space-y-2 text-sm">
                          {metrics.capacity !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Capacity</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.capacity.toLocaleString()} units/mo</span>
                            </div>
                          )}
                          {metrics.utilization !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Utilization</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.utilization}%</span>
                            </div>
                          )}
                          {metrics.slaPickRate !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Pick Rate</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.slaPickRate}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {vendor.source === 'logistics' && metrics && 'onTimePercent' in metrics && (
                        <div className="space-y-2 text-sm">
                          {metrics.onTimePercent !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">On-Time %</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.onTimePercent}%</span>
                            </div>
                          )}
                          {metrics.totalShipments !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Shipments</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.totalShipments.toLocaleString()}</span>
                            </div>
                          )}
                          {metrics.serviceRating !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-white">Rating</span>
                              <span className="text-gray-900 dark:text-white font-medium">{metrics.serviceRating}/5.0</span>
                            </div>
                          )}
                        </div>
                      )}

                      {vendor.email && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-white truncate">{vendor.email}</span>
                        </div>
                      )}
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

          {/* Pagination */}
          {totalResults > pageSize && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600 dark:text-white">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} vendors
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * pageSize >= totalResults}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
      )
    } catch (e) {
      console.error('[vendors/page] render fail', e)
      // Re-throw so error boundary handles it
      throw e
    }
  }

  return renderContent()
}

