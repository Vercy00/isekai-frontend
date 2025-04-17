"use client"

import { createContext, Dispatch, SetStateAction } from "react"
import { AnimeDto, AnimeListStatusDto, PageEpisodeDto } from "@/gen/anime"
import { SubtitleDto, TranslationDto } from "@/gen/fansub"

import { Episode } from "@/types/anime"
import { ItemPageFilters } from "@/types/page"

interface AnimeContext {
  anime: AnimeDto
  episode: {
    episodes: PageEpisodeDto
    loadEpisodes: (
      filters: ItemPageFilters<Episode>,
      groupName?: string
    ) => void
    loading: boolean
    subtitles: SubtitleDto[]
  }
  userList: {
    userList: AnimeListStatusDto
    setUserList: Dispatch<SetStateAction<AnimeListStatusDto>>
  }
  translations: TranslationDto[]
}

const AnimeContext = createContext<AnimeContext | null>(null)

export { AnimeContext }
