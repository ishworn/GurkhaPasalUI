import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { VendorsTable } from "@/components/admin/Vendors/vendors-table"

export default function VendorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Vendor Management" text="Manage your store vendors and their access" />
      <VendorsTable />
    </DashboardShell>
  )
}