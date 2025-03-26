"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import { ChevronRight, GalleryVerticalEnd } from "lucide-react"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavUser } from "./nav-user"

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

function PanelSidebar() {
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
          <SidebarMenu>{panelSite.navMain.map(CollapsibleItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("panel.page")}</SidebarGroupLabel>
          <SidebarMenu>{panelSite.navAnime.map(CollapsibleItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>{t("panel.links")}</SidebarGroupLabel>
          <SidebarMenu>{panelSite.navLink.map(RedirectItem)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function CollapsibleItem(item: PanelItem) {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={
        pathname.startsWith(item.url) ||
        (pathname === "/panel" && item.title === "user_settings")
      }
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && item.icon}
            <span>{t(`panel.${item.title}`)}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname.startsWith(subItem.url)}
                >
                  <Link href={subItem.url}>
                    <span>{t(`panel.${subItem.title}`)}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function RedirectItem(item: PanelItem) {
  const { t } = useTranslation()

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton tooltip={item.title} asChild>
        <a href={item.url}>
          {item.icon && item.icon}
          <span>{t(`panel.${item.title}`)}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export { PanelSidebar }
