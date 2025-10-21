"use client"

import { useState, useMemo, useEffect } from "react"
import { SearchToolbar } from "@/components/dashboard/search/SearchToolbar"
import { FacetFilters } from "@/components/dashboard/search/FacetFilters"
import { DataTable } from "@/components/dashboard/search/DataTable"
import { CardGrid, EntityCard } from "@/components/dashboard/search/CardGrid"
import { DetailDrawer } from "@/components/dashboard/search/DetailDrawer"
import { sampleCarriers } from "@/lib/mock/search"
import { trackSearchView, trackSearchQuery, trackFilterApply, trackSortChange, trackViewToggle, trackEntityOpen, trackCompareClick, trackExportClick } from "@/lib/analytics"
import { Carrier, SearchFilters, ViewMode, FilterOption } from "@/types/search"

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntity, setSelectedEntity] = useState<Carrier | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    trackSearchView('carrier')
  }, [])

  const availableOptions = useMemo(() => {
    const countries = Array.from(new Set(sampleCarriers.map(c => c.country)))
      .map(country => ({ value: country, label: country, count: sampleCarriers.filter(c => c.country === country).length }))
    
    const modes = Array.from(new Set(sampleCarriers.flatMap(c => c.modes)))
      .map(mode => ({ value: mode, label: mode, count: sampleCarriers.filter(c => c.modes.includes(mode)).length }))
    
    const specialties = Array.from(new Set(sampleCarriers.flatMap(c => c.specialties)))
      .map(specialty => ({ value: specialty, label: specialty, count: sampleCarriers.filter(c => c.specialties.includes(specialty)).length }))
    
    const certifications = Array.from(new Set(sampleCarriers.flatMap(c => c.certifications)))
      .map(cert => ({ value: cert, label: cert, count: sampleCarriers.filter(c => c.certifications.includes(cert)).length }))

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
    let filtered = sampleCarriers

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(carrier =>
        carrier.name.toLowerCase().includes(query) ||
        carrier.country.toLowerCase().includes(query) ||
        carrier.lanes.some(lane => lane.toLowerCase().includes(query)) ||
        carrier.modes.some(mode => mode.toLowerCase().includes(query))
      )
    }

    if (filters.country && filters.country.length > 0) {
      filtered = filtered.filter(c => filters.country!.includes(c.country))
    }
    if (filters.mode && filters.mode.length > 0) {
      filtered = filtered.filter(c => 
        filters.mode!.some(mode => c.modes.includes(mode))
      )
    }
    if (filters.specialty && filters.specialty.length > 0) {
      filtered = filtered.filter(c => 
        filters.specialty!.some(specialty => c.specialties.includes(specialty))
      )
    }
    if (filters.certification && filters.certification.length > 0) {
      filtered = filtered.filter(c => 
        filters.certification!.some(cert => c.certifications.includes(cert))
      )
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Carrier]
      let bValue = b[sortBy as keyof Carrier]
      
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
      key: 'name' as keyof Carrier,
      label: 'Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'country' as keyof Carrier,
      label: 'Country',
      sortable: true,
      width: '120px',
    },
    {
      key: 'onTimePercent' as keyof Carrier,
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
      key: 'claimsRate' as keyof Carrier,
      label: 'Claims Rate',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) <= 0.01 ? 'text-green-600' : (value as number) <= 0.02 ? 'text-yellow-600' : 'text-red-600'}`}>
          {((value as number) * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'costPerMile' as keyof Carrier,
      label: 'Cost/Mile',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className="font-medium">${value as number}</span>
      ),
    },
    {
      key: 'serviceLevel' as keyof Carrier,
      label: 'Service Level',
      sortable: true,
      width: '120px',
    },
    {
      key: 'fleetSize' as keyof Carrier,
      label: 'Fleet Size',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className="font-medium">{value as number}</span>
      ),
    },
  ]

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      trackSearchQuery('carrier', query, filteredData.length)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    trackFilterApply('carrier', newFilters)
  }

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key)
    setSortDirection(direction)
    trackSortChange('carrier', key)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    trackViewToggle('carrier', mode)
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
      const allIds = new Set(filteredData.map(c => c.id))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowClick = (carrier: Carrier) => {
    setSelectedEntity(carrier)
    setIsDrawerOpen(true)
    trackEntityOpen('carrier', carrier.id)
  }

  const handleCompare = () => {
    trackCompareClick('carrier', selectedRows.size)
  }

  const handleExport = () => {
    trackExportClick('carrier')
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const renderCarrierCard = (carrier: Carrier, isSelected: boolean) => (
    <EntityCard
      title={carrier.name}
      subtitle={`${carrier.country}, ${carrier.region}`}
      metrics={[
        { label: 'On-Time %', value: carrier.onTimePercent, format: 'percentage', color: carrier.onTimePercent >= 95 ? 'green' : carrier.onTimePercent >= 90 ? 'yellow' : 'red' },
        { label: 'Claims Rate', value: (carrier.claimsRate * 100).toFixed(1), format: 'percentage', color: carrier.claimsRate <= 0.01 ? 'green' : carrier.claimsRate <= 0.02 ? 'yellow' : 'red' },
        { label: 'Cost/Mile', value: carrier.costPerMile, format: 'currency' },
        { label: 'Fleet Size', value: carrier.fleetSize, format: 'number' },
      ]}
      badges={carrier.modes.slice(0, 3).map(mode => ({ text: mode, variant: 'secondary' as const }))}
      description={`${carrier.serviceLevel} • Est. ${carrier.establishedYear}`}
      onViewDetails={() => handleRowClick(carrier)}
    />
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Carriers</h1>
        <p className="text-gray-600 mt-1">Find transportation partners with reliable delivery and competitive rates</p>
      </div>

      {/* 2-Column Layout */}
      <div className="flex gap-6 min-h-[calc(100vh-12rem)]">
        {/* Left Column: Search & Filters */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
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
            entityType="carrier"
          />
          
          <FacetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            entityType="carrier"
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
              getRowId={(carrier) => carrier.id}
            />
          ) : (
            <CardGrid
              data={filteredData}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={handleRowClick}
              renderCard={renderCarrierCard}
              getRowId={(carrier) => carrier.id}
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={selectedEntity}
        entityType="carrier"
      />
    </div>
  )
}
