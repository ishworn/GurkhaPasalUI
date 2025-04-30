import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { ProfileForm } from "@/components/admin/Profile/profile-form"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Profile" text="Manage your account information" />
      <ProfileForm />
    </DashboardShell>
  )
}

