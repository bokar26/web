"use client"

import { useState } from "react"
import { Search, Grid3X3, List, Download, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ViewMode, SearchFilters } from "@/types/search"

interface SearchToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedCount: number
  onExport: () => void
  onCompare: () => void
  onClearSelection: () => void
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  resultCount: number
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier'
}

export function SearchToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  onExport,
  onCompare,
  onClearSelection,
  filters,
  onFiltersChange,
  resultCount,
  entityType,
}: SearchToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
  )

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getEntityLabel = () => {
    switch (entityType) {
      case 'supplier': return 'Suppliers'
      case 'factory': return 'Factories'
      case 'warehouse': return 'Warehouses'
      case 'forwarder': return 'Freight Forwarders'
      case 'carrier': return 'Carriers'
      default: return 'Items'
    }
  }

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${getEntityLabel().toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter toggle */}
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {Object.values(filters).filter(v => 
                  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
                ).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedCount} selected
              </span>
              <Button variant="outline" size="sm" onClick={onCompare}>
                Compare
              </Button>
              <Button variant="outline" size="sm" onClick={onClearSelection}>
                Clear
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {resultCount > 0 ? (
            <span>
              Showing {resultCount} {getEntityLabel().toLowerCase()}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          ) : (
            <span>No {getEntityLabel().toLowerCase()} found</span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  )
}
