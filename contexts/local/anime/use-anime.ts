"use client"

import { useContext } from "react"

import { AnimeContext } from "./anime-context"

function useAnime() {
  const context = useContext(AnimeContext)

  if (!context) {
    throw new Error("useAnime must be used within AnimeProvider")
  }

  return context.anime
}

export { useAnime }
