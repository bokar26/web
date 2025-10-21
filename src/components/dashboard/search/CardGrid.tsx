"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ExternalLink } from "lucide-react"

interface CardGridProps<T> {
  data: T[]
  selectedRows: Set<string>
  onRowSelect: (id: string, selected: boolean) => void
  onRowClick?: (row: T) => void
  renderCard: (row: T, isSelected: boolean) => React.ReactNode
  getRowId: (row: T) => string
  loading?: boolean
}

export function CardGrid<T>({
  data,
  selectedRows,
  onRowSelect,
  onRowClick,
  renderCard,
  getRowId,
  loading = false,
}: CardGridProps<T>) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((row) => {
        const rowId = getRowId(row)
        const isSelected = selectedRows.has(rowId)
        const isHovered = hoveredCard === rowId

        return (
          <div
            key={rowId}
            className={`relative border rounded-lg p-6 transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : isHovered
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-200 bg-white'
            } ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(row)}
            onMouseEnter={() => setHoveredCard(rowId)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Selection checkbox */}
            <div className="absolute top-4 left-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onRowSelect(rowId, !!checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Actions button */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Card content */}
            <div className="pr-8">
              {renderCard(row, isSelected)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Generic EntityCard component
interface EntityCardProps {
  title: string
  subtitle?: string
  metrics: Array<{
    label: string
    value: string | number
    format?: 'number' | 'percentage' | 'currency' | 'text'
    color?: 'green' | 'red' | 'yellow' | 'gray'
  }>
  badges?: Array<{
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
  description?: string
  onViewDetails?: () => void
}

export function EntityCard({
  title,
  subtitle,
  metrics,
  badges = [],
  description,
  onViewDetails,
}: EntityCardProps) {
  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === 'number') {
      switch (format) {
        case 'percentage':
          return `${value}%`
        case 'currency':
          return `$${value.toLocaleString()}`
        case 'number':
          return value.toLocaleString()
        default:
          return value.toString()
      }
    }
    return value
  }

  const getMetricColor = (color?: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600'
      case 'red':
        return 'text-red-600'
      case 'yellow':
        return 'text-yellow-600'
      case 'gray':
        return 'text-gray-600'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {metric.label}
            </p>
            <p className={`text-sm font-medium ${getMetricColor(metric.color)}`}>
              {formatValue(metric.value, metric.format)}
            </p>
          </div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.slice(0, 3).map((badge, index) => (
            <Badge key={index} variant={badge.variant || 'secondary'} className="text-xs">
              {badge.text}
            </Badge>
          ))}
          {badges.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{badges.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      )}

      {/* Actions */}
      {onViewDetails && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            View details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
