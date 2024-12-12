import type { Metadata } from "next"
import { Inter, Lexend } from "next/font/google"

import "@/styles/globals.css"

import { cookies } from "next/headers"
import { ServerUserService } from "@/services/server/server-user.service"
import { IUserState } from "@/store/user-slice"
import { GoogleAnalytics } from "@next/third-parties/google"

import { siteConfig } from "@/config/site"
import StoreProvider from "@/lib/store-provider"
import { SubtitleSocketProvider } from "@/lib/subtitle-lib"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import { CookieBanner } from "@/components/cookie-banner"

const inter = Inter({ subsets: ["latin"] })
const lexend = Lexend({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: "Baza anime oraz napisów",
}

const userService = new ServerUserService()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = await cookies()
  let initUserStore: IUserState | undefined = undefined

  if (cookie.has("SESSION")) {
    const user = await userService.getCurrentUser()

    initUserStore = {
      isAuthorized: true,
      user,
    } as IUserState
  }

  return (
    <StoreProvider initState={initUserStore}>
      <html lang="pl">
        <head />
        <body
          className="min-h-screen bg-background font-sans antialiased"
          style={{
            fontFamily: `${lexend.style.fontFamily}, ${inter.style.fontFamily}`,
          }}
        >
          <SubtitleSocketProvider>
            <div className="h-screen">{children}</div>
          </SubtitleSocketProvider>
          <Toaster richColors />
          <CookieBanner />
        </body>
      </html>
      <GoogleAnalytics gaId="G-VS8HDZG153" />
    </StoreProvider>
  )
}

export const dynamic = "force-dynamic"
