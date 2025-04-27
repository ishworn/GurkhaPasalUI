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
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, MoreHorizontal, Search, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { downloadCSV } from "@/lib/export-utils"

interface OrderApproval {
  id: string
  orderNumber: string
  vendorName: string
  vendorId: string
  requestDate: string
  amount: string
  reason: string
  status: "pending" | "approved" | "rejected"
  vendorLogo?: string
}

const approvalRequests: OrderApproval[] = [
  {
    id: "APR-001",
    orderNumber: "ORD-8752",
    vendorName: "Tech Innovations Inc.",
    vendorId: "VEN-001",
    requestDate: "2023-05-12",
    amount: "$1,245.89",
    reason: "Price increase due to component shortage",
    status: "pending",
    vendorLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APR-002",
    orderNumber: "ORD-9103",
    vendorName: "Global Gadgets Co.",
    vendorId: "VEN-002",
    requestDate: "2023-05-10",
    amount: "$876.50",
    reason: "Additional shipping costs",
    status: "pending",
    vendorLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APR-003",
    orderNumber: "ORD-8945",
    vendorName: "Premium Accessories Ltd.",
    vendorId: "VEN-003",
    requestDate: "2023-05-08",
    amount: "$432.75",
    reason: "Quantity adjustment",
    status: "approved",
    vendorLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APR-004",
    orderNumber: "ORD-9021",
    vendorName: "Smart Solutions Group",
    vendorId: "VEN-004",
    requestDate: "2023-05-05",
    amount: "$1,890.25",
    reason: "Special order customization",
    status: "rejected",
    vendorLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APR-005",
    orderNumber: "ORD-9156",
    vendorName: "Elite Electronics",
    vendorId: "VEN-005",
    requestDate: "2023-05-03",
    amount: "$567.30",
    reason: "Expedited production request",
    status: "pending",
    vendorLogo: "/placeholder.svg?height=40&width=40",
  },
]

export function OrderApprovalTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const filteredRequests = approvalRequests.filter(
    (request) =>
      (request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || request.status === statusFilter),
  )

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const handleApprove = (id: string) => {
    console.log(`Approving request ${id}`)
    // In a real application, you would update the status in your database
  }

  const handleReject = (id: string) => {
    console.log(`Rejecting request ${id}`)
    // In a real application, you would update the status in your database
  }

  const handleExport = () => {
    // Format the data for export
    const exportData = approvalRequests.map((request) => ({
      id: request.id,
      orderNumber: request.orderNumber,
      vendorName: request.vendorName,
      vendorId: request.vendorId,
      requestDate: request.requestDate,
      amount: request.amount,
      reason: request.reason,
      status: request.status,
    }))

    // Download as CSV
    downloadCSV(exportData, "approval-requests-export")
  }

  return (
    <Card className="border-t-4 border-t-primary/70">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Orders Requested for Approval</CardTitle>
            <CardDescription>Review and approve order change requests from vendors</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Vendor</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead className="hidden md:table-cell">Request Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.vendorLogo} alt={request.vendorName} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {request.vendorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium truncate max-w-[120px]">{request.vendorName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.orderNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{request.requestDate}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="truncate max-w-[150px] block">{request.reason}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Contact vendor</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Contact vendor</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No approval requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length} requests
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
        )}
      </CardContent>
    </Card>
  )
}

