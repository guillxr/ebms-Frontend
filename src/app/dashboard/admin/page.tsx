"use client"
import { useState } from "react"

import { AppSidebarAdmin } from "@/components/app-sidebar/app-sidebar-admin"
import { SectionCards } from "@/components/section-cards/cards-agendamentos"
import { SectionStock } from "@/components/section-cards/cards-stock"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RefreshProvider } from "@/contexts/RefreshContext"

export default function AdminPage() {
  const [section, setSection] = useState<"stock" | "agendamentos">("stock")

  return (
    <RefreshProvider>
      <SidebarProvider>
        <AppSidebarAdmin onSectionChange={setSection} variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col flex-1">
            <div className="p-6">
              {section === "stock" && <SectionStock />}
              {section === "agendamentos" && <SectionCards />}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RefreshProvider>
  )
}
