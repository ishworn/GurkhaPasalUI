"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Package, Tag, BarChart, ShoppingCart, Clock, Truck } from "lucide-react"
import Image from "next/image"

interface ProductDetailsDialogProps {
  product: {
    id: string
    name: string
    category: string
    status: "in-stock" | "low-stock" | "out-of-stock"
    price: string
    stock: number
    image: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock product details
const productDetails = {
  description: "High-quality product with premium features. Perfect for everyday use.",
  sku: "SKU-12345",
  weight: "0.5 kg",
  dimensions: "10 x 5 x 2 cm",
  dateAdded: "2023-01-15",
  lastUpdated: "2023-04-10",
  vendor: "Tech Innovations Inc.",
  tags: ["electronics", "wireless", "premium"],
}

// Mock sales data
const salesData = [
  { month: "Jan", sales: 12 },
  { month: "Feb", sales: 15 },
  { month: "Mar", sales: 18 },
  { month: "Apr", sales: 14 },
  { month: "May", sales: 20 },
]

export function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
  const getStatusColor = (status: "in-stock" | "low-stock" | "out-of-stock") => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <DialogDescription>Product ID: {product.id}</DialogDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3">
                <div className="relative h-48 w-full overflow-hidden rounded-md border">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Category:</div>
                      <div className="text-sm">{product.category}</div>

                      <div className="text-sm font-medium">Price:</div>
                      <div className="text-sm">{product.price}</div>

                      <div className="text-sm font-medium">SKU:</div>
                      <div className="text-sm">{productDetails.sku}</div>

                      <div className="text-sm font-medium">Weight:</div>
                      <div className="text-sm">{productDetails.weight}</div>

                      <div className="text-sm font-medium">Dimensions:</div>
                      <div className="text-sm">{productDetails.dimensions}</div>

                      <div className="text-sm font-medium">Vendor:</div>
                      <div className="text-sm">{productDetails.vendor}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{productDetails.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {productDetails.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Package className="mr-2 h-4 w-4 text-primary" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center p-6 bg-primary/10 rounded-md">
                    <span className="text-4xl font-bold">{product.stock}</span>
                    <span className="text-sm text-muted-foreground">Units in Stock</span>
                    <Badge variant="outline" className={`mt-2 ${getStatusColor(product.status)}`}>
                      {product.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Low Stock Threshold:</span>
                      <span className="text-sm">10 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Reorder Point:</span>
                      <span className="text-sm">5 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Backorders:</span>
                      <span className="text-sm">Not allowed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-primary" />
                    Warehouse Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Main Warehouse</div>
                        <div className="text-xs text-muted-foreground">New York</div>
                      </div>
                      <Badge>{product.stock > 0 ? product.stock - 5 : 0} units</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">East Warehouse</div>
                        <div className="text-xs text-muted-foreground">Boston</div>
                      </div>
                      <Badge>3 units</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Store Front</div>
                        <div className="text-xs text-muted-foreground">Manhattan</div>
                      </div>
                      <Badge>2 units</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  Inventory History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Stock added: +10 units</div>
                      <div className="text-xs text-muted-foreground">2023-04-10 • Main Warehouse</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Stock removed: -5 units (Order #ORD-001)</div>
                      <div className="text-xs text-muted-foreground">2023-03-25 • Main Warehouse</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Initial stock added: +30 units</div>
                      <div className="text-xs text-muted-foreground">2023-01-15 • Main Warehouse</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-primary" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
                    {salesData.map((item) => (
                      <div key={item.month} className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-primary/80 rounded-t-md"
                          style={{ height: `${item.sales * 6}px` }}
                        ></div>
                        <span className="text-xs">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4 text-primary" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Order #ORD-001</div>
                        <div className="text-xs text-muted-foreground">2023-04-23</div>
                      </div>
                      <Badge variant="outline">1 unit</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Order #ORD-002</div>
                        <div className="text-xs text-muted-foreground">2023-04-20</div>
                      </div>
                      <Badge variant="outline">2 units</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Order #ORD-003</div>
                        <div className="text-xs text-muted-foreground">2023-04-18</div>
                      </div>
                      <Badge variant="outline">1 unit</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sales Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">79</span>
                    <span className="text-sm text-muted-foreground">Total Units Sold</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">$10,267</span>
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
                    <span className="text-2xl font-bold">4.8/5</span>
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

