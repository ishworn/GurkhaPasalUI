import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell";
import { CustomersTable } from "@/components/admin/Customer/customers-table";

export default function page() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="Manage your customer accounts" />
      <CustomersTable />
    </DashboardShell>
  )
}

