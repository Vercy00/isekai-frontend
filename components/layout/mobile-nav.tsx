import * as React from "react"
import Link from "next/link"
import { MainNavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  closeNav: () => void
}

export function MobileNav({ items, children, closeNav }: MobileNavProps) {
  useLockBody()

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-30 grid h-[calc(100lvh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md backdrop-blur md:hidden"
      )}
    >
      <div className="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md border p-4 shadow-md">
        <Link
          href="/"
          onClick={closeNav}
          className="flex items-center space-x-2"
        >
          <Icons.logo />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={closeNav}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
