"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, Grid3X3, List, Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import CategoryFilter, { type FilterGroup } from "@/components/user/Category/category-filter"
import ProductSort, { type SortOption } from "@/components/user/Category/product-sort"
import type { Product } from  "@/components/user/DataDetails/DataDetails"
import SearchBar from "@/components/user/Category/search-bar"
import { useRouter } from "next/navigation"
import productData from "@/components/user/DataDetails/DataDetails"
import ProductCard from "@/components/user/Layout/components/ProductCard"


// Mock categories data with subcategories
const categories = {
  clothing: {
    id: "clothing",
    name: "Clothing",
    description: "Explore our wide range of clothing options for all occasions",
    subcategories: [
      {
        id: "mens",
        name: "Men's Clothing",
        count: 124,
        subsubcategories: [
          { id: "shirts", name: "Shirts", count: 45 },
          { id: "pants", name: "Pants & Jeans", count: 38 },
          { id: "tshirts", name: "T-Shirts", count: 56 },
          { id: "sweaters", name: "Sweaters & Hoodies", count: 29 },
          { id: "suits", name: "Suits & Blazers", count: 18 },
        ],
      },
      {
        id: "womens",
        name: "Women's Clothing",
        count: 156,
        subsubcategories: [
          { id: "dresses", name: "Dresses", count: 48 },
          { id: "tops", name: "Tops & Blouses", count: 52 },
          { id: "pants", name: "Pants & Jeans", count: 35 },
          { id: "skirts", name: "Skirts", count: 24 },
          { id: "outerwear", name: "Jackets & Coats", count: 18 },
        ],
      },
      {
        id: "kids",
        name: "Kids' Clothing",
        count: 89,
        subsubcategories: [
          { id: "boys", name: "Boys' Clothing", count: 32 },
          { id: "girls", name: "Girls' Clothing", count: 36 },
          { id: "baby", name: "Baby Clothing", count: 28 },
          { id: "teens", name: "Teen Clothing", count: 18 },
          { id: "accessories", name: "Kids' Accessories", count: 12 },
        ],
      },
      {
        id: "activewear",
        name: "Activewear",
        count: 67,
        subsubcategories: [
          { id: "tops", name: "Athletic Tops", count: 24 },
          { id: "bottoms", name: "Athletic Bottoms", count: 18 },
          { id: "sets", name: "Athletic Sets", count: 12 },
          { id: "outerwear", name: "Athletic Jackets", count: 8 },
          { id: "accessories", name: "Athletic Accessories", count: 15 },
        ],
      },
      {
        id: "outerwear",
        name: "Outerwear",
        count: 42,
        subsubcategories: [
          { id: "jackets", name: "Jackets", count: 18 },
          { id: "coats", name: "Coats", count: 12 },
          { id: "vests", name: "Vests", count: 8 },
          { id: "rainwear", name: "Rainwear", count: 6 },
          { id: "winterwear", name: "Winter Wear", count: 10 },
        ],
      },
    ],
  },
  footwear: {
    id: "footwear",
    name: "Footwear",
    description: "Step into comfort and style with our footwear collection",
    subcategories: [
      { id: "casual", name: "Casual Shoes", count: 48 },
      { id: "athletic", name: "Athletic Shoes", count: 36 },
      { id: "formal", name: "Formal Shoes", count: 24 },
      { id: "boots", name: "Boots", count: 32 },
      { id: "sandals", name: "Sandals", count: 28 },
    ],
  },
  accessories: {
    id: "accessories",
    name: "Accessories",
    description: "Step into comfort and style with our footwear collection",
    subcategories: [
      { id: "casual", name: "Casual Shoes", count: 48 },
      { id: "athletic", name: "Athletic Shoes", count: 36 },
      { id: "formal", name: "Formal Shoes", count: 24 },
      { id: "boots", name: "Boots", count: 32 },
      { id: "sandals", name: "Sandals", count: 28 },
    ],
  },
  electronics: {
    id: "electronics",
    name: "Electronics",
    description: "Step into comfort and style with our footwear collection",
    subcategories: [
      { id: "casual", name: "Casual Shoes", count: 48 },
      { id: "athletic", name: "Athletic Shoes", count: 36 },
      { id: "formal", name: "Formal Shoes", count: 24 },
      { id: "boots", name: "Boots", count: 32 },
      { id: "sandals", name: "Sandals", count: 28 },
    ],
  },

  // Other categories would be defined similarly
}

// Mock products data


