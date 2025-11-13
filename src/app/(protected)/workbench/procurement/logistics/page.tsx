"use client"

import { useState, useMemo, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { SearchToolbar } from "@/components/dashboard/search/SearchToolbar"
import { FacetFilters } from "@/components/dashboard/search/FacetFilters"
import { DataTable } from "@/components/dashboard/search/DataTable"
import { CardGrid, EntityCard } from "@/components/dashboard/search/CardGrid"
import { DetailDrawer } from "@/components/dashboard/search/DetailDrawer"
import { PaginationBar } from "@/components/dashboard/search/PaginationBar"
import { sampleCarriers } from "@/lib/mock/search"
import { searchForwarders } from "./actions"
import { adaptSupabaseToForwarder } from "@/lib/adapters/logistics"
import { saveVendor } from "@/app/(protected)/dashboard/manage/vendors/actions"
import { trackSearchView, trackSearchQuery, trackFilterApply, trackSortChange, trackViewToggle, trackEntityOpen, trackCompareClick, trackExportClick } from "@/lib/analytics"
import { FreightForwarder, Carrier, SearchFilters, ViewMode } from "@/types/search"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const GlobeLoader = dynamic(() => import("@/components/globe/GlobeLoader"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-40 h-40 rounded-full border border-slate-200 dark:border-slate-700 animate-pulse" />
    </div>
  ),
})

type UnifiedLogistics = (FreightForwarder & { __type: 'forwarder' }) | (Carrier & { __type: 'carrier' })

