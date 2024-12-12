"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

const URLS = [
  {
    href: "/panel",
    title: "Panel",
    disabled: false,
  },
  {
    href: "/panel/anime",
    title: "Anime",
    disabled: false,
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="w-1/5 shrink-0">
      <div className="flex justify-center">
        <Link href="/" className="hidden items-center space-x-2 p-4 md:flex">
          <Icons.logo />
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>
      </div>

      <Separator />

      <div>
        {URLS.map((item, index) => (
          <Link
            key={index}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "m-3 flex items-center rounded-md p-4 text-lg font-medium transition-colors hover:bg-muted hover:text-foreground/80 sm:text-sm",
              (item.href !== "/panel" && pathname.startsWith(item.href)) ||
                (item.href === "/panel" && item.href === pathname)
                ? "bg-muted text-foreground shadow-sm"
                : "text-foreground/60",
              item.disabled && "cursor-not-allowed opacity-80"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
