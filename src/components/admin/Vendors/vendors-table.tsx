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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VendorDialog } from "./vendors-dialogue"
import { OrderApprovalTable } from "./order-approval-table"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { ContactVendorDialog } from "./contact-vendor-dialog"
import { VendorProductsDialog } from "./vendor-products-dialog"
import { downloadCSV } from "@/lib/export-utils"

type VendorStatus = "active" | "inactive" | "pending"

interface Vendor {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  status: VendorStatus
  productsCount: number
  dateAdded: string
  logo?: string
}

const vendors: Vendor[] = [
  {
    id: "VEN-001",
    name: "Tech Innovations Inc.",
    contactPerson: "Sarah Johnson",
    email: "sarah@techinnovations.com",
    phone: "(555) 123-4567",
    status: "active",
    productsCount: 24,
    dateAdded: "2023-01-15",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-002",
    name: "Global Gadgets Co.",
    contactPerson: "Michael Chen",
    email: "michael@globalgadgets.com",
    phone: "(555) 234-5678",
    status: "active",
    productsCount: 18,
    dateAdded: "2023-02-03",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-003",
    name: "Premium Accessories Ltd.",
    contactPerson: "Jessica Williams",
    email: "jessica@premiumacc.com",
    phone: "(555) 345-6789",
    status: "inactive",
    productsCount: 12,
    dateAdded: "2023-02-20",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-004",
    name: "Smart Solutions Group",
    contactPerson: "David Miller",
    email: "david@smartsolutions.com",
    phone: "(555) 456-7890",
    status: "active",
    productsCount: 31,
    dateAdded: "2023-03-05",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-005",
    name: "Elite Electronics",
    contactPerson: "Amanda Taylor",
    email: "amanda@eliteelectronics.com",
    phone: "(555) 567-8901",
    status: "pending",
    productsCount: 8,
    dateAdded: "2023-03-22",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-006",
    name: "Digital Dynamics",
    contactPerson: "Robert Wilson",
    email: "robert@digitaldynamics.com",
    phone: "(555) 678-9012",
    status: "active",
    productsCount: 15,
    dateAdded: "2023-04-10",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "VEN-007",
    name: "Innovative Imports",
    contactPerson: "Emily Davis",
    email: "emily@innovativeimports.com",
    phone: "(555) 789-0123",
    status: "inactive",
    productsCount: 6,
    dateAdded: "2023-04-28",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

export function VendorsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null)
  const itemsPerPage = 5

  const filteredVendors = vendors.filter(
    (vendor) =>
      (vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || vendor.status === statusFilter),
  )

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: VendorStatus) => {
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

  const handleAddVendor = () => {
    setCurrentVendor(null)
    setIsDialogOpen(true)
  }

  const handleEditVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor)
    setIsDialogOpen(true)
  }

  const handleViewProducts = (vendor: Vendor) => {
    setCurrentVendor(vendor)
    setIsProductsDialogOpen(true)
  }

  const handleContactVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor)
    setIsContactDialogOpen(true)
  }

  const handleDeleteVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor)
    setIsDeleteDialogOpen(true)
  }

  const handleExport = () => {
    // Format the data for export
    const exportData = vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      status: vendor.status,
      productsCount: vendor.productsCount,
      dateAdded: vendor.dateAdded,
    }))

    // Download as CSV
    downloadCSV(exportData, "vendors-export")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>Manage your product suppliers and partners</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleAddVendor}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full sm:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Vendor</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Products</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={vendor.logo} alt={vendor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {vendor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{vendor.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell className="hidden md:table-cell">{vendor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{vendor.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{vendor.productsCount}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditVendor(vendor)}>Edit vendor</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewProducts(vendor)}>View products</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactVendor(vendor)}>
                            Contact vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteVendor(vendor)} className="text-red-600">
                            Delete vendor
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVendors.length)} of{" "}
              {filteredVendors.length} vendors
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

      <div className="mt-6">
        <OrderApprovalTable />
      </div>

      {/* Vendor Dialog */}
      <VendorDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} vendor={currentVendor} />

      {/* View Products Dialog */}
      {currentVendor && (
        <VendorProductsDialog
          vendor={currentVendor}
          open={isProductsDialogOpen}
          onOpenChange={setIsProductsDialogOpen}
        />
      )}

      {/* Contact Vendor Dialog */}
      {currentVendor && (
        <ContactVendorDialog vendor={currentVendor} open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
      )}

      {/* Delete Vendor Dialog */}
      {currentVendor && (
        <DeleteConfirmationDialog
          title="Delete Vendor"
          description={`Are you sure you want to delete ${currentVendor.name}? This action cannot be undone.`}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => {
            console.log(`Deleting vendor: ${currentVendor.id}`)
            setIsDeleteDialogOpen(false)
          }}
        />
      )}
    </>
  )
}