export default function LogisticsPage() {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntity, setSelectedEntity] = useState<UnifiedLogistics | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allEntities, setAllEntities] = useState<UnifiedLogistics[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const pageSize = 25
  
  // State for saving vendors
  const [savingVendorId, setSavingVendorId] = useState<string | null>(null)
  const [savedVendorIds, setSavedVendorIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    trackSearchView('forwarder')
  }, [])

  // Fetch forwarders from Supabase when search is executed
  useEffect(() => {
    const fetchData = async () => {
      if (!hasSearched) return

      setIsLoading(true)
      setError(null)
      try {
        // Map partnerType filter to ff_type
        let ff_type: string | undefined = undefined
        if (filters.partnerType && filters.partnerType.length > 0) {
          const type = filters.partnerType[0]
          if (type === 'Freight Forwarder' || type === 'Shipper' || type === '3PL Provider') {
            ff_type = type === 'Freight Forwarder' ? 'Freight Forwarder' : type
          }
        }

        const offset = (currentPage - 1) * pageSize
        const result = await searchForwarders({
          q: searchQuery || undefined,
          country: filters.country?.[0] || undefined,
          ff_type: ff_type,
          limit: pageSize,
          offset: offset
        })

        const adapted = result.data.map(adaptSupabaseToForwarder)
        const forwarders = adapted.map(f => ({ ...f, __type: 'forwarder' as const }))
        
        // Keep carriers from mock data for now (per requirement: zero regressions)
        const carriers = sampleCarriers.map(c => ({ ...c, __type: 'carrier' as const }))
        
        setAllEntities([...forwarders, ...carriers])
        setTotalResults(result.total)
        
        // Track analytics after successful fetch
        trackSearchQuery('forwarder', searchQuery, forwarders.length)
      } catch (err) {
        setError('Failed to load logistics data')
        console.error('Logistics fetch error:', err)
        // On error, still show carriers so page isn't completely empty
        const carriers = sampleCarriers.map(c => ({ ...c, __type: 'carrier' as const }))
        setAllEntities(carriers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.country, filters.partnerType, hasSearched, currentPage])

  // Generate filter options from combined data
  const availableOptions = useMemo(() => {
    const countries = Array.from(new Set(allEntities.map(e => e.country)))
      .map(country => ({ 
        value: country, 
        label: country, 
        count: allEntities.filter(e => e.country === country).length 
      }))
    
    const certifications = Array.from(new Set(allEntities.flatMap(e => e.certifications)))
      .map(cert => ({ 
        value: cert, 
        label: cert, 
        count: allEntities.filter(e => e.certifications.includes(cert)).length 
      }))
    
    const specialties = Array.from(new Set(allEntities.flatMap(e => e.specialties)))
      .map(specialty => ({ 
        value: specialty, 
        label: specialty, 
        count: allEntities.filter(e => e.specialties.includes(specialty)).length 
      }))

    const modes = Array.from(new Set(allEntities.flatMap(e => e.modes)))
      .map(mode => ({ 
        value: mode, 
        label: mode, 
        count: allEntities.filter(e => e.modes.includes(mode)).length 
      }))

    return {
      countries,
      regions: [],
      certifications,
      specialties,
      modes,
      services: [],
    }
  }, [allEntities])

  // Filter and sort data
  // Note: Forwarders are filtered server-side when hasSearched is true
  // Carriers always use client-side filtering
  const filteredData = useMemo(() => {
    let filtered = allEntities

    // Client-side search: Only apply to carriers when hasSearched is true
    // Forwarders are already filtered server-side when hasSearched is true
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!hasSearched) {
        // Before search, apply client-side filtering to all entities
        filtered = filtered.filter(entity =>
          entity.name.toLowerCase().includes(query) ||
          entity.country.toLowerCase().includes(query) ||
          (entity.__type === 'forwarder' && entity.lanes.some(lane => lane.toLowerCase().includes(query))) ||
          (entity.__type === 'carrier' && entity.lanes.some(lane => lane.toLowerCase().includes(query))) ||
          entity.modes.some(mode => mode.toLowerCase().includes(query)) ||
          entity.specialties.some(s => s.toLowerCase().includes(query))
        )
      } else {
        // After search, only filter carriers (forwarders already filtered server-side)
        filtered = filtered.filter(entity => {
          if (entity.__type === 'carrier') {
            return (
              entity.name.toLowerCase().includes(query) ||
              entity.country.toLowerCase().includes(query) ||
              entity.lanes.some(lane => lane.toLowerCase().includes(query)) ||
              entity.modes.some(mode => mode.toLowerCase().includes(query)) ||
              entity.specialties.some(s => s.toLowerCase().includes(query))
            )
          }
          // Forwarders pass through (already filtered server-side)
          return true
        })
      }
    }

    // Apply type filter
    if (filters.partnerType && filters.partnerType.length > 0) {
      filtered = filtered.filter(e => {
        if (filters.partnerType!.includes('Carrier') && e.__type === 'carrier') return true
        // Forwarders: check if type filter matches
        if (e.__type === 'forwarder') {
          return (
            filters.partnerType!.includes('Freight Forwarder') ||
            filters.partnerType!.includes('Shipper') ||
            filters.partnerType!.includes('3PL Provider')
          )
        }
        return false
      })
    }

    // Apply country filter: Only apply client-side when hasSearched is false
    // When hasSearched is true, forwarders are already filtered server-side
    if (filters.country && filters.country.length > 0) {
      if (!hasSearched) {
        // Client-side filtering for all entities
        filtered = filtered.filter(e => filters.country!.includes(e.country))
      } else {
        // Only filter carriers (forwarders already filtered server-side)
        filtered = filtered.filter(e => {
          if (e.__type === 'carrier') {
            return filters.country!.includes(e.country)
          }
          // Forwarders pass through (already filtered server-side)
          return true
        })
      }
    }
    if (filters.certification && filters.certification.length > 0) {
      filtered = filtered.filter(e => 
        filters.certification!.some(cert => e.certifications.includes(cert))
      )
    }
    if (filters.specialty && filters.specialty.length > 0) {
      filtered = filtered.filter(e => 
        filters.specialty!.some(specialty => e.specialties.includes(specialty))
      )
    }
    if (filters.mode && filters.mode.length > 0) {
      filtered = filtered.filter(e => 
        filters.mode!.some(mode => e.modes.includes(mode))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      // Handle special __type sorting
      if (sortBy === '__type') {
        const aType = a.__type
        const bType = b.__type
        if (sortDirection === 'asc') {
          return aType < bType ? -1 : aType > bType ? 1 : 0
        } else {
          return aType > bType ? -1 : aType < bType ? 1 : 0
        }
      }
      
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]
      
      // Handle undefined values - entities without this field go to end
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchQuery, filters, sortBy, sortDirection, allEntities])

  // Table columns - unified for both types
  const columns = useMemo(() => [
    {
      key: '__type' as keyof UnifiedLogistics,
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (value: unknown, row: UnifiedLogistics) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.__type === 'forwarder' ? 'Freight Forwarder' : 'Carrier'}
        </span>
      ),
    },
    {
      key: 'name' as keyof UnifiedLogistics,
      label: 'Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'country' as keyof UnifiedLogistics,
      label: 'Country',
      sortable: true,
      width: '120px',
    },
    {
      key: 'serviceRating' as keyof UnifiedLogistics,
      label: 'Rating',
      sortable: true,
      width: '100px',
      render: (value: unknown, row: UnifiedLogistics) => {
        if (row.__type === 'forwarder' && 'serviceRating' in row) {
          const val = row.serviceRating
          return (
            <span className={`font-medium ${val >= 4.5 ? 'text-green-600' : val >= 4.0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {val}/5
            </span>
          )
        }
        return <span className="text-gray-400 dark:text-gray-600">-</span>
      },
    },
    {
      key: 'costPerMile' as keyof UnifiedLogistics,
      label: 'Cost/Mile',
      sortable: true,
      width: '100px',
      render: (value: unknown, row: UnifiedLogistics) => {
        if (row.__type === 'carrier' && 'costPerMile' in row) {
          return (
            <span className="font-medium text-gray-900 dark:text-white">
              ${row.costPerMile}
            </span>
          )
        }
        return <span className="text-gray-400 dark:text-gray-600">-</span>
      },
    },
    {
      key: 'onTimePercent' as keyof UnifiedLogistics,
      label: 'On-Time %',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 95 ? 'text-green-600' : (value as number) >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'modes' as keyof UnifiedLogistics,
      label: 'Modes',
      sortable: false,
      width: '150px',
    },
  ], [])

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      trackSearchQuery('forwarder', query, filteredData.length)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    trackFilterApply('forwarder', newFilters)
  }

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key)
    setSortDirection(direction)
    trackSortChange('forwarder', key)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    trackViewToggle('forwarder', mode)
  }

  const handleRowSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedRows)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(filteredData.map(e => e.id))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowClick = (entity: UnifiedLogistics) => {
    setSelectedEntity(entity)
    setIsDrawerOpen(true)
    trackEntityOpen('forwarder', entity.id)
  }

  const handleCompare = () => {
    trackCompareClick('forwarder', selectedRows.size)
  }

  const handleExport = () => {
    trackExportClick('forwarder')
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleSearch = () => {
    setHasSearched(true)
    setCurrentPage(1)
    setError(null)
    // Track will happen after data is fetched
  }

  const handleResetFilters = () => {
    setFilters({})
    setSearchQuery("")
    setHasSearched(false)
    setCurrentPage(1)
    setSelectedRows(new Set())
    setTotalResults(0)
  }

  const handleSaveSearch = () => {
    const savedSearches = JSON.parse(localStorage.getItem('sla-saved-searches') || '[]')
    const newSearch = {
      id: Date.now().toString(),
      name: `Search ${new Date().toLocaleDateString()}`,
      filters: filters,
      searchQuery: searchQuery,
      entityType: 'logistics',
      createdAt: new Date().toISOString(),
    }
    savedSearches.push(newSearch)
    localStorage.setItem('sla-saved-searches', JSON.stringify(savedSearches))
    alert('Search saved successfully!')
  }

  const handleSaveVendor = async () => {
    if (!user?.id || !selectedEntity) {
      alert('Please sign in to save vendors')
      return
    }

    const entity = selectedEntity
    // Only save forwarders (not carriers for now)
    if (entity.__type !== 'forwarder') {
      return
    }

    setSavingVendorId(entity.id)
    try {
      const result = await saveVendor({
        source: 'logistics',
        sourceId: entity.id,
        ownerUserId: user.id,
        row: entity,
      })

      if (result.upserted) {
        setSavedVendorIds(prev => new Set(prev).add(entity.id))
        alert(result.wasInsert ? 'Added to Vendors' : 'Already saved')
      }
    } catch (err) {
      console.error('Failed to save vendor:', err)
      alert('Failed to save vendor')
    } finally {
      setSavingVendorId(null)
    }
  }

  // Render entity card for grid view
  const renderEntityCard = (entity: UnifiedLogistics, isSelected: boolean) => {
    if (entity.__type === 'forwarder') {
      return (
        <EntityCard
          key={entity.id}
          title={entity.name}
          subtitle={`${entity.country}, ${entity.region}`}
          metrics={[
            { label: 'Rating', value: entity.serviceRating, format: 'number', color: entity.serviceRating >= 4.5 ? 'green' : entity.serviceRating >= 4.0 ? 'yellow' : 'red' },
            { label: 'On-Time %', value: entity.onTimePercent, format: 'percentage', color: entity.onTimePercent >= 95 ? 'green' : entity.onTimePercent >= 90 ? 'yellow' : 'red' },
            { label: 'Quote Speed', value: entity.quoteResponsiveness, format: 'percentage', color: entity.quoteResponsiveness >= 90 ? 'green' : entity.quoteResponsiveness >= 80 ? 'yellow' : 'red' },
            { label: 'Transit Variance', value: entity.avgTransitVariance, format: 'number', color: entity.avgTransitVariance <= 2 ? 'green' : entity.avgTransitVariance <= 4 ? 'yellow' : 'red' },
          ]}
          badges={entity.modes.slice(0, 3).map(mode => ({ text: mode, variant: 'secondary' as const }))}
          description={`${entity.lanes.length} lanes • Est. ${entity.establishedYear}`}
          onViewDetails={() => handleRowClick(entity)}
        />
      )
    } else {
      return (
        <EntityCard
          key={entity.id}
          title={entity.name}
          subtitle={`${entity.country}, ${entity.region}`}
          metrics={[
            { label: 'On-Time %', value: entity.onTimePercent, format: 'percentage', color: entity.onTimePercent >= 95 ? 'green' : entity.onTimePercent >= 90 ? 'yellow' : 'red' },
            { label: 'Claims Rate', value: (entity.claimsRate * 100).toFixed(1), format: 'percentage', color: entity.claimsRate <= 0.01 ? 'green' : entity.claimsRate <= 0.02 ? 'yellow' : 'red' },
            { label: 'Cost/Mile', value: `$${entity.costPerMile}`, format: 'text' },
            { label: 'Fleet Size', value: entity.fleetSize, format: 'number' },
          ]}
          badges={entity.modes.slice(0, 3).map(mode => ({ text: mode, variant: 'secondary' as const }))}
          description={`${entity.serviceLevel} • Est. ${entity.establishedYear}`}
          onViewDetails={() => handleRowClick(entity)}
        />
      )
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        <div className="pt-2 md:pt-3">
          {/* 2-Column Layout */}
      <div className="flex gap-4 min-h-[calc(100vh-12rem)]">
        {/* Left Column: Search & Filters */}
        <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto">
          <SearchToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            selectedCount={selectedRows.size}
            onExport={handleExport}
            onCompare={handleCompare}
            onClearSelection={handleClearSelection}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            resultCount={filteredData.length}
            entityType="logistics"
            onSearch={handleSearch}
            onSaveSearch={handleSaveSearch}
            onResetFilters={handleResetFilters}
            hasSearchExecuted={hasSearched}
          />
          
          <FacetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            entityType="logistics"
            availableOptions={availableOptions}
          />
        </div>

        {/* Right Column: Results */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <Card className="dashboard-card p-4 mb-4 border-red-500">
              <div className="flex items-center justify-between">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button onClick={handleSearch} variant="outline" className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                  Retry
                </Button>
              </div>
            </Card>
          )}
          {!hasSearched ? (
            <div className="flex items-center justify-center min-h-[500px] w-full">
              <GlobeLoader 
                size={480}
                subtitle="Ready to search worldwide..."
              />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center min-h-[500px] w-full">
              <GlobeLoader 
                size={480}
                subtitle="Searching forwarders…"
              />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center min-h-[500px] w-full">
              <GlobeLoader 
                size={480}
                subtitle="No matches—try another query or widen filters."
              />
            </div>
          ) : (
            <>
              {/* Top Pagination Bar */}
              {hasSearched && !isLoading && filteredData.length > 0 && (
                <PaginationBar
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalResults={totalResults}
                  onNext={() => setCurrentPage(p => p + 1)}
                  showNext={(currentPage * pageSize) < totalResults}
                  onResetFilters={handleResetFilters}
                  onSaveSearch={handleSaveSearch}
                  hasSearchExecuted={hasSearched}
                  position="top"
                />
              )}

              {/* Results Table/Grid */}
              {viewMode === 'table' ? (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                  onRowClick={handleRowClick}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  currentPage={1}
                  onPageChange={undefined}
                  pageSize={filteredData.length}
                  getRowId={(entity) => entity.id}
                  disablePagination={hasSearched}
                />
              ) : (
                <CardGrid
                  data={filteredData}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  onRowClick={handleRowClick}
                  renderCard={renderEntityCard}
                  getRowId={(entity) => entity.id}
                />
              )}

              {/* Bottom Pagination Bar */}
              {hasSearched && !isLoading && filteredData.length > 0 && (
                <PaginationBar
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalResults={totalResults}
                  onNext={() => setCurrentPage(p => p + 1)}
                  showNext={(currentPage * pageSize) < totalResults}
                  onResetFilters={handleResetFilters}
                  onSaveSearch={handleSaveSearch}
                  hasSearchExecuted={hasSearched}
                  position="bottom"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={selectedEntity}
        entityType={selectedEntity?.__type === 'forwarder' ? 'forwarder' : 'carrier'}
        onSave={selectedEntity?.__type === 'forwarder' ? handleSaveVendor : undefined}
        isSaving={selectedEntity?.__type === 'forwarder' && savingVendorId === selectedEntity.id}
        isSaved={selectedEntity?.__type === 'forwarder' && savedVendorIds.has(selectedEntity.id)}
      />
        </div>
      </div>
    </div>
  )
}

