import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"
import { PanelItem } from "./panel-sidebar"

function CollapsibleItem(item: PanelItem) {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={
        pathname.startsWith(item.url) ||
        (pathname === "/panel" && item.title === "user")
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

export { CollapsibleItem, RedirectItem }
