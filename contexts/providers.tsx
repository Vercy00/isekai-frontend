"use client"

import { ReactNode } from "react"
import { Resource } from "i18next"
import { SessionProvider } from "next-auth/react"

import { defaultNS } from "@/lib/i18n/settings"
import { IUserState } from "@/lib/store/user-slice"

import { StoreProvider } from "./global/store/store-provider"
import { SubtitleSocketProvider } from "./global/subtitles-subtitles"
import { TranslationsProvider } from "./global/translations/translations-provider"

interface ProvidersProps {
  children: ReactNode
  initUser?: IUserState
  locale: string
  resources: Resource
}

export function Providers({
  children,
  initUser,
  locale,
  resources,
}: ProvidersProps) {
  return (
    <TranslationsProvider
      namespaces={[defaultNS]}
      locale={locale}
      resources={resources}
    >
      <SessionProvider refetchInterval={4 * 60} basePath="/auth">
        <StoreProvider initUser={initUser}>
          <SubtitleSocketProvider>{children}</SubtitleSocketProvider>
        </StoreProvider>
      </SessionProvider>
    </TranslationsProvider>
  )
}
