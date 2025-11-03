"use client"

import { Search, Grid3X3, List, Download, RotateCcw, Bookmark } from "lucide-react"
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
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier' | 'supplier-factory' | 'logistics'
  onSearch: () => void
  onSaveSearch: () => void
  onResetFilters: () => void
  hasSearchExecuted?: boolean
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
  onSearch,
  onSaveSearch,
  onResetFilters,
  hasSearchExecuted = false,
}: SearchToolbarProps) {
  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
  )

  const getEntityLabel = () => {
    switch (entityType) {
      case 'supplier': return 'Suppliers'
      case 'factory': return 'Factories'
      case 'supplier-factory': return 'Suppliers'
      case 'warehouse': return 'Warehouses'
      case 'forwarder': return 'Freight Forwarders'
      case 'carrier': return 'Carriers'
      case 'logistics': return 'Logistics'
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-white" />
            <Input
              placeholder={`Search ${getEntityLabel().toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={`rounded-r-none text-gray-900 dark:text-white ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-gray-950' 
                  : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-l-none text-gray-900 dark:text-white ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-950' 
                  : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Search button */}
          <Button
            size="sm"
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {/* Save Search button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
            disabled={!hasSearchExecuted}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Search
          </Button>

          {/* Reset Filters button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-white">
                {selectedCount} selected
              </span>
              <Button variant="outline" size="sm" onClick={onCompare} className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                Compare
              </Button>
              <Button variant="outline" size="sm" onClick={onClearSelection} className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
                Clear
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={onExport} className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Results summary */}
      {hasSearchExecuted && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-white">
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
        </div>
      )}
    </div>
  )
}