// Sort options
const sortOptions: SortOption[] = [
  { id: "featured", name: "Featured" },
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "best-selling", name: "Best Selling" },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [activeSort, setActiveSort] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const router = useRouter()

  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>
  }

  // Filter groups based on category
  const filterGroups: FilterGroup[] = [
    {
      id: "subcategory",
      name: "Subcategory",
      type: "checkbox",
      options: category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        count: sub.count,
      })),
    },
    {
      id: "price",
      name: "Price Range",
      type: "range",
      minValue: 0,
      maxValue: 200,
    },
    {
      id: "rating",
      name: "Rating",
      type: "rating",
    },
    {
      id: "color",
      name: "Color",
      type: "color",
      colorOptions: [
        { id: "black", name: "Black", color: "#000000" },
        { id: "white", name: "White", color: "#FFFFFF" },
        { id: "red", name: "Red", color: "#FF0000" },
        { id: "blue", name: "Blue", color: "#0000FF" },
        { id: "green", name: "Green", color: "#00FF00" },
        { id: "yellow", name: "Yellow", color: "#FFFF00" },
        { id: "purple", name: "Purple", color: "#800080" },
        { id: "orange", name: "Orange", color: "#FFA500" },
        { id: "pink", name: "Pink", color: "#FFC0CB" },
        { id: "gray", name: "Gray", color: "#808080" },
      ],
    },
    {
      id: "size",
      name: "Size",
      type: "checkbox",
      options: [
        { id: "xs", name: "XS", count: 24 },
        { id: "s", name: "S", count: 36 },
        { id: "m", name: "M", count: 42 },
        { id: "l", name: "L", count: 38 },
        { id: "xl", name: "XL", count: 28 },
        { id: "xxl", name: "XXL", count: 18 },
      ],
    },
    {
      id: "brand",
      name: "Brand",
      type: "checkbox",
      options: [
        { id: "brand-a", name: "Brand A", count: 42 },
        { id: "brand-b", name: "Brand B", count: 36 },
        { id: "brand-c", name: "Brand C", count: 28 },
        { id: "brand-d", name: "Brand D", count: 24 },
        { id: "brand-e", name: "Brand E", count: 18 },
      ],
    },
    {
      id: "availability",
      name: "Availability",
      type: "radio",
      options: [
        { id: "in-stock", name: "In Stock", count: 156 },
        { id: "out-of-stock", name: "Out of Stock", count: 12 },
      ],
    },
  ]

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setWishlist(new Set(JSON.parse(savedWishlist)))
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e)
    }
  }, [])

  const loadProducts = useCallback(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      setProducts(productData)
      setFilteredProducts(productData)
      setIsLoading(false)
    }, 500)
  }, [])

  // Load products
  useEffect(() => {
    loadProducts()
  }, [loadProducts, params.slug])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...productData]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (productData) =>
          productData.name.toLowerCase().includes(term) ||
        productData.categories.includes(term) ||
          (productData.subcategory && productData.subcategory.includes(term)),
      )
    }

    // Apply active filters
    if (Object.keys(activeFilters).length > 0) {
      // Subcategory filter
      if (activeFilters.subcategory && activeFilters.subcategory.length > 0) {
        result = result.filter(
          (product) =>
            product.subcategory &&
            activeFilters.subcategory.some((sub: string) => {
              const subcategory = category.subcategories.find((s) => s.id === sub)
              return product.subcategory?.includes(subcategory?.name || "")
            }),
        )
      }

      // Price range filter
      if (activeFilters.price && Array.isArray(activeFilters.price)) {
        const [min, max] = activeFilters.price
        result = result.filter((product) => product.price >= min && product.price <= max)
      }

      // Rating filter
      if (activeFilters.rating) {
        const minRating = Number.parseInt(activeFilters.rating)
        result = result.filter((product) => product.reviews.length && product.reviews.length >= minRating)
      }

      // Availability filter
      if (activeFilters.availability) {
        if (activeFilters.availability === "in-stock") {
          result = result.filter((product) => !product.isOutOfStock)
        } else if (activeFilters.availability === "out-of-stock") {
          result = result.filter((product) => product.isOutOfStock)
        }
      }
    }

    // Apply sorting
    switch (activeSort) {
      case "newest":
        // In a real app, you would sort by date
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
    
      case "best-selling":
        // In a real app, you would sort by sales data
        result.sort((a, b) => (b.reviews.length || 0) - (a.reviews.length || 0))
        break
      default:
        // Featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    setFilteredProducts(result)
  }, [productData, activeFilters, activeSort, searchTerm, ])

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters)
  }

  const handleSortChange = (value: string) => {
    setActiveSort(value)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setSearchTerm("")
  }
 


  const addToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "The item has been added to your cart",
    })
  }

  const quickView = (productId: string) => {
    // In a real app, this would open a modal with product details
    toast({
      title: "Quick view",
      description: "Quick view functionality would open a modal here",
    })
  }

  const Previous = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    )
  }

  const Next = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-primary">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} products</p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <SearchBar
            fullWidth
            onSearch={handleSearch}
            placeholder={`Search in ${category.name}...`}
            className="md:w-[300px]"
          />
        </div>
      </div>

      {/* Popular Subcategories */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="px-4">
              All
            </TabsTrigger>
            {category.subcategories.map((subcategory) => (
              <TabsTrigger key={subcategory.id} value={subcategory.id} className="px-4" asChild>
                <Link href={`/category/${category.id}/${subcategory.id}`}>{subcategory.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products Section */}
      <div>
        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="py-4">
                  <CategoryFilter
                    filters={filterGroups}
                    onFilterChange={handleFilterChange}
                    initialFilters={activeFilters}
                    onClearAll={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {Object.keys(activeFilters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9 text-sm">
                Clear all filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ProductSort options={sortOptions} defaultValue="featured" onSortChange={handleSortChange} />

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "ghost" : "ghost"}
                size="icon"
                className={`h-9 w-9 rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "ghost" : "ghost"}
                size="icon"
                className={`h-9 w-9 rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters (sidebar) */}
          <div className="w-full md:w-64 shrink-0 hidden md:block">
            <CategoryFilter
              filters={filterGroups}
              onFilterChange={handleFilterChange}
              initialFilters={activeFilters}
              onClearAll={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              // Loading skeleton
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="relative aspect-square bg-muted"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-5 bg-muted rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={handleClearFilters}>Clear all filters</Button>
              </div>
            ) : viewMode === "grid" ? (
              // Grid view
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((productData) => (
                  <ProductCard key={productData.id} {...productData} />
                ))}
              </div>
            ) : (
              // List view
              <div className="space-y-4">
                {filteredProducts.map((productData) => (
                  <ProductCard key={productData.id} {...productData} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <span className="sr-only">Previous page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="default" size="sm" className="h-8 w-8 font-medium">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 font-medium">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 font-medium">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 font-medium">
                    4
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 font-medium">
                    5
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Next page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

