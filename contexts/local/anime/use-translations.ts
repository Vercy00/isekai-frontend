"use client"

import { useContext } from "react"

import { AnimeContext } from "./anime-context"

function useTranslations() {
  const context = useContext(AnimeContext)

  if (!context) {
    throw new Error("useTranslations must be used within TranslationsProvider")
  }

  return context.translations
}

export { useTranslations }
