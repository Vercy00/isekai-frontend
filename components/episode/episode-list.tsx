import {
  ActionDispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAnime, useEpisodes, useTranslations } from "@/contexts/local/anime"
import { PageEpisodeDto } from "@/gen/anime"
import { CircularProgress } from "@mui/material"
import { useDebounce } from "@uidotdev/usehooks"
import { Share2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SortDirection } from "@/types/page"

// import { SubtitlesDownload, SubtitlesForm } from "../subtitles"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { EpisodeCard } from "./episode-card"

enum FiltersActionKind {
  PAGE,
  SORT,
}

interface FiltersAction {
  type: FiltersActionKind
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

interface Filters {
  sortDir: SortDirection
  page: number
}

function filtersReducer(state: Filters, action: FiltersAction): Filters {
  const { type, payload } = action

  switch (type) {
    case FiltersActionKind.PAGE:
      return {
        ...state,
        page: payload,
      }
    case FiltersActionKind.SORT:
      return {
        ...state,
        sortDir: payload,
      }
    default:
      return state
  }
}

type QueryParam = { name: string; value: string }

function EpisodeList() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedEpisodes, setSelectedEpisodes] = useState<number[]>([])
  const [groupName, setGroupName] = useState("")
  const [filters, filtersDispatch] = useReducer(filtersReducer, {
    sortDir: (searchParams.get("episodeSortDir") || "ASC") as SortDirection,
    page: parseInt(searchParams.get("episodePage") || "0"),
  })
  const debouncedFilters = useDebounce(filters, 200)
  const translations = useTranslations()
  const { episodes, loadEpisodes, loading, subtitles } = useEpisodes()
  const { t } = useTranslation()
  const anime = useAnime()

  const switchEpisode = useCallback(
    (episodeNum: number) => {
      if (selectedEpisodes.includes(episodeNum)) {
        setSelectedEpisodes((episodes) =>
          episodes.filter((ep) => ep != episodeNum)
        )
      } else {
        setSelectedEpisodes((episodes) => [...episodes, episodeNum])
      }
    },
    [selectedEpisodes]
  )

  const generateGroupUrl = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("group", groupName)

    navigator.clipboard.writeText(url.toString())
  }, [])

  const createQueryString = useCallback(
    (queries: QueryParam[]) => {
      const params = new URLSearchParams(searchParams.toString())

      queries.forEach(({ name, value }) => params.set(name, value))

      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    if (
      (searchParams.get("episodeSortDir") || "ASC") ===
        debouncedFilters.sortDir &&
      (searchParams.get("episodePage") || "0") ===
        debouncedFilters.page.toString()
    ) {
      return
    }

    const url =
      pathname +
      "?" +
      createQueryString([
        { name: "episodeSortDir", value: debouncedFilters.sortDir },
        { name: "episodePage", value: debouncedFilters.page.toString() },
      ]) +
      "#episodes"

    window.history.pushState(null, "", url)

    loadEpisodes({
      page: debouncedFilters.page,
      size: 12,
      sort: [`episodeNum,${debouncedFilters.sortDir}`],
    })
  }, [debouncedFilters])

  useEffect(() => {
    if (!groupName) return

    loadEpisodes(
      {
        page: debouncedFilters.page,
        size: 12,
        sort: [`episodeNum,${debouncedFilters.sortDir}`],
      },
      groupName
    )
  }, [groupName])

  return (
    <div id="episodes" className="relative grid w-full gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Select onValueChange={setGroupName} value={groupName}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Wybierz grupę" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Wybierz grupę</SelectLabel>
                {translations.map(({ group }) => (
                  <SelectItem value={group.name} key={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {groupName && (
            <>
              {/* <SubtitlesDownload
                selectedEpisodes={selectedEpisodes}
                groupName={groupName}
                animeId={anime.id}
              /> */}

              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={generateGroupUrl}
                            className="aspect-square p-0"
                          >
                            <Share2 />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>Skopiuj link do napisów</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-fit">Skopiowano!</PopoverContent>
              </Popover>
            </>
          )}

          {/* {translations.some(
            ({ authors, group }) =>
              authors.some((author) => author.member.id === user?.id) ||
              group.admins.some(({ id }) => id === user?.id)
          ) && (
            <SubtitlesForm
              episodesCount={anime.episodesCount!}
              translations={translations}
              animeId={anime.id!}
            />
          )} */}
        </div>

        <Select
          onValueChange={(val) =>
            filtersDispatch({ type: FiltersActionKind.SORT, payload: val })
          }
          value={filters.sortDir}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sortuj wg" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sortuj wg</SelectLabel>
              <SelectItem value="ASC">Odcinek rosnąco</SelectItem>
              <SelectItem value="DESC">Odcinek malejąco</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {!!groupName && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-3">Autorzy</h3>
          <div className="flex flex-col gap-2">
            {translations
              .filter((t) => t.group.name == groupName)[0]
              .authors.map((author) => (
                <div className="flex items-center gap-3" key={author.member.id}>
                  <Avatar>
                    <AvatarImage src={author.member.avatarUrl} />
                    <AvatarFallback>
                      {author.member.displayName.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{author.member.displayName}</span>
                  {author.roles.length > 0 && (
                    <>
                      <span>-</span>
                      <span>
                        {author.roles.map((role) => t(role)).join(", ")}
                      </span>
                    </>
                  )}
                </div>
              ))}
            {translations
              .filter((t) => t.group.name == groupName)[0]
              .fakeAuthors.map((author) => (
                <div className="flex items-center gap-3" key={author.member.id}>
                  <Avatar>
                    <AvatarImage src="https://api.isekai.pl/v1/storage/avatars/1ca962ee-0fc0-409a-9924-20a019a23f41/672cc8a4184d425d16032ced" />
                    <AvatarFallback>
                      {author.member.displayName.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{author.member.displayName}</span>
                  {author.roles.length > 0 && (
                    <>
                      <span>-</span>
                      <span>
                        {author.roles.map((role) => t(role)).join(", ")}
                      </span>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {episodes.content.map((episode, i) => (
          <EpisodeCard
            key={i}
            subtitle={subtitles.find(
              (subtitle) => subtitle.episodeNum === episode.episodeNum
            )}
            onClick={switchEpisode}
            anySubtitles={groupName == "" && translations.length > 0}
            selected={selectedEpisodes.includes(episode.episodeNum)}
            animeId={anime.id!}
            groupName={groupName}
            {...episode}
          />
        ))}
      </div>

      <EpisodePagination
        episodes={episodes}
        filtersDispatch={filtersDispatch}
      />

      {loading && (
        <div className="absolute -top-1 -left-1 flex h-[calc(100%+8px)] w-[calc(100%+8px)] items-center justify-center rounded-lg bg-black/80">
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

interface EpisodePaginationProps {
  episodes: PageEpisodeDto
  filtersDispatch: ActionDispatch<[action: FiltersAction]>
}

function EpisodePagination({
  episodes,
  filtersDispatch,
}: EpisodePaginationProps) {
  const pages = useMemo(() => {
    const set = new Set<number>()

    set.add(0)
    set.add(episodes.totalPages - 1)

    for (let i = -1; i < Math.min(episodes.totalPages, 2); i++) {
      set.add(
        Math.max(Math.min(episodes.number + i, episodes.totalPages - 1), 0)
      )
    }

    return [...set].sort((a, b) => a - b)
  }, [episodes])

  return (
    <Pagination>
      <PaginationContent>
        {episodes.number > 0 && (
          <PaginationItem>
            <PaginationPrevious
              href="#episodes"
              onClick={() =>
                filtersDispatch({
                  type: FiltersActionKind.PAGE,
                  payload: episodes.number - 1,
                })
              }
            />
          </PaginationItem>
        )}

        {pages.reduce<ReactNode[]>((acc, curr, i) => {
          acc.push(
            <PaginationItem key={curr}>
              <PaginationLink
                href="#episodes"
                isActive={curr === episodes.number}
                onClick={() =>
                  filtersDispatch({
                    type: FiltersActionKind.PAGE,
                    payload: curr,
                  })
                }
              >
                {curr + 1}
              </PaginationLink>
            </PaginationItem>
          )

          if (Math.abs(pages[i] - pages[i + 1]) > 1) {
            acc.push(
              <PaginationItem key={curr + 99999}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return acc
        }, [])}

        {episodes.number + 1 < episodes.totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#episodes"
              onClick={() =>
                filtersDispatch({
                  type: FiltersActionKind.PAGE,
                  payload: episodes.number + 1,
                })
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export { EpisodeList }
