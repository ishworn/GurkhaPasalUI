import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell";
import { ProductsTable } from "@/components/admin/Products/product-table";

export default function ProductsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Products" text="Manage your product inventory" />
      <ProductsTable />
    </DashboardShell>
  )
}

