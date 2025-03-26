"use client"

import { ReactNode, useCallback, useEffect, useState } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { FansubService } from "@/services/client/fansub.service"

import { Anime, Episode, UserList } from "@/types/anime"
import { Subtitles, Translation } from "@/types/fansub"
import { ItemPage, ItemPageFilters } from "@/types/page"

import { AnimeContext } from "./anime-context"

const animeService = new AnimeService()
const fansubService = new FansubService()

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
  const [episodes, setEpisodes] = useState({
    episodes: initEpisodes,
    loading: false,
    controller: new AbortController(),
  })
  const [subtitles, setSubtitles] = useState<{
    subtitles: Subtitles[]
    loading: boolean
  }>({ subtitles: [], loading: false })
  const [anime] = useState(initAnime)

  const loadEpisodes = useCallback(
    (filters: ItemPageFilters<Episode>, groupName?: string) => {
      episodes.controller.abort()
      const controller = new AbortController()
      setEpisodes((s) => ({
        ...s,
        loading: true,
        controller: controller,
      }))

      animeService
        .getEpisodes(anime.id, filters, {
          signal: controller.signal,
        })
        .then(({ data }) =>
          setEpisodes((s) => ({ ...s, episodes: data, loading: false }))
        )

      if (!groupName) return

      setSubtitles((s) => ({
        ...s,
        loading: true,
      }))

      fansubService
        .getSubtitles(
          groupName,
          anime.id,
          filters as ItemPageFilters<Subtitles>,
          {
            signal: controller.signal,
          }
        )
        .then(({ data }) =>
          setSubtitles({ subtitles: data.content, loading: false })
        )
    },
    [anime, setEpisodes]
  )

  useEffect(
    () => () => {
      episodes.controller.abort()
    },
    []
  )

  return (
    <AnimeContext.Provider
      value={{
        anime,
        episode: {
          ...episodes,
          ...subtitles,
          loading: episodes.loading || subtitles.loading,
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
