"use client"

import { useState, useMemo, useEffect } from "react"
import { SearchToolbar } from "@/components/dashboard/search/SearchToolbar"
import { FacetFilters } from "@/components/dashboard/search/FacetFilters"
import { DataTable } from "@/components/dashboard/search/DataTable"
import { CardGrid, EntityCard } from "@/components/dashboard/search/CardGrid"
import { DetailDrawer } from "@/components/dashboard/search/DetailDrawer"
import { sampleSuppliers } from "@/lib/mock/search"
import { trackSearchView, trackSearchQuery, trackFilterApply, trackSortChange, trackViewToggle, trackEntityOpen, trackCompareClick, trackExportClick } from "@/lib/analytics"
import { Supplier, SearchFilters, ViewMode, FilterOption } from "@/types/search"

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntity, setSelectedEntity] = useState<Supplier | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Track page view on mount
  useEffect(() => {
    trackSearchView('supplier')
  }, [])

  // Generate filter options from data
  const availableOptions = useMemo(() => {
    const countries = Array.from(new Set(sampleSuppliers.map(s => s.country)))
      .map(country => ({ value: country, label: country, count: sampleSuppliers.filter(s => s.country === country).length }))
    
    const certifications = Array.from(new Set(sampleSuppliers.flatMap(s => s.certifications)))
      .map(cert => ({ value: cert, label: cert, count: sampleSuppliers.filter(s => s.certifications.includes(cert)).length }))
    
    const specialties = Array.from(new Set(sampleSuppliers.flatMap(s => s.specialties)))
      .map(specialty => ({ value: specialty, label: specialty, count: sampleSuppliers.filter(s => s.specialties.includes(specialty)).length }))

    return {
      countries,
      regions: [],
      certifications,
      specialties,
      modes: [],
      services: [],
    }
  }, [])

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = sampleSuppliers

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.country.toLowerCase().includes(query) ||
        supplier.specialties.some(s => s.toLowerCase().includes(query)) ||
        supplier.certifications.some(c => c.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.country && filters.country.length > 0) {
      filtered = filtered.filter(s => filters.country!.includes(s.country))
    }
    if (filters.certification && filters.certification.length > 0) {
      filtered = filtered.filter(s => 
        filters.certification!.some(cert => s.certifications.includes(cert))
      )
    }
    if (filters.specialty && filters.specialty.length > 0) {
      filtered = filtered.filter(s => 
        filters.specialty!.some(specialty => s.specialties.includes(specialty))
      )
    }
    if (filters.moqRange) {
      const [min, max] = filters.moqRange
      filtered = filtered.filter(s => s.moq >= min && s.moq <= max)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Supplier]
      let bValue = b[sortBy as keyof Supplier]
      
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

  // Table columns
  const columns = [
    {
      key: 'name' as keyof Supplier,
      label: 'Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'country' as keyof Supplier,
      label: 'Country',
      sortable: true,
      width: '120px',
    },
    {
      key: 'onTimePercent' as keyof Supplier,
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
      key: 'defectRate' as keyof Supplier,
      label: 'Defect Rate',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) <= 0.02 ? 'text-green-600' : (value as number) <= 0.05 ? 'text-yellow-600' : 'text-red-600'}`}>
          {((value as number) * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'avgLeadTimeDays' as keyof Supplier,
      label: 'Lead Time',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className="font-medium">{value as number} days</span>
      ),
    },
    {
      key: 'riskIndex' as keyof Supplier,
      label: 'Risk',
      sortable: true,
      width: '80px',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) <= 2 ? 'text-green-600' : (value as number) <= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value as number}/5
        </span>
      ),
    },
    {
      key: 'certifications' as keyof Supplier,
      label: 'Certifications',
      sortable: false,
      width: '200px',
    },
    {
      key: 'moq' as keyof Supplier,
      label: 'MOQ',
      sortable: true,
      width: '100px',
      render: (value: unknown) => (
        <span className="font-medium">{(value as number).toLocaleString()}</span>
      ),
    },
  ]

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      trackSearchQuery('supplier', query, filteredData.length)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    trackFilterApply('supplier', newFilters)
  }

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key)
    setSortDirection(direction)
    trackSortChange('supplier', key)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    trackViewToggle('supplier', mode)
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
      const allIds = new Set(filteredData.map(s => s.id))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowClick = (supplier: Supplier) => {
    setSelectedEntity(supplier)
    setIsDrawerOpen(true)
    trackEntityOpen('supplier', supplier.id)
  }

  const handleCompare = () => {
    trackCompareClick('supplier', selectedRows.size)
    // TODO: Implement compare functionality
  }

  const handleExport = () => {
    trackExportClick('supplier')
    // TODO: Implement export functionality
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  // Render supplier card for grid view
  const renderSupplierCard = (supplier: Supplier, isSelected: boolean) => (
    <EntityCard
      title={supplier.name}
      subtitle={`${supplier.country}, ${supplier.region}`}
      metrics={[
        { label: 'On-Time %', value: supplier.onTimePercent, format: 'percentage', color: supplier.onTimePercent >= 95 ? 'green' : supplier.onTimePercent >= 90 ? 'yellow' : 'red' },
        { label: 'Defect Rate', value: (supplier.defectRate * 100).toFixed(1), format: 'percentage', color: supplier.defectRate <= 0.02 ? 'green' : supplier.defectRate <= 0.05 ? 'yellow' : 'red' },
        { label: 'Lead Time', value: supplier.avgLeadTimeDays, format: 'number' },
        { label: 'Risk Index', value: `${supplier.riskIndex}/5`, format: 'text', color: supplier.riskIndex <= 2 ? 'green' : supplier.riskIndex <= 3 ? 'yellow' : 'red' },
      ]}
      badges={supplier.certifications.slice(0, 3).map(cert => ({ text: cert, variant: 'secondary' as const }))}
      description={`MOQ: ${supplier.moq.toLocaleString()} units • ${supplier.specialties.slice(0, 2).join(', ')}`}
      onViewDetails={() => handleRowClick(supplier)}
    />
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <p className="text-gray-600 mt-1">Find and compare suppliers for your apparel supply chain</p>
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
            entityType="supplier"
          />
          
          <FacetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            entityType="supplier"
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
              getRowId={(supplier) => supplier.id}
            />
          ) : (
            <CardGrid
              data={filteredData}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={handleRowClick}
              renderCard={renderSupplierCard}
              getRowId={(supplier) => supplier.id}
            />
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={selectedEntity}
        entityType="supplier"
      />
    </div>
  )
}
