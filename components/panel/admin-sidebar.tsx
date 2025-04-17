"use client"

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { useTranslation } from "react-i18next"

import { panelSite } from "@/config/panel-site"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavUser } from "./nav-user"
import { CollapsibleItem } from "./panel-item"

export interface PanelItem {
  title: string
  url: string
  icon?: React.ReactElement
  isActive?: boolean
  isCollapsible?: boolean
  items?: {
    title: string
    url: string
  }[]
}

function AdminSidebar() {
  const { t } = useTranslation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Isekai Panel</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("panel.main")}</SidebarGroupLabel>
          <SidebarMenu>{panelSite.adminAnime.map(CollapsibleItem)}</SidebarMenu>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupLabel>{t("panel.page")}</SidebarGroupLabel>
          <SidebarMenu>{panelSite.navAnime.map(CollapsibleItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>{t("panel.links")}</SidebarGroupLabel>
          <SidebarMenu>{panelSite.navLink.map(RedirectItem)}</SidebarMenu>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { AdminSidebar }
