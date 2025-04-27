"use client"

import { useState, useEffect } from "react"
import { X, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export type FilterOption = {
  id: string
  name: string
  count?: number
}

export type FilterGroup = {
  id: string
  name: string
  type: "checkbox" | "radio" | "color" | "rating" | "range"
  options?: FilterOption[]
  minValue?: number
  maxValue?: number
  colorOptions?: Array<{ id: string; name: string; color: string }>
}

type CategoryFilterProps = {
  filters: FilterGroup[]
  onFilterChange: (filters: Record<string, any>) => void
  initialFilters?: Record<string, any>
  onClearAll: () => void
}

export default function CategoryFilter({
  filters,
  onFilterChange,
  initialFilters = {},
  onClearAll,
}: CategoryFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters)
  const [expandedMobile, setExpandedMobile] = useState(false)

  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length
    } else if (value !== undefined && value !== null) {
      return count + 1
    }
    return count
  }, 0)

  useEffect(() => {
    onFilterChange(activeFilters)
  }, [activeFilters, onFilterChange])

  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    setActiveFilters((prev) => {
      const currentValues = prev[groupId] || []
      let newValues

      if (checked) {
        newValues = [...currentValues, optionId]
      } else {
        newValues = currentValues.filter((id: string) => id !== optionId)
      }

      return {
        ...prev,
        [groupId]: newValues.length > 0 ? newValues : undefined,
      }
    })
  }

  const handleRadioChange = (groupId: string, optionId: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [groupId]: optionId,
    }))
  }

  const handleRangeChange = (groupId: string, values: number[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [groupId]: values,
    }))
  }

  const handleClearFilter = (groupId: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[groupId]
      return newFilters
    })
  }

  const handleClearAll = () => {
    setActiveFilters({})
    onClearAll()
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setExpandedMobile(!expandedMobile)}
          >
            {expandedMobile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={`${expandedMobile ? "block" : "hidden"} md:block`}>
        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([groupId, value]) => {
                const group = filters.find((g) => g.id === groupId)
                if (!group) return null

                if (Array.isArray(value)) {
                  return value.map((optionId) => {
                    const option = group.options?.find((o) => o.id === optionId)
                    if (!option) return null

                    return (
                      <Badge
                        key={`${groupId}-${optionId}`}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <span className="text-xs">
                          {group.name}: {option.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCheckboxChange(groupId, optionId, false)}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )
                  })
                } else if (group.type === "range" && Array.isArray(value)) {
                  return (
                    <Badge key={groupId} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      <span className="text-xs">
                        {group.name}: ${value[0]} - ${value[1]}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClearFilter(groupId)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                } else if (typeof value === "string") {
                  const option = group.options?.find((o) => o.id === value)
                  if (!option) return null

                  return (
                    <Badge key={groupId} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      <span className="text-xs">
                        {group.name}: {option.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClearFilter(groupId)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                }

                return null
              })}
            </div>
          </div>
        )}

        {/* Filter groups */}
        <Accordion type="multiple" defaultValue={filters.map((f) => f.id)} className="px-4 py-2">
          {filters.map((filter) => (
            <AccordionItem key={filter.id} value={filter.id} className="border-b last:border-0">
              <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">{filter.name}</AccordionTrigger>
              <AccordionContent className="pb-3">
                {filter.type === "checkbox" && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`filter-${filter.id}-${option.id}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={activeFilters[filter.id]?.includes(option.id) || false}
                          onChange={(e) => handleCheckboxChange(filter.id, option.id, e.target.checked)}
                        />
                        <label
                          htmlFor={`filter-${filter.id}-${option.id}`}
                          className="ml-2 text-sm text-muted-foreground flex-1"
                        >
                          {option.name}
                        </label>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">({option.count})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {filter.type === "radio" && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`filter-${filter.id}-${option.id}`}
                          name={`filter-${filter.id}`}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          checked={activeFilters[filter.id] === option.id}
                          onChange={() => handleRadioChange(filter.id, option.id)}
                        />
                        <label
                          htmlFor={`filter-${filter.id}-${option.id}`}
                          className="ml-2 text-sm text-muted-foreground flex-1"
                        >
                          {option.name}
                        </label>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">({option.count})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {filter.type === "color" && filter.colorOptions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filter.colorOptions.map((color) => {
                      const isSelected = activeFilters[filter.id]?.includes(color.id)
                      return (
                        <button
                          key={color.id}
                          className={`w-8 h-8 rounded-full relative ${isSelected ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border"}`}
                          style={{ backgroundColor: color.color }}
                          onClick={() => handleCheckboxChange(filter.id, color.id, !isSelected)}
                          title={color.name}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={`h-4 w-4 ${["#FFFFFF", "#F8F9FA", "#F1F3F5"].includes(color.color) ? "text-black" : "text-white"}`}
                              />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {filter.type === "range" && filter.minValue !== undefined && filter.maxValue !== undefined && (
                  <div className="space-y-4 pt-2">
                    <Slider
                      defaultValue={[filter.minValue, filter.maxValue]}
                      min={filter.minValue}
                      max={filter.maxValue}
                      step={1}
                      value={activeFilters[filter.id] || [filter.minValue, filter.maxValue]}
                      onValueChange={(values) => handleRangeChange(filter.id, values)}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${activeFilters[filter.id]?.[0] || filter.minValue}</span>
                      <span className="text-sm">${activeFilters[filter.id]?.[1] || filter.maxValue}</span>
                    </div>
                  </div>
                )}

                {filter.type === "rating" && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          id={`filter-${filter.id}-${rating}`}
                          name={`filter-${filter.id}`}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          checked={activeFilters[filter.id] === rating.toString()}
                          onChange={() => handleRadioChange(filter.id, rating.toString())}
                        />
                        <label
                          htmlFor={`filter-${filter.id}-${rating}`}
                          className="ml-2 text-sm text-muted-foreground flex items-center"
                        >
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1">& Up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

