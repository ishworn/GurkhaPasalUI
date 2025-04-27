"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SortOption = {
  id: string
  name: string
}

type ProductSortProps = {
  options: SortOption[]
  defaultValue?: string
  onSortChange: (value: string) => void
}

export default function ProductSort({ options, defaultValue = options[0]?.id, onSortChange }: ProductSortProps) {
  const [selectedSort, setSelectedSort] = useState(defaultValue)

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    onSortChange(value)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

