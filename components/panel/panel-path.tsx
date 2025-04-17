"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"

import { panelSite } from "@/config/panel-site"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

function PanelPath() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const currentPath = useMemo(() => {
    return Object.values(panelSite)
      .flat()
      .filter((item) => pathname.includes(item.url))
      .map((item) => [
        item,
        item.items?.filter((item) => pathname.includes(item.url))[0],
      ])[0]
      .filter((item) => item !== undefined)
  }, [pathname])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentPath.flatMap((item, i) => [
          !!i && <BreadcrumbSeparator className="hidden md:block" key={i} />,
          <BreadcrumbItem key={item.title}>
            {/* {item.url ? (
              <BreadcrumbLink href={item.url}>
                {t(`panel.${item.title}`)}
              </BreadcrumbLink>
            ) : ( */}
            <BreadcrumbPage>{t(`panel.${item.title}`)}</BreadcrumbPage>
            {/* )} */}
          </BreadcrumbItem>,
        ])}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { PanelPath }
