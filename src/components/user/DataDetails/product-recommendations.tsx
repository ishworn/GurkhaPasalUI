"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock recommended products
const recommendedProducts = [
  {
    id: "2",
    name: "Classic Denim Jacket",
    price: 79.99,
    rating: 4.5,
    reviewCount: 28,
    image: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
  },
  {
    id: "3",
    name: "Casual Sneakers",
    price: 59.99,
    rating: 4.2,
    reviewCount: 42,
    image: "/placeholder.svg?height=400&width=400",
    category: "Footwear",
  },
  {
    id: "4",
    name: "Leather Belt",
    price: 34.99,
    rating: 4.7,
    reviewCount: 16,
    image: "/placeholder.svg?height=400&width=400",
    category: "Accessories",
  },
  {
    id: "5",
    name: "Slim Fit Chinos",
    price: 49.99,
    rating: 4.4,
    reviewCount: 31,
    image: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
  },
  {
    id: "6",
    name: "Cotton Socks (3-Pack)",
    price: 14.99,
    rating: 4.8,
    reviewCount: 52,
    image: "/placeholder.svg?height=400&width=400",
    category: "Accessories",
  },
]

export default function ProductRecommendations() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const maxScroll = recommendedProducts.length - 4 // Show 4 items at a time on desktop

  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(prev - 1, 0))
  }

  const scrollRight = () => {
    setScrollPosition((prev) => Math.min(prev + 1, maxScroll))
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1"></div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={scrollPosition >= maxScroll}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollPosition * 25}%)` }}
        >
          {recommendedProducts.map((product) => (
            <div key={product.id} className="min-w-[250px] max-w-[250px] flex-shrink-0">
              <Link href={`/product/${product.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                    <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
                    <div className="font-semibold mb-1">${product.price.toFixed(2)}</div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= product.rating ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

