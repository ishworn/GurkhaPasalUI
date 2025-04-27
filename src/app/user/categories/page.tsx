import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock categories data with subcategories
const categories = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Explore our wide range of clothing options for all occasions",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    subcategories: [
      { id: "mens", name: "Men's Clothing" },
      { id: "womens", name: "Women's Clothing" },
      { id: "kids", name: "Kids' Clothing" },
      { id: "activewear", name: "Activewear" },
      { id: "outerwear", name: "Outerwear" },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    description: "Step into comfort and style with our footwear collection",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    subcategories: [
      { id: "casual", name: "Casual Shoes" },
      { id: "athletic", name: "Athletic Shoes" },
      { id: "formal", name: "Formal Shoes" },
      { id: "boots", name: "Boots" },
      { id: "sandals", name: "Sandals" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with our stylish accessories",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    subcategories: [
      { id: "bags", name: "Bags & Backpacks" },
      { id: "jewelry", name: "Jewelry" },
      { id: "watches", name: "Watches" },
      { id: "belts", name: "Belts" },
      { id: "hats", name: "Hats & Caps" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Discover the latest tech and electronic gadgets",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    subcategories: [
      { id: "smartphones", name: "Smartphones" },
      { id: "laptops", name: "Laptops & Computers" },
      { id: "audio", name: "Audio & Headphones" },
      { id: "wearables", name: "Wearable Tech" },
      { id: "accessories", name: "Electronic Accessories" },
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    description: "Transform your space with our home decor and essentials",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    subcategories: [
      { id: "decor", name: "Home Decor" },
      { id: "furniture", name: "Furniture" },
      { id: "kitchen", name: "Kitchen & Dining" },
      { id: "bedding", name: "Bedding & Bath" },
      { id: "storage", name: "Storage & Organization" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    description: "Enhance your natural beauty with our premium products",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    subcategories: [
      { id: "skincare", name: "Skincare" },
      { id: "makeup", name: "Makeup" },
      { id: "haircare", name: "Hair Care" },
      { id: "fragrance", name: "Fragrance" },
      { id: "personal-care", name: "Personal Care" },
    ],
  },
]

// Mock products data
const featuredProducts = [
  {
    id: "1",
    name: "Premium Comfort T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Leather Wallet",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 199.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
  },
  {
    id: "5",
    name: "Running Shoes",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Footwear",
  },
  {
    id: "6",
    name: "Scented Candle",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Home & Living",
  },
  {
    id: "7",
    name: "Facial Cleanser",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Beauty & Personal Care",
  },
  {
    id: "8",
    name: "Denim Jacket",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Categories</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories
          .filter((cat) => cat.featured)
          .map((category) => (
            <Link key={category.id} href={`/user/category/${category.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="relative h-48">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-center">{category.subcategories.length} Subcategories</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map((subcat) => (
                      <span key={subcat.id} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {subcat.name}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>

      {/* All Categories */}
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <h3 className="text-lg font-bold mb-3">{category.name}</h3>
              <ul className="space-y-2">
                {category.subcategories.map((subcat) => (
                  <li key={subcat.id}>
                    <Link
                      href={`/category/${category.id}/${subcat.id}`}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      {subcat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="p-0 h-auto mt-3 text-primary" asChild>
                <Link href={`/category/${category.id}`}>View All {category.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Products */}
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
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
    </div>
  )
}

