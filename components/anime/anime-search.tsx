"use client"

import React, { useCallback, useRef } from "react"
import {
  AnimeNodeDto,
  findAnimeClient,
  FindAnimeQueryParams,
  PageAnimeNodeDto,
} from "@/gen/anime"
import { useDebounce } from "@uidotdev/usehooks"
import InfiniteScroll from "react-infinite-scroll-component"

import { SimpleAnimeCard } from "@/components/anime/anime-card"

import AnimeSearchForm, { AnimeSearchFormProps } from "./anime-search-form"

interface AnimeSearchProps
  extends Omit<AnimeSearchFormProps, "onChange" | "filters"> {
  animeDefaultList: PageAnimeNodeDto
}

export function AnimeSearch({ animeDefaultList, ...props }: AnimeSearchProps) {
  const [lastPage, setLastPage] =
    React.useState<PageAnimeNodeDto>(animeDefaultList)
  const [animeList, setAnimeList] = React.useState<AnimeNodeDto[]>(
    animeDefaultList.content
  )
  const [filters, setFilters] = React.useState<FindAnimeQueryParams>({
    search: "",
    size: 0,
  })
  const debouncedFilters = useDebounce(filters, 200)
  const abortControllerRef = useRef<AbortController>(undefined)

  const loadNextPage = useCallback(() => {
    abortControllerRef.current?.abort("Operation canceled by the user.")
    abortControllerRef.current = new AbortController()

    findAnimeClient(
      { ...debouncedFilters, page: lastPage.number + 1 },
      { signal: abortControllerRef.current.signal }
    ).then((data) => {
      setLastPage(data)
      setAnimeList((list) => list.concat(data.content))
    })
  }, [debouncedFilters, lastPage.number])

  React.useEffect(() => {
    abortControllerRef.current?.abort("Operation canceled by the user.")
    abortControllerRef.current = new AbortController()
    const abortController = abortControllerRef.current

    findAnimeClient(debouncedFilters, {
      signal: abortControllerRef.current.signal,
    }).then((data) => {
      setLastPage(data)
      setAnimeList(data.content)
    })

    return () => abortController?.abort("Operation canceled by the user.")
  }, [debouncedFilters])

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
