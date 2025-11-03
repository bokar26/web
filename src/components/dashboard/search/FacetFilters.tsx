"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SearchFilters, FilterOption } from "@/types/search"

interface FacetFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier' | 'supplier-factory' | 'logistics'
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(entityType === 'supplier-factory' ? ['productType', 'country', 'certification'] : ['country', 'certification']))
  const [customProductTypeInput, setCustomProductTypeInput] = useState("")

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
      <div className="dashboard-card rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
            {currentValues.length > 0 && (
              <Badge variant="secondary">{currentValues.length}</Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </Button>

        {isExpanded && (
          <div className="bg-white dark:bg-gray-950 max-h-48 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = currentValues.includes(option.value)
              return (
                <div 
                  key={option.value} 
                  className={`flex items-center space-x-2 py-3 px-3 transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  } ${
                    index < options.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''
                  }`}
                >
                  <Checkbox
                    id={`${sectionId}-${option.value}`}
                    checked={isSelected}
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
                    className="text-sm text-gray-900 dark:text-white cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    {option.count && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs">({option.count})</span>
                    )}
                  </label>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderProductTypeFilter = (
    options: FilterOption[],
    sectionId: string
  ) => {
    const currentValues = (filters.specialty as string[]) || []
    const customTypes = (filters.customProductTypes as string[]) || []
    const isExpanded = expandedSections.has(sectionId)

    const handleAddCustomType = () => {
      if (customProductTypeInput.trim() && !customTypes.includes(customProductTypeInput.trim())) {
        updateFilter('customProductTypes', [...customTypes, customProductTypeInput.trim()])
        setCustomProductTypeInput("")
      }
    }

    const removeCustomType = (type: string) => {
      updateFilter('customProductTypes', customTypes.filter(t => t !== type))
    }

    return (
      <div className="dashboard-card rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">Product Type</span>
            {(currentValues.length > 0 || customTypes.length > 0) && (
              <Badge variant="secondary">{currentValues.length + customTypes.length}</Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </Button>

        {isExpanded && (
          <div className="bg-white dark:bg-gray-950 flex flex-col max-h-96 relative">
            {/* Scrollable Product Type Checkboxes */}
            <div className="overflow-y-auto flex-1 pb-[140px]">
              {options.map((option, index) => {
                const isSelected = currentValues.includes(option.value)
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-center space-x-2 py-3 px-3 transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    } ${
                      index < options.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''
                    }`}
                  >
                    <Checkbox
                      id={`${sectionId}-${option.value}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('specialty', [...currentValues, option.value])
                        } else {
                          updateFilter('specialty', currentValues.filter(v => v !== option.value))
                        }
                      }}
                    />
                    <label
                      htmlFor={`${sectionId}-${option.value}`}
                      className="text-sm text-gray-900 dark:text-white cursor-pointer flex-1 flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">({option.count})</span>
                      )}
                    </label>
                  </div>
                )
              })}
            </div>

            {/* Custom Product Types Section - Sticky to Bottom */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 p-3 space-y-3 bg-white dark:bg-gray-950 z-10">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Also Include</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type specific product types..."
                  value={customProductTypeInput}
                  onChange={(e) => setCustomProductTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomType()
                    }
                  }}
                  className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                  size="sm"
                  onClick={handleAddCustomType}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
              </div>
              
              {/* Display custom types */}
              {customTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {customTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="flex items-center space-x-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900"
                    >
                      <span>{type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent text-gray-900 dark:text-white"
                        onClick={() => removeCustomType(type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSingleSliderFilter = (
    key: keyof SearchFilters,
    label: string,
    min: number,
    max: number,
    step: number,
    unit: string,
    sectionId: string
  ) => {
    const currentRange = (filters[key] as [number, number])
    const currentMax = currentRange ? currentRange[1] : max
    const isExpanded = expandedSections.has(sectionId)

    return (
      <div className="dashboard-card rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
            {currentMax !== max && (
              <Badge variant="secondary" className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900">
                ≤ {currentMax} {unit}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </Button>

        {isExpanded && (
          <div className="bg-white dark:bg-gray-950 p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2 py-2">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentMax}
                onChange={(e) => updateFilter(key, [min, parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm w-20 text-center text-gray-900 dark:text-white">
                {currentMax} {unit}
              </span>
            </div>
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
      <div className="dashboard-card rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
            {(currentRange[0] !== min || currentRange[1] !== max) && (
              <Badge variant="secondary">
                {currentRange[0]}-{currentRange[1]} {unit}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </Button>

        {isExpanded && (
          <div className="bg-white dark:bg-gray-950 p-3 space-y-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2 py-2 border-b border-gray-200 dark:border-gray-800">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentRange[0]}
                onChange={(e) => updateFilter(key, [parseInt(e.target.value), currentRange[1]])}
                className="flex-1"
              />
              <span className="text-sm w-16 text-center text-gray-900 dark:text-white">
                {currentRange[0]} {unit}
              </span>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentRange[1]}
                onChange={(e) => updateFilter(key, [currentRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm w-16 text-center text-gray-900 dark:text-white">
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
            {renderSingleSliderFilter('moqRange', 'MOQ Range', 0, 10000, 10, 'units', 'moq')}
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
      case 'supplier-factory':
        // Combined suppliers and factories with type filter
        const typeOptions: FilterOption[] = [
          { value: 'Supplier', label: 'Supplier' },
          { value: 'Factory', label: 'Factory' },
        ]
        return (
          <>
            {renderProductTypeFilter(availableOptions.specialties, 'productType')}
            {renderMultiSelectFilter('partnerType', 'Type', typeOptions, 'type')}
            {renderMultiSelectFilter('country', 'Country', availableOptions.countries, 'country')}
            {renderMultiSelectFilter('certification', 'Certifications', availableOptions.certifications, 'certification')}
            {renderSingleSliderFilter('moqRange', 'MOQ Range', 0, 10000, 10, 'units', 'moq')}
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
      case 'logistics':
        // Combined freight forwarders and carriers with type filter
        const logisticsTypeOptions: FilterOption[] = [
          { value: 'Freight Forwarder', label: 'Freight Forwarder' },
          { value: 'Carrier', label: 'Carrier' },
          { value: 'Shipper', label: 'Shipper' },
          { value: '3PL Provider', label: '3PL Provider' },
        ]
        return (
          <>
            {renderMultiSelectFilter('partnerType', 'Type', logisticsTypeOptions, 'type')}
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

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === 'customProductTypes' || key === 'specialty') {
      // Handle specialty and customProductTypes specially for display
      return Array.isArray(value) ? value.length > 0 : false
    }
    return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
  })

  return (
    <div className="space-y-4">
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center space-x-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900">
              <span>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent text-gray-900 dark:text-white"
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
