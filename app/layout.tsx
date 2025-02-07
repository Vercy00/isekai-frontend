import { ReactNode } from "react"
import { Inter, Lexend } from "next/font/google"

import "@/styles/globals.css"

import { Metadata } from "next"
import { headers } from "next/headers"
import { Providers } from "@/contexts/providers"
import { UserService } from "@/services/client/user.service"
import { GoogleAnalytics } from "@next/third-parties/google"
import { dir } from "i18next"
import { getServerSession } from "next-auth"

import { siteConfig } from "@/config/site"
import { initTranslations } from "@/lib/i18n"
import { defaultNS } from "@/lib/i18n/settings"
import { IUserState } from "@/lib/store/user-slice"
import { Toaster } from "@/components/ui/sonner"
import { CookieBanner } from "@/components/layout"

import { authOptions } from "./auth/[...nextauth]/route"

const inter = Inter({ subsets: ["latin"] })
const lexend = Lexend({ subsets: ["latin"] })

const userService = new UserService()

type RootLayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: "Baza anime oraz napisów",
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers()
  const session = await getServerSession(authOptions)
  const lang = headersList.get("x-locale")!
  const { resources } = await initTranslations(lang, [defaultNS])
  let initUser: IUserState | undefined

  if (session) {
    const user = (await userService.getCurrentUser()).data

    initUser = {
      isAuthorized: true,
      user,
    }
  }

  // console.log(session)

  return (
    <html lang={lang} dir={dir(lang)} className="dark">
      <head />
      <body
        className="bg-background min-h-screen font-sans antialiased"
        style={{
          fontFamily: `${lexend.style.fontFamily}, ${inter.style.fontFamily}`,
        }}
      >
        <Providers initUser={initUser} locale={lang} resources={resources}>
          {children}
        </Providers>
        <Toaster richColors />
        <CookieBanner />
        <GoogleAnalytics gaId="G-VS8HDZG153" />
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
