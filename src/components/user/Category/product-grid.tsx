"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export type ProductItem = {
  description: string
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  subcategory?: string
  subsubcategory?: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isFeatured?: boolean
  isOutOfStock?: boolean
}

type ProductGridProps = {
  products: ProductItem[]
  loading?: boolean
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { toast } = useToast()

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

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify([...wishlist]))
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e)
    }
  }, [wishlist])

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

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
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />

              {/* Wishlist button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100 bg-white text-foreground"
                onClick={(e) => toggleWishlist(e, product.id)}
              >
                <Heart className={`h-4 w-4 ${wishlist.has(product.id) ? "fill-primary text-primary" : ""}`} />
                <span className="sr-only">Add to wishlist</span>
              </Button>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.discount && product.discount > 0 && (
                  <Badge variant="default" className="bg-primary">
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
            <CardContent className="p-4">
              {product.subcategory && <div className="text-xs text-muted-foreground mb-1">{product.subcategory}</div>}
              <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.rating !== undefined && (
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= product.rating! ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  {product.reviewCount !== undefined && (
                    <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

