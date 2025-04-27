"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowRight, History, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock search suggestions
const popularSearches = ["T-shirts", "Summer dresses", "Running shoes", "Wireless headphones", "Laptop bags"]

// Mock recent searches (in a real app, this would come from localStorage or user data)
const getRecentSearches = () => {
  if (typeof window === "undefined") return []

  try {
    const searches = localStorage.getItem("recentSearches")
    return searches ? JSON.parse(searches) : []
  } catch (e) {
    return []
  }
}

const saveRecentSearch = (term: string) => {
  if (typeof window === "undefined") return

  try {
    const searches = getRecentSearches()
    const newSearches = [term, ...searches.filter((s: string) => s !== term)].slice(0, 5)
    localStorage.setItem("recentSearches", JSON.stringify(newSearches))
  } catch (e) {
    // Handle error
  }
}

type SearchBarProps = {
  fullWidth?: boolean
  onSearch?: (term: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  fullWidth = false,
  onSearch,
  placeholder = "Search for products...",
  className = "",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)

    // Save to recent searches
    saveRecentSearch(searchTerm)
    setRecentSearches(getRecentSearches())

    // If onSearch prop is provided, use it
    if (onSearch) {
      onSearch(searchTerm)
    } else {
      // Otherwise navigate to search page
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }

    // Close popover
    setIsOpen(false)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    inputRef.current?.focus()
  }

  const selectSearchTerm = (term: string) => {
    setSearchTerm(term)
    setIsOpen(false)

    // Focus the input after selection
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-auto"} ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              className={`pr-8 ${fullWidth ? "w-full" : "w-[300px]"}`}
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" onClick={clearSearch} className="absolute right-8 h-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-0 h-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[300px]"
          align="start"
          sideOffset={4}
          style={{ width: fullWidth ? "100%" : "300px" }}
        >
          <Command>
            <CommandInput placeholder="Type to search..." value={searchTerm} onValueChange={setSearchTerm} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>

              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((term) => (
                    <CommandItem
                      key={`recent-${term}`}
                      onSelect={() => selectSearchTerm(term)}
                      className="flex items-center"
                    >
                      <History className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{term}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup heading="Popular Searches">
                {popularSearches.map((term) => (
                  <CommandItem
                    key={`popular-${term}`}
                    onSelect={() => selectSearchTerm(term)}
                    className="flex items-center justify-between"
                  >
                    <span>{term}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

