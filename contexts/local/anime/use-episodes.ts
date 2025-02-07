"use client"

import { useContext } from "react"

import { AnimeContext } from "./anime-context"

function useEpisodes() {
  const context = useContext(AnimeContext)

  if (!context) {
    throw new Error("useEpisodes must be used within EpisodesProvider")
  }

  return context.episode
}

export { useEpisodes }
