"use client"

import { createContext, Dispatch, SetStateAction } from "react"

import { Anime, Episode, UserList } from "@/types/anime"
import { Translation } from "@/types/fansub"
import { ItemPage, ItemPageFilters } from "@/types/page"

interface AnimeContext {
  anime: Anime
  episode: {
    episodes: ItemPage<Episode>
    loadEpisodes: (filters: ItemPageFilters<Episode>) => void
  }
  userList: {
    userList: UserList
    setUserList: Dispatch<SetStateAction<UserList>>
  }
  translations: Translation[]
}

const AnimeContext = createContext<AnimeContext | null>(null)

export { AnimeContext }
