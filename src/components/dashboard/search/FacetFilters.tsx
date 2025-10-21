"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchFilters, FilterOption } from "@/types/search"

interface FacetFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier'
  availableOptions: {
    countries: FilterOption[]
    regions: FilterOption[]
    certifications: FilterOption[]
    specialties: FilterOption[]
    modes: FilterOption[]
    services: FilterOption[]
  }
}

export function FacetFilters({
  filters,
  onFiltersChange,
  entityType,
  availableOptions,
}: FacetFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['country', 'certification']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilter = (key: keyof SearchFilters, value: string | string[] | [number, number]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const renderMultiSelectFilter = (
    key: keyof SearchFilters,
    label: string,
    options: FilterOption[],
    sectionId: string
  ) => {
    const currentValues = (filters[key] as string[]) || []
    const isExpanded = expandedSections.has(sectionId)

    return (
      <div className="border border-gray-200 rounded-lg">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{label}</span>
            {currentValues.length > 0 && (
              <Badge variant="secondary">{currentValues.length}</Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="p-3 pt-0 space-y-2 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${sectionId}-${option.value}`}
                  checked={currentValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter(key, [...currentValues, option.value])
                    } else {
                      updateFilter(key, currentValues.filter(v => v !== option.value))
                    }
                  }}
                />
                <label
                  htmlFor={`${sectionId}-${option.value}`}
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {option.count && (
                    <span className="text-gray-500 text-xs">({option.count})</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderRangeFilter = (
    key: keyof SearchFilters,
    label: string,
    min: number,
    max: number,
    step: number,
    unit: string,
    sectionId: string
  ) => {
    const currentRange = (filters[key] as [number, number]) || [min, max]
    const isExpanded = expandedSections.has(sectionId)

    return (
      <div className="border border-gray-200 rounded-lg">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{label}</span>
            {(currentRange[0] !== min || currentRange[1] !== max) && (
              <Badge variant="secondary">
                {currentRange[0]}-{currentRange[1]} {unit}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="p-3 pt-0 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentRange[0]}
                onChange={(e) => updateFilter(key, [parseInt(e.target.value), currentRange[1]])}
                className="flex-1"
              />
              <span className="text-sm w-16 text-center">
                {currentRange[0]} {unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentRange[1]}
                onChange={(e) => updateFilter(key, [currentRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm w-16 text-center">
                {currentRange[1]} {unit}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const getEntitySpecificFilters = () => {
    switch (entityType) {
      case 'supplier':
        return (
          <>
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
            {renderMultiSelectFilter('specialty', 'Specialties', availableOptions.specialties, 'specialty')}
            {renderRangeFilter('moqRange', 'MOQ Range', 100, 10000, 100, 'units', 'moq')}
          </>
        )
      case 'factory':
        return (
          <>
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
            {renderMultiSelectFilter('specialty', 'Capabilities', availableOptions.specialties, 'capability')}
            {renderRangeFilter('capacityRange', 'Capacity Range', 1000, 100000, 1000, 'units/month', 'capacity')}
            {renderRangeFilter('utilizationRange', 'Utilization', 50, 100, 5, '%', 'utilization')}
          </>
        )
      case 'warehouse':
        return (
          <>
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('service', 'Services', availableOptions.services, 'service')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
            {renderRangeFilter('capacityRange', 'Capacity Range', 1000, 100000, 1000, 'sq ft', 'capacity')}
            {renderRangeFilter('utilizationRange', 'Utilization', 50, 100, 5, '%', 'utilization')}
          </>
        )
      case 'forwarder':
        return (
          <>
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('mode', 'Transport Modes', availableOptions.modes, 'mode')}
            {renderMultiSelectFilter('specialty', 'Specialties', availableOptions.specialties, 'specialty')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
          </>
        )
      case 'carrier':
        return (
          <>
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('mode', 'Transport Modes', availableOptions.modes, 'mode')}
            {renderMultiSelectFilter('specialty', 'Specialties', availableOptions.specialties, 'specialty')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
          </>
        )
      default:
        return null
    }
  }

  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
  )

  return (
    <div className="space-y-4">
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center space-x-1">
              <span>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter(key as keyof SearchFilters)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter sections */}
      <div className="space-y-3">
        {getEntitySpecificFilters()}
      </div>
    </div>
  )
}
