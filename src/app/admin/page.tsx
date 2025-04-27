import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header";
import { SalesOverview } from "@/components/admin/Dashboard/sales-overview";
import { RecentOrders } from "@/components/admin/Dashboard/recent-orders";
import { TopProducts } from "@/components/admin/Dashboard/top-products";
import { CustomerStats } from "@/components/admin/Dashboard/customer-stats";
import { NoticeSection } from "@/components/admin/Dashboard/notice-section";
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell";



export default function page() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your store's performance" />

      <NoticeSection />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesOverview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-2">
          <RecentOrders />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <TopProducts />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <CustomerStats />
        </div>
      </div>
    </DashboardShell>
  )
}

