"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Plus, Search } from "lucide-react"
import Image from "next/image"
import { EditProductDialog } from "./edit-product-dialog"
import { UpdateStockDialog } from "./update-stock-dialog"
import { ProductDetailsDialog } from "./product-details-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { AddProductDialog } from "./add-product-dialog"
import { downloadCSV } from "@/lib/export-utils"

type ProductStatus = "in-stock" | "low-stock" | "out-of-stock"

interface Product {
  id: string
  name: string
  category: string
  status: ProductStatus
  price: string
  section: string
  stock: number
  image: string
}

const products: Product[] = [
  {
    id: "PROD-001",
    name: "Wireless Headphones",
    category: "Electronics",
    status: "in-stock",
    price: "$129.99",
    section: "Trending",
    stock: 35,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-002",
    name: "Smart Watch",
    category: "Electronics",
    status: "low-stock",
    price: "$199.50",
    section: "Flash Sale",
    stock: 12,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-003",
    name: "Bluetooth Speaker",
    category: "Electronics",
    status: "out-of-stock",
    price: "$89.00",
    section: "Trending",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-004",
    name: "Laptop Sleeve",
    category: "Accessories",
    status: "in-stock",
    price: "$29.99",
    section: "Trending",
    stock: 23,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-005",
    name: "Phone Case",
    category: "Accessories",
    status: "low-stock",
    section: "On Demand",
    price: "$19.99",
    stock: 8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-006",
    name: "Wireless Charger",
    category: "Electronics",
    status: "in-stock",
    section: "Discounted Product",
    price: "$49.99",
    stock: 42,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-007",
    name: "Fitness Tracker",
    category: "Electronics",
    status: "in-stock",
    section: "Trending",
    price: "$79.99",
    stock: 18,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-008",
    name: "Backpack",
    category: "Accessories",
    status: "in-stock",
    section: "Trending",
    price: "$59.99",
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-009",
    name: "Tablet Stand",
    category: "Accessories",
    status: "low-stock",
    section: "Flash Sale",
    price: "$24.99",
    stock: 7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-010",
    name: "Wireless Mouse",
    category: "Electronics",
    status: "out-of-stock",
    section: "Trending",
    price: "$39.99",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isStockOpen, setIsStockOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const itemsPerPage = 5

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || product.category === categoryFilter),
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditOpen(true)
  }

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product)
    setIsStockOpen(true)
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteOpen(true)
  }

  const handleAddProduct = () => {
    setIsAddOpen(true)
  }

  const handleExport = () => {
    // Format the data for export
    const exportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      status: product.status,
      price: product.price,
      stock: product.stock,
    }))

    // Download as CSV
    downloadCSV(exportData, "products-export")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full sm:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.section}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>Edit product</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStock(product)}>Update stock</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(product)}>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
                            Delete product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <EditProductDialog product={selectedProduct} open={isEditOpen} onOpenChange={setIsEditOpen} />
      )}

      {/* Update Stock Dialog */}
      {selectedProduct && (
        <UpdateStockDialog product={selectedProduct} open={isStockOpen} onOpenChange={setIsStockOpen} />
      )}

      {/* Product Details Dialog */}
      {selectedProduct && (
        <ProductDetailsDialog product={selectedProduct} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}

      {/* Delete Product Dialog */}
      {selectedProduct && (
        <DeleteConfirmationDialog
          title="Delete Product"
          description={`Are you sure you want to delete ${selectedProduct.name}? This action cannot be undone.`}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={() => {
            console.log(`Deleting product: ${selectedProduct.id}`)
            setIsDeleteOpen(false)
          }}
        />
      )}

      {/* Add Product Dialog */}
      <AddProductDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  )
}

