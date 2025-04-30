import { DashboardHeader } from "@/components/admin/Dashboard/dashboard-header"
import { DashboardShell } from "@/components/admin/Dashboard/dashboard-shell"
import { HeroSliderManager } from "@/components/admin/CMS/hero-slider-manager"
import { PromotionalBanners } from "@/components/admin/CMS/promotional-banners"
import { PageContentManager } from "@/components/admin/CMS/page-content-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CMSPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Content Management" text="Manage your store's content" />

      <Tabs defaultValue="hero-slider" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero-slider">Hero Slider</TabsTrigger>
          <TabsTrigger value="banners">Promotional Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="hero-slider">
          <HeroSliderManager />
        </TabsContent>
        <TabsContent value="banners">
          <PromotionalBanners />
        </TabsContent>
        <TabsContent value="pages">
          <PageContentManager />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

