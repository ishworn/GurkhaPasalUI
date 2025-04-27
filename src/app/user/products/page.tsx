import Link from "next/link"
import Image from "next/image"
import { Filter, Grid3X3, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock products data
const products = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 19.99,
  image: `/placeholder.svg?height=400&width=400`,
  category: ["Clothing", "Electronics", "Accessories", "Footwear"][Math.floor(Math.random() * 4)],
}))

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
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
                <div className="font-semibold">${product.price.toFixed(2)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
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
          <Button variant="outline" size="sm" className="h-8 w-8 font-medium">
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
    </div>
  )
}

