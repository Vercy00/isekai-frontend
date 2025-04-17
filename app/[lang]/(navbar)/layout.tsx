"use server"

import React from "react"
import { cookies } from "next/headers"

import { Notification } from "@/types/notification"
import { mainConfig } from "@/config/main"
import { NotificationProvider } from "@/lib/notification-lib"
import { MainNav } from "@/components/layout/main-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { UserButton } from "@/components/user-button"

interface NavbarLayoutProps {
  children: React.ReactNode
}

export default async function NavbarLayout({ children }: NavbarLayoutProps) {
  const cookie = await cookies()
  const notifications: Notification[] = []

  if (cookie.has("SESSION")) {
    // TODO: notifications
  }

  return (
    <NotificationProvider initNotifications={notifications}>
      <div className="flex min-h-screen flex-col">
        <div className="bg-background z-30 w-full backdrop-blur-md">
          <header className="z-40 container max-w-full px-6">
            <div className="flex h-20 items-center justify-between py-6">
              <MainNav items={mainConfig.mainNav} />
              <div>
                <UserButton />
              </div>
            </div>
          </header>
        </div>
        <main>{children}</main>
        <SiteFooter />
      </div>
    </NotificationProvider>
  )
}
