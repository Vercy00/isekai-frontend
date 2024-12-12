"use client"

import React, { useRef } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { useDebounce } from "@uidotdev/usehooks"
import axios, { CancelTokenSource } from "axios"
import InfiniteScroll from "react-infinite-scroll-component"

import { Anime, AnimeFilters } from "@/types/anime"
import { ItemPage } from "@/types/page"
import { SimpleAnimeCard } from "@/components/anime-card"

import AnimeSearchForm, { AnimeSearchFormProps } from "./anime-search-form"

const animeService = new AnimeService()

interface AnimeSearchProps
  extends Omit<AnimeSearchFormProps, "onChange" | "filters"> {
  animeDefaultList: ItemPage<Anime>
}

export function AnimeSearch({ animeDefaultList, ...props }: AnimeSearchProps) {
  const [lastPage, setLastPage] =
    React.useState<ItemPage<Anime>>(animeDefaultList)
  const [animeList, setAnimeList] = React.useState<Anime[]>(
    animeDefaultList.content
  )
  const [filters, setFilters] = React.useState<Partial<AnimeFilters>>({
    size: 36,
  })
  const debouncedFilters = useDebounce(filters, 200)
  const cancelTokenRef = useRef<CancelTokenSource>(undefined)

  React.useEffect(() => {
    cancelTokenRef.current?.cancel("Operation canceled by the user.")

    animeService
      .searchAnimeList(debouncedFilters)
      .then(({ data }) => setAnimeList(data.content))
  }, [debouncedFilters, setAnimeList])

  const loadNextPage = () => {
    cancelTokenRef.current = axios.CancelToken.source()

    animeService
      .searchAnimeList(
        { ...debouncedFilters, page: lastPage.pageable.pageNumber + 1 },
        {
          cancelToken: cancelTokenRef.current.token,
        }
      )
      .then(({ data }) => {
        setLastPage(data)
        setAnimeList((list) => list.concat(data.content))
      })
  }

  return (
    <>
      <AnimeSearchForm {...props} filters={filters} onChange={setFilters} />
      <InfiniteScroll
        dataLength={animeList.length}
        next={loadNextPage}
        hasMore={!lastPage.last}
        loader={
          <h4 className="absolute bottom-0 left-1/2 -translate-x-1/2">
            Wczytywanie...
          </h4>
        }
        className="relative mt-4 grid w-full grid-cols-[repeat(auto-fill,max(200px,_10%))] justify-between justify-items-center pb-10"
      >
        {animeList.map((anime, index) => (
          <SimpleAnimeCard
            anime={anime}
            key={index}
            className="scale-95 md:hover:scale-100"
          />
        ))}
      </InfiniteScroll>
    </>
  )
}
