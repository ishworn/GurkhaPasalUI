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
import type { ProductItem } from "@/components/user/Category/product-grid"
import SearchBar from "@/components/user/Category/search-bar"

// Mock categories data with subcategories
const categories = {
  clothing: {
    id: "clothing",
    name: "Clothing",
    subcategories: {
      mens: {
        id: "mens",
        name: "Men's Clothing",
        description: "Shop our collection of men's clothing for every occasion",
        subsubcategories: [
          { id: "shirts", name: "Shirts", count: 45 },
          { id: "pants", name: "Pants & Jeans", count: 38 },
          { id: "tshirts", name: "T-Shirts", count: 56 },
          { id: "sweaters", name: "Sweaters & Hoodies", count: 29 },
          { id: "suits", name: "Suits & Blazers", count: 18 },
        ],
      },
      womens: {
        id: "womens",
        name: "Women's Clothing",
        description: "Discover stylish women's clothing for every season",
        subsubcategories: [
          { id: "dresses", name: "Dresses", count: 48 },
          { id: "tops", name: "Tops & Blouses", count: 52 },
          { id: "pants", name: "Pants & Jeans", count: 35 },
          { id: "skirts", name: "Skirts", count: 24 },
          { id: "outerwear", name: "Jackets & Coats", count: 18 },
        ],
      },
      // Other subcategories would be defined similarly
    },
  },
  // Other categories would be defined similarly
}

// Mock products data
const mockProducts: ProductItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: (i + 100).toString(),
  name: `Men's Clothing Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 19.99,
  originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 150) + 39.99 : undefined,
  discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined,
  image: `/placeholder.svg?height=400&width=400`,
  category: "Clothing",
  description:"aaaa",
  subcategory: "Men's Clothing",
  subsubcategory: ["Shirts", "Pants & Jeans", "T-Shirts", "Sweaters & Hoodies", "Suits & Blazers"][
    Math.floor(Math.random() * 5)
  ],
  rating: Math.random() * 2 + 3,
  reviewCount: Math.floor(Math.random() * 100) + 5,
  isNew: Math.random() > 0.8,
  isFeatured: Math.random() > 0.8,
  isOutOfStock: Math.random() > 0.9,
}))

// Sort options
const sortOptions: SortOption[] = [
  { id: "featured", name: "Featured" },
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "best-selling", name: "Best Selling" },
]

export default function SubcategoryPage({ params }: { params: { slug: string; subslug: string } }) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([])
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [activeSort, setActiveSort] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>
  }

  const subcategory = category.subcategories[params.subslug as keyof typeof category.subcategories]

  if (!subcategory) {
    return <div className="container mx-auto px-4 py-8">Subcategory not found</div>
  }

  // Filter groups based on subcategory
  const filterGroups: FilterGroup[] = [
    {
      id: "subsubcategory",
      name: "Category",
      type: "checkbox",
      options: subcategory.subsubcategories.map((sub) => ({
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
    let savedWishlist
    try {
      savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setWishlist(new Set(JSON.parse(savedWishlist)))
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e)
    }
  }, [])

  // Load products
  const loadProducts = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          (product.subsubcategory && product.subsubcategory.toLowerCase().includes(term)),
      )
    }

    // Apply active filters
    if (Object.keys(activeFilters).length > 0) {
      // Subsubcategory filter
      if (activeFilters.subsubcategory && activeFilters.subsubcategory.length > 0) {
        result = result.filter(
          (product) =>
            product.subsubcategory &&
            activeFilters.subsubcategory.some((sub: string) => {
              const subsubcategory = subcategory.subsubcategories.find((s) => s.id === sub)
              return product.subsubcategory === subsubcategory?.name
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
        result = result.filter((product) => product.rating && product.rating >= minRating)
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
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "best-selling":
        // In a real app, you would sort by sales data
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      default:
        // Featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    setFilteredProducts(result)
  }, [products, activeFilters, activeSort, searchTerm, subcategory?.subsubcategories])

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

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)

    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      })
    } else {
      newWishlist.add(productId)
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
      })
    }

    setWishlist(newWishlist)

    // Save to localStorage
    try {
      localStorage.setItem("wishlist", JSON.stringify([...newWishlist]))
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e)
    }
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
        <Link href={`/category/${category.id}`} className="hover:text-primary">
          {category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{subcategory.name}</span>
      </div>

      {/* Subcategory Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} products</p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <SearchBar
            fullWidth
            onSearch={handleSearch}
            placeholder={`Search in ${subcategory.name}...`}
            className="md:w-[300px]"
          />
        </div>
      </div>

      {/* Popular Sub-subcategories */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="px-4">
              All
            </TabsTrigger>
            {subcategory.subsubcategories.map((subsubcategory) => (
              <TabsTrigger key={subsubcategory.id} value={subsubcategory.id} className="px-4" asChild>
                <Link href={`/category/${category.id}/${subcategory.id}/${subsubcategory.id}`}>
                  {subsubcategory.name}
                </Link>
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
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border hover:border-primary transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />

                      {/* Product badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {product.discount && product.discount > 0 && (
                          <Badge variant="default" className="bg-primary text-white">
                            {product.discount}% OFF
                          </Badge>
                        )}
                        {product.isNew && <Badge variant="secondary">NEW</Badge>}
                        {product.isOutOfStock && (
                          <Badge variant="outline" className="bg-background/80">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Quick actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleWishlist(product.id)
                          }}
                        >
                          <Heart className={`h-5 w-5 ${wishlist.has(product.id) ? "fill-primary text-primary" : ""}`} />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            quickView(product.id)
                          }}
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">Quick view</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addToCart(product.id)
                          }}
                          disabled={product.isOutOfStock}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span className="sr-only">Add to cart</span>
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {product.subsubcategory && (
                        <div className="text-xs text-muted-foreground mb-1">{product.subsubcategory}</div>
                      )}
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      {product.rating !== undefined && (
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= Math.round(product.rating!)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          {product.reviewCount !== undefined && (
                            <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        size="sm"
                        variant={product.isOutOfStock ? "outline" : "default"}
                        disabled={product.isOutOfStock}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              // List view
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden group hover:border-primary transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />

                        {/* Product badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.discount && product.discount > 0 && (
                            <Badge variant="default" className="bg-primary text-white">
                              {product.discount}% OFF
                            </Badge>
                          )}
                          {product.isNew && <Badge variant="secondary">NEW</Badge>}
                          {product.isOutOfStock && (
                            <Badge variant="outline" className="bg-background/80">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        {product.subsubcategory && (
                          <div className="text-xs text-muted-foreground mb-1">{product.subsubcategory}</div>
                        )}
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Rating */}
                        {product.rating !== undefined && (
                          <div className="flex items-center mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= Math.round(product.rating!)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            {product.reviewCount !== undefined && (
                              <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
                            )}
                          </div>
                        )}

                        {/* Description - only in list view */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description ||
                            "Premium quality product with excellent craftsmanship and attention to detail. Perfect for everyday use."}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleWishlist(product.id)
                              }}
                            >
                              <Heart
                                className={`h-4 w-4 ${wishlist.has(product.id) ? "fill-primary text-primary" : ""}`}
                              />
                              <span className="sr-only">Add to wishlist</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                quickView(product.id)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Quick view</span>
                            </Button>
                            <Button
                              className="ml-2"
                              size="sm"
                              variant={product.isOutOfStock ? "outline" : "default"}
                              disabled={product.isOutOfStock}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                addToCart(product.id)
                              }}
                            >
                              {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
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

