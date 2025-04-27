import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { VendorsTable } from "@/components/admin/Vendors/vendors-table"

export default function VendorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Vendors" text="Manage your product suppliers and partners" />
      <VendorsTable />
    </DashboardShell>
  )
}

