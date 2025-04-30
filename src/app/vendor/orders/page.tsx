import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header";
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell";
import { OrdersTable } from "@/components/admin/Orders/orders-table";

export default function OrdersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Orders" text="Manage your customer orders" />
      <OrdersTable />
    </DashboardShell>
  )
}
