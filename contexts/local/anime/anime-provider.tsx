"use client"

import { ReactNode, useCallback, useEffect, useState } from "react"
import {
  AnimeDto,
  AnimeListStatusDto,
  getEpisodesClient,
  PageEpisodeDto,
} from "@/gen/anime"
import { getSubtitlesClient, SubtitleDto, TranslationDto } from "@/gen/fansub"

import { Episode } from "@/types/anime"
import { ItemPageFilters } from "@/types/page"

import { AnimeContext } from "./anime-context"

interface AnimeProviderProps {
  children: ReactNode
  anime: AnimeDto
  episodes: PageEpisodeDto
  translations: TranslationDto[]
  userList: AnimeListStatusDto | null
}

const defaultUserList: AnimeListStatusDto = {
  score: {
    animation: 0,
    music: 0,
    plot: 0,
    characters: 0,
    mean: 0,
  },
  watchedEpisodes: 0,
  status: "WATCHING",
  favorite: false,
}

function AnimeProvider({
  children,
  anime: initAnime,
  episodes: initEpisodes,
  translations: initTranslations,
  userList: initUserList,
}: AnimeProviderProps) {
  const [translations] = useState(initTranslations)
  const [userList, setUserList] = useState<AnimeListStatusDto>(
    initUserList ?? defaultUserList
  )
  const [episodes, setEpisodes] = useState({
    episodes: initEpisodes,
    loading: false,
    controller: new AbortController(),
  })
  const [subtitles, setSubtitles] = useState<{
    subtitles: SubtitleDto[]
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

      getEpisodesClient(
        { animeId: anime.id },
        { ...filters },
        {
          signal: controller.signal,
        }
      ).then((data) =>
        setEpisodes((s) => ({ ...s, episodes: data, loading: false }))
      )

      if (!groupName) return

      setSubtitles((s) => ({
        ...s,
        loading: true,
      }))

      getSubtitlesClient(
        { groupName, animeId: anime.id },
        { ...filters },
        {
          signal: controller.signal,
        }
      ).then((data) =>
        setSubtitles({ subtitles: data.content, loading: false })
      )
    },
    [anime.id, episodes.controller]
  )

  useEffect(
    () => () => {
      episodes.controller.abort()
    },
    [episodes.controller]
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
