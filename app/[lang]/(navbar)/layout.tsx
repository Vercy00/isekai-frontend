"use server"

import React from "react"
import { cookies } from "next/headers"
import { ServerNotificationService } from "@/services/server/server-notification.service"

import { Notification } from "@/types/notification"
import { mainConfig } from "@/config/main"
import { NotificationProvider } from "@/lib/notification-lib"
import { MainNav } from "@/components/layout/main-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { UserButton } from "@/components/user-button"

const notificationService = new ServerNotificationService()

interface NavbarLayoutProps {
  children: React.ReactNode
}

export default async function NavbarLayout({ children }: NavbarLayoutProps) {
  const cookie = await cookies()
  var notifications: Notification[] = []

  if (cookie.has("SESSION"))
    notifications = await notificationService.getNotifications()

  return (
    <NotificationProvider initNotifications={notifications}>
      <div className="flex min-h-screen flex-col">
        <div className="z-30 w-full bg-background backdrop-blur-md">
          <header className="container z-40 max-w-full px-6">
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
