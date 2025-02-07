"use client"

import { ReactNode, useCallback, useState } from "react"
import { AnimeService } from "@/services/client/anime.service"

import { Anime, Episode, UserList } from "@/types/anime"
import { Translation } from "@/types/fansub"
import { ItemPage, ItemPageFilters } from "@/types/page"

import { AnimeContext } from "./anime-context"

const animeService = new AnimeService()

interface AnimeProviderProps {
  children: ReactNode
  anime: Anime
  episodes: ItemPage<Episode>
  translations: Translation[]
  userList: UserList
}

function AnimeProvider({
  children,
  anime: initAnime,
  episodes: initEpisodes,
  translations: initTranslations,
  userList: initUserList,
}: AnimeProviderProps) {
  const [translations] = useState(initTranslations)
  const [userList, setUserList] = useState(initUserList)
  const [episodes, setEpisodes] = useState(initEpisodes)
  const [anime] = useState(initAnime)

  const loadEpisodes = useCallback(
    (filters: ItemPageFilters<Episode>) =>
      animeService
        .getEpisodes(anime.id, filters)
        .then(({ data }) => setEpisodes(data)),
    [anime, setEpisodes]
  )

  return (
    <AnimeContext.Provider
      value={{
        anime,
        episode: {
          episodes,
          loadEpisodes,
        },
        userList: { userList, setUserList },
        translations,
      }}
    >
      {children}
    </AnimeContext.Provider>
  )
}

export { AnimeProvider }
