"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { SortOption } from "@/types/search"

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  selectedRows: Set<string>
  onRowSelect: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onRowClick?: (row: T) => void
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  getRowId: (row: T) => string
  loading?: boolean
  disablePagination?: boolean
}

export function DataTable<T>({
  data,
  columns,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onRowClick,
  sortBy,
  sortDirection,
  onSort,
  pageSize = 20,
  currentPage = 1,
  onPageChange,
  getRowId,
  loading = false,
  disablePagination = false,
}: DataTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const paginatedData = useMemo(() => {
    if (disablePagination) {
      return data
    }
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize, disablePagination])

  const totalPages = Math.ceil(data.length / pageSize)
  const allSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(getRowId(row)))
  const someSelected = paginatedData.some(row => selectedRows.has(getRowId(row)))

  const handleSort = (key: string) => {
    if (!onSort) return
    
    if (sortBy === key) {
      onSort(key, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(key, 'asc')
    }
  }

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key]
    
    if (column.render) {
      return column.render(value, row)
    }
    
    // Default rendering based on value type
    if (typeof value === 'number') {
      return <span className="font-mono text-sm text-gray-900 dark:text-white">{value.toLocaleString()}</span>
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs text-gray-900 dark:text-white">
              {item}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs text-gray-900 dark:text-white">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      )
    }
    
    return <span className="text-sm text-gray-900 dark:text-white">{String(value)}</span>
  }

  if (loading) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-600 dark:text-white">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-900/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as HTMLInputElement).indeterminate = someSelected && !allSelected
                  }}
                  onCheckedChange={onSelectAll}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-3 w-3 ${
                            sortBy === String(column.key) && sortDirection === 'asc'
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        />
                        <ChevronDown
                          className={`h-3 w-3 -mt-1 ${
                            sortBy === String(column.key) && sortDirection === 'desc'
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedData.map((row) => {
              const rowId = getRowId(row)
              const isSelected = selectedRows.has(rowId)
              const isHovered = hoveredRow === rowId
              
              return (
                <tr
                  key={rowId}
                  className={`${
                    isSelected ? 'bg-blue-50 dark:bg-gray-900/50' : isHovered ? 'bg-gray-50 dark:bg-gray-900/50' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={() => setHoveredRow(rowId)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onRowSelect(rowId, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-gray-900 dark:text-white">
                      {renderCell(column, row)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!disablePagination && totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-white">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange?.(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
