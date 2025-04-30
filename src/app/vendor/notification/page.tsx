import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { NotificationsManager } from "@/components/admin/Notification/notifications-manager"
export default function NotificationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Notifications" text="Manage user notifications" />
      <NotificationsManager />
    </DashboardShell>
  )
}

