"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, RotateCcw, Bookmark } from "lucide-react"

interface PaginationBarProps {
  currentPage: number
  pageSize: number
  totalResults: number
  onNext: () => void
  showNext: boolean
  onResetFilters?: () => void
  onSaveSearch?: () => void
  hasSearchExecuted?: boolean
  position?: 'top' | 'bottom'
}

export function PaginationBar({
  currentPage,
  pageSize,
  totalResults,
  onNext,
  showNext,
  onResetFilters,
  onSaveSearch,
  hasSearchExecuted = false,
  position = 'bottom',
}: PaginationBarProps) {
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalResults)

  return (
    <div className={`flex items-center justify-between py-3 px-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 ${
      position === 'top' ? 'mb-4' : 'mt-4'
    }`}>
      {/* Result count */}
      <div className="text-sm text-gray-700 dark:text-white">
        Showing {startIndex} to {endIndex} of {totalResults} results
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}

        {onSaveSearch && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            disabled={!hasSearchExecuted}
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        )}

        {showNext && (
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

