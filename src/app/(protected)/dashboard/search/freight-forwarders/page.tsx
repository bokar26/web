"use client"

import { useState, useMemo, useEffect } from "react"
import { SearchToolbar } from "@/components/dashboard/search/SearchToolbar"
import { FacetFilters } from "@/components/dashboard/search/FacetFilters"
import { DataTable } from "@/components/dashboard/search/DataTable"
import { CardGrid, EntityCard } from "@/components/dashboard/search/CardGrid"
import { DetailDrawer } from "@/components/dashboard/search/DetailDrawer"
import { sampleForwarders } from "@/lib/mock/search"
import { trackSearchView, trackSearchQuery, trackFilterApply, trackSortChange, trackViewToggle, trackEntityOpen, trackCompareClick, trackExportClick } from "@/lib/analytics"
import { FreightForwarder, SearchFilters, ViewMode, FilterOption } from "@/types/search"

export default function FreightForwardersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntity, setSelectedEntity] = useState<FreightForwarder | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    trackSearchView('forwarder')
  }, [])

  const availableOptions = useMemo(() => {
    const countries = Array.from(new Set(sampleForwarders.map(f => f.country)))
      .map(country => ({ value: country, label: country, count: sampleForwarders.filter(f => f.country === country).length }))
    
    const modes = Array.from(new Set(sampleForwarders.flatMap(f => f.modes)))
      .map(mode => ({ value: mode, label: mode, count: sampleForwarders.filter(f => f.modes.includes(mode)).length }))
    
    const specialties = Array.from(new Set(sampleForwarders.flatMap(f => f.specialties)))
      .map(specialty => ({ value: specialty, label: specialty, count: sampleForwarders.filter(f => f.specialties.includes(specialty)).length }))
    
    const certifications = Array.from(new Set(sampleForwarders.flatMap(f => f.certifications)))
      .map(cert => ({ value: cert, label: cert, count: sampleForwarders.filter(f => f.certifications.includes(cert)).length }))

    return {
      countries,
      regions: [],
      certifications,
      specialties,
      modes,
      services: [],
    }
  }, [])

  const filteredData = useMemo(() => {
    let filtered = sampleForwarders

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(forwarder =>
        forwarder.name.toLowerCase().includes(query) ||
        forwarder.country.toLowerCase().includes(query) ||
        forwarder.lanes.some(lane => lane.toLowerCase().includes(query)) ||
        forwarder.modes.some(mode => mode.toLowerCase().includes(query))
      )
    }

    if (filters.country && filters.country.length > 0) {
      filtered = filtered.filter(f => filters.country!.includes(f.country))
    }
    if (filters.mode && filters.mode.length > 0) {
      filtered = filtered.filter(f => 
        filters.mode!.some(mode => f.modes.includes(mode))
      )
    }
    if (filters.specialty && filters.specialty.length > 0) {
      filtered = filtered.filter(f => 
        filters.specialty!.some(specialty => f.specialties.includes(specialty))
      )
    }
    if (filters.certification && filters.certification.length > 0) {
      filtered = filtered.filter(f => 
        filters.certification!.some(cert => f.certifications.includes(cert))
      )
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof FreightForwarder]
      let bValue = b[sortBy as keyof FreightForwarder]
      
      // Handle undefined values
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
  }, [searchQuery, filters, sortBy, sortDirection])

  const columns = [
    {
      key: 'name' as keyof FreightForwarder,
      label: 'Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'country' as keyof FreightForwarder,
      label: 'Country',
      sortable: true,
      width: '120px',
    },
    {
      key: 'serviceRating' as keyof FreightForwarder,
      label: 'Rating',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 4.5 ? 'text-green-600' : (value as number) >= 4.0 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}/5
        </span>
      ),
    },
    {
      key: 'quoteResponsiveness' as keyof FreightForwarder,
      label: 'Quote Speed',
      sortable: true,
      width: '120px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 90 ? 'text-green-600' : (value as number) >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'avgTransitVariance' as keyof FreightForwarder,
      label: 'Transit Variance',
      sortable: true,
      width: '120px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) <= 2 ? 'text-green-600' : (value as number) <= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number} <span className="text-gray-900 dark:text-white">days</span>
        </span>
      ),
    },
    {
      key: 'lanes' as keyof FreightForwarder,
      label: 'Lanes',
      sortable: false,
      width: '200px',
    },
    {
      key: 'modes' as keyof FreightForwarder,
      label: 'Modes',
      sortable: false,
      width: '150px',
    },
  ]

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      trackSearchQuery('forwarder', query, filteredData.length)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    trackSearchQuery('forwarder', searchQuery, filteredData.length)
  }

  const handleResetFilters = () => {
    setFilters({})
    setSearchQuery("")
    setCurrentPage(1)
    setSelectedRows(new Set())
  }

  const handleSaveSearch = () => {
    const savedSearches = JSON.parse(localStorage.getItem('sla-saved-searches') || '[]')
    const newSearch = {
      id: Date.now().toString(),
      name: `Freight Forwarder Search ${new Date().toLocaleDateString()}`,
      filters: filters,
      query: searchQuery,
      entityType: 'forwarder',
    }
    savedSearches.push(newSearch)
    localStorage.setItem('sla-saved-searches', JSON.stringify(savedSearches))
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
      const allIds = new Set(filteredData.map(f => f.id))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowClick = (forwarder: FreightForwarder) => {
    setSelectedEntity(forwarder)
    setIsDrawerOpen(true)
    trackEntityOpen('forwarder', forwarder.id)
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

  const renderForwarderCard = (forwarder: FreightForwarder, isSelected: boolean) => (
    <EntityCard
      title={forwarder.name}
      subtitle={`${forwarder.country}, ${forwarder.region}`}
      metrics={[
        { label: 'Rating', value: forwarder.serviceRating, format: 'text', color: forwarder.serviceRating >= 4.5 ? 'green' : forwarder.serviceRating >= 4.0 ? 'yellow' : 'red' },
        { label: 'Quote Speed', value: forwarder.quoteResponsiveness, format: 'percentage', color: forwarder.quoteResponsiveness >= 90 ? 'green' : forwarder.quoteResponsiveness >= 80 ? 'yellow' : 'red' },
        { label: 'Transit Variance', value: forwarder.avgTransitVariance, format: 'text', color: forwarder.avgTransitVariance <= 2 ? 'green' : forwarder.avgTransitVariance <= 4 ? 'yellow' : 'red' },
        { label: 'Shipments', value: forwarder.totalShipments, format: 'number' },
      ]}
      badges={forwarder.modes.slice(0, 3).map(mode => ({ text: mode, variant: 'secondary' as const }))}
      description={`${forwarder.lanes.length} lanes • Est. ${forwarder.establishedYear}`}
      onViewDetails={() => handleRowClick(forwarder)}
    />
  )

  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Freight Forwarders</h1>
      </div>

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
            entityType="forwarder"
            onSearch={handleSearch}
            onSaveSearch={handleSaveSearch}
            onResetFilters={handleResetFilters}
            hasSearchExecuted={!!searchQuery || Object.keys(filters).length > 0}
          />
          
          <FacetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            entityType="forwarder"
            availableOptions={availableOptions}
          />
        </div>

        {/* Right Column: Results */}
        <div className="flex-1 overflow-y-auto">
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
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              getRowId={(forwarder) => forwarder.id}
            />
          ) : (
            <CardGrid
              data={filteredData}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={handleRowClick}
              renderCard={renderForwarderCard}
              getRowId={(forwarder) => forwarder.id}
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={selectedEntity}
        entityType="forwarder"
      />
    </div>
  )
}
