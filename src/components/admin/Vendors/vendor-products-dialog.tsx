"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Download } from "lucide-react"
import Image from "next/image"
import { downloadCSV } from "@/lib/export-utils"

interface VendorProductsDialogProps {
  vendor: {
    id: string
    name: string
    contactPerson: string
    email: string
    phone: string
    status: "active" | "inactive" | "pending"
    productsCount: number
    dateAdded: string
    logo?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock products data
const vendorProducts = [
  {
    id: "PROD-001",
    name: "Wireless Headphones",
    category: "Electronics",
    status: "in-stock",
    price: "$129.99",
    stock: 35,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-002",
    name: "Smart Watch",
    category: "Electronics",
    status: "low-stock",
    price: "$199.50",
    stock: 12,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-003",
    name: "Bluetooth Speaker",
    category: "Electronics",
    status: "out-of-stock",
    price: "$89.00",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-006",
    name: "Wireless Charger",
    category: "Electronics",
    status: "in-stock",
    price: "$49.99",
    stock: 42,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-007",
    name: "Fitness Tracker",
    category: "Electronics",
    status: "in-stock",
    price: "$79.99",
    stock: 18,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function VendorProductsDialog({ vendor, open, onOpenChange }: VendorProductsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = vendorProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
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

  const handleExport = () => {
    // Format the data for export
    const exportData = filteredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      status: product.status,
      price: product.price,
      stock: product.stock,
    }))

    // Download as CSV
    downloadCSV(exportData, `${vendor.name.replace(/\s+/g, "-")}-products-export`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={vendor.logo} alt={vendor.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {vendor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>{vendor.name} Products</DialogTitle>
                <DialogDescription>Viewing all products from {vendor.id}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

