"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Mail, Phone, Globe, MapPin, Package } from "lucide-react"

interface VendorDetailProps {
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
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    website?: string
    description?: string
  }
}

export function VendorDetail({ vendor }: VendorDetailProps) {
  const getStatusColor = (status: "active" | "inactive" | "pending") => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={vendor.logo} alt={vendor.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {vendor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{vendor.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
              </div>
              <CardDescription>Vendor ID: {vendor.id}</CardDescription>
            </div>
          </div>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Vendor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.phone}</span>
                  </div>
                  {vendor.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {vendor.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {[vendor.address, vendor.city, vendor.state, vendor.zipCode, vendor.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vendor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span className="font-medium">{vendor.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date Added:</span>
                    <span className="font-medium">{vendor.dateAdded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Products:</span>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium">{vendor.productsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {vendor.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{vendor.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="products">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No products available for this vendor yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No orders available for this vendor yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No documents available for this vendor yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

