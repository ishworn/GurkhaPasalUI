import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { SettingsForm } from "@/components/admin/Settings/settings-form"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your store settings" />
      <SettingsForm />
    </DashboardShell>
  )
}

