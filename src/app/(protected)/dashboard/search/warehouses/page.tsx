"use client"

import { useState, useMemo, useEffect } from "react"
import { SearchToolbar } from "@/components/dashboard/search/SearchToolbar"
import { FacetFilters } from "@/components/dashboard/search/FacetFilters"
import { DataTable } from "@/components/dashboard/search/DataTable"
import { CardGrid, EntityCard } from "@/components/dashboard/search/CardGrid"
import { DetailDrawer } from "@/components/dashboard/search/DetailDrawer"
import { sampleWarehouses } from "@/lib/mock/search"
import { trackSearchView, trackSearchQuery, trackFilterApply, trackSortChange, trackViewToggle, trackEntityOpen, trackCompareClick, trackExportClick } from "@/lib/analytics"
import { Warehouse, SearchFilters, ViewMode, FilterOption } from "@/types/search"

export default function WarehousesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntity, setSelectedEntity] = useState<Warehouse | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    trackSearchView('warehouse')
  }, [])

  const availableOptions = useMemo(() => {
    const countries = Array.from(new Set(sampleWarehouses.map(w => w.country)))
      .map(country => ({ value: country, label: country, count: sampleWarehouses.filter(w => w.country === country).length }))
    
    const services = Array.from(new Set(sampleWarehouses.flatMap(w => w.services)))
      .map(service => ({ value: service, label: service, count: sampleWarehouses.filter(w => w.services.includes(service)).length }))
    
    const certifications = Array.from(new Set(sampleWarehouses.flatMap(w => w.certifications)))
      .map(cert => ({ value: cert, label: cert, count: sampleWarehouses.filter(w => w.certifications.includes(cert)).length }))

    return {
      countries,
      regions: [],
      certifications,
      specialties: [],
      modes: [],
      services,
    }
  }, [])

  const filteredData = useMemo(() => {
    let filtered = sampleWarehouses

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(query) ||
        warehouse.country.toLowerCase().includes(query) ||
        warehouse.city.toLowerCase().includes(query) ||
        warehouse.services.some(s => s.toLowerCase().includes(query))
      )
    }

    if (filters.country && filters.country.length > 0) {
      filtered = filtered.filter(w => filters.country!.includes(w.country))
    }
    if (filters.service && filters.service.length > 0) {
      filtered = filtered.filter(w => 
        filters.service!.some(service => w.services.includes(service))
      )
    }
    if (filters.certification && filters.certification.length > 0) {
      filtered = filtered.filter(w => 
        filters.certification!.some(cert => w.certifications.includes(cert))
      )
    }
    if (filters.capacityRange) {
      const [min, max] = filters.capacityRange
      filtered = filtered.filter(w => w.capacity >= min && w.capacity <= max)
    }
    if (filters.utilizationRange) {
      const [min, max] = filters.utilizationRange
      filtered = filtered.filter(w => w.utilization >= min && w.utilization <= max)
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Warehouse]
      let bValue = b[sortBy as keyof Warehouse]
      
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
      key: 'name' as keyof Warehouse,
      label: 'Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'country' as keyof Warehouse,
      label: 'Location',
      sortable: true,
      width: '150px',
      render: (value: unknown, row: Warehouse) => (
        <span className="text-sm">{row.city}, {value as string}</span>
      ),
    },
    {
      key: 'capacity' as keyof Warehouse,
      label: 'Capacity',
      sortable: true,
      width: '120px',
      render: (value: unknown) => (
        <span className="font-medium">{(value as number).toLocaleString()} sq ft</span>
      ),
    },
    {
      key: 'utilization' as keyof Warehouse,
      label: 'Utilization',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 80 ? 'text-green-600' : (value as number) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'slaPickRate' as keyof Warehouse,
      label: 'Pick Rate',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 95 ? 'text-green-600' : (value as number) >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'slaPackRate' as keyof Warehouse,
      label: 'Pack Rate',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 95 ? 'text-green-600' : (value as number) >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'services' as keyof Warehouse,
      label: 'Services',
      sortable: false,
      width: '200px',
    },
  ]

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      trackSearchQuery('warehouse', query, filteredData.length)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    trackFilterApply('warehouse', newFilters)
  }

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key)
    setSortDirection(direction)
    trackSortChange('warehouse', key)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    trackViewToggle('warehouse', mode)
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
      const allIds = new Set(filteredData.map(w => w.id))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowClick = (warehouse: Warehouse) => {
    setSelectedEntity(warehouse)
    setIsDrawerOpen(true)
    trackEntityOpen('warehouse', warehouse.id)
  }

  const handleCompare = () => {
    trackCompareClick('warehouse', selectedRows.size)
  }

  const handleExport = () => {
    trackExportClick('warehouse')
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const renderWarehouseCard = (warehouse: Warehouse, isSelected: boolean) => (
    <EntityCard
      title={warehouse.name}
      subtitle={`${warehouse.city}, ${warehouse.country}`}
      metrics={[
        { label: 'Capacity', value: warehouse.capacity, format: 'number' },
        { label: 'Utilization', value: warehouse.utilization, format: 'percentage', color: warehouse.utilization >= 80 ? 'green' : warehouse.utilization >= 60 ? 'yellow' : 'red' },
        { label: 'Pick Rate', value: warehouse.slaPickRate, format: 'percentage', color: warehouse.slaPickRate >= 95 ? 'green' : warehouse.slaPickRate >= 90 ? 'yellow' : 'red' },
        { label: 'Pack Rate', value: warehouse.slaPackRate, format: 'percentage', color: warehouse.slaPackRate >= 95 ? 'green' : warehouse.slaPackRate >= 90 ? 'yellow' : 'red' },
      ]}
      badges={warehouse.services.slice(0, 3).map(service => ({ text: service, variant: 'secondary' as const }))}
      description={`${warehouse.inboundVolume.toLocaleString()} inbound • ${warehouse.outboundVolume.toLocaleString()} outbound units/month`}
      onViewDetails={() => handleRowClick(warehouse)}
    />
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
        <p className="text-gray-600 mt-1">Find storage and fulfillment partners with the right capacity and services</p>
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
            entityType="warehouse"
          />
          
          <FacetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            entityType="warehouse"
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
              getRowId={(warehouse) => warehouse.id}
            />
          ) : (
            <CardGrid
              data={filteredData}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={handleRowClick}
              renderCard={renderWarehouseCard}
              getRowId={(warehouse) => warehouse.id}
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={selectedEntity}
        entityType="warehouse"
      />
    </div>
  )
}
