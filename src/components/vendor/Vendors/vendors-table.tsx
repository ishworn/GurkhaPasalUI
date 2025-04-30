"use client"

import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TableWrapper } from "./TableWrapper";
import { VendorFormDialog } from "./VendorFormDialog";
import { DeleteVendorDialog } from "./DeleteVendorDialog";
import { VendorActionMenu } from "./VendorActionMenu";
import { useVendorStore } from "./stores/vendorStore";
import { Vendor } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function VendorsTable() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  
  const vendors = useVendorStore(state => state.vendors);
  const updateVendor = useVendorStore(state => state.updateVendor);
  const addVendor = useVendorStore(state => state.addVendor);
  const removeVendor = useVendorStore(state => state.removeVendor);
  const toggleVendorStatus = useVendorStore(state => state.toggleVendorStatus);
  
  const itemsPerPage = 5;

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Vendor["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleCreateVendor = () => {
    setEditingVendor(null);
    setDialogOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setDialogOpen(true);
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setDeletingVendor(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingVendor) {
      removeVendor(deletingVendor.id);
      toast({
        title: "Vendor deleted",
        description: "The vendor has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleVendorStatus = (id: string) => {
    toggleVendorStatus(id);
    const vendor = vendors.find(v => v.id === id);
    toast({
      title: vendor?.status === "active" ? "Vendor activated" : "Vendor deactivated",
      description: `The vendor has been ${vendor?.status === "active" ? "activated" : "deactivated"}.`,
    });
  };

  const handleSaveVendor = (vendor: Vendor) => {
    if (editingVendor) {
      updateVendor(vendor);
      toast({
        title: "Vendor updated",
        description: "The vendor has been successfully updated.",
      });
    } else {
      addVendor(vendor);
      toast({
        title: "Vendor created",
        description: "The vendor has been successfully created.",
      });
    }
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage vendors and their access to your store</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateVendor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full sm:w-[300px]"
          />
        </div>
        
        <TableWrapper>
          {paginatedVendors.map((vendor) => (
            <div key={vendor.id} className="flex flex-col border-b p-4 last:border-0 md:hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                </div>
                <VendorActionMenu 
                  vendor={vendor}
                  onEdit={() => handleEditVendor(vendor)}
                  onDelete={() => handleDeleteVendor(vendor)}
                  onToggleStatus={() => handleToggleVendorStatus(vendor.id)}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
                <span className="text-sm">{vendor.commissionRate}%</span>
              </div>
              <div className="text-sm">
                <p>Contact: {vendor.contactPerson}</p>
                <p>Phone: {vendor.phone}</p>
                <p>Joined: {vendor.joinDate}</p>
              </div>
            </div>
          ))}
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Vendor</th>
                  <th className="py-3 px-4 text-left font-medium">Contact</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Commission</th>
                  <th className="py-3 px-4 text-left font-medium">Join Date</th>
                  <th className="py-3 px-4 text-right w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div>{vendor.contactPerson}</div>
                        <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{vendor.commissionRate}%</td>
                    <td className="py-3 px-4">{vendor.joinDate}</td>
                    <td className="py-3 px-4 text-right">
                      <VendorActionMenu 
                        vendor={vendor}
                        onEdit={() => handleEditVendor(vendor)}
                        onDelete={() => handleDeleteVendor(vendor)}
                        onToggleStatus={() => handleToggleVendorStatus(vendor.id)}
                      />
                    </td>
                  </tr>
                ))}
                {paginatedVendors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                      No vendors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredVendors.length > 0 ? Math.min(filteredVendors.length, 1 + startIndex) : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
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
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <VendorFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />

      <DeleteVendorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        vendor={deletingVendor}
        onDelete={confirmDelete}
      />
    </Card>
  );
}