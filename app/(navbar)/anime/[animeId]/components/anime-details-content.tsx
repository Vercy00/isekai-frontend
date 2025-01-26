"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { FansubService } from "@/services/client/fansub.service"
import { useAppSelector } from "@/store/root-store"
import { TRANSLATION } from "@/translations/pl-pl"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Dot, Ellipsis, Share2 } from "lucide-react"

import { Anime, AnimeScore, Episode, UserList } from "@/types/anime"
import { Subtitle, Translation } from "@/types/fansub"
import { ItemPage } from "@/types/page"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SimpleAnimeCard } from "@/components/anime"
import { AnimeListForm } from "@/components/anime/anime-list-form"
import { AnimeThumbnail } from "@/components/anime/anime-thumbnail"
import { EpisodeCard } from "@/components/episode/episode-card"
import { ScoreForm } from "@/components/score/score-form"
import { SubtitlesDownload, SubtitlesForm } from "@/components/subtitles"

const fansubService = new FansubService()

interface AnimeDetailsContentProps {
  anime: Anime
  episodes: ItemPage<Episode>
  initUserList?: UserList
  viewport: string
  translations: Translation[]
}

export function AnimeDetailsContent({
  anime,
  episodes,
  initUserList,
  viewport,
  translations,
}: AnimeDetailsContentProps) {
  const user = useAppSelector((state) => state.userStore.user)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedEpisodes, setSelectedEpisodes] = React.useState<number[]>([])
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [groupName, setGroupName] = useState("")
  const [userList, setUserList] = useState(initUserList)
  const searchParams = useSearchParams()
  const [sort, setSort] = useState("asc")

  const switchEpisode = (episodeNum: number) => {
    if (selectedEpisodes.includes(episodeNum))
      setSelectedEpisodes((episodes) =>
        episodes.filter((ep) => ep != episodeNum)
      )
    else setSelectedEpisodes((episodes) => [...episodes, episodeNum])
  }

  const downloadMagnets = () => {
    const subs =
      selectedEpisodes.length > 0
        ? subtitles.filter((sub) => selectedEpisodes.includes(sub.episodeNum))
        : subtitles

    subs.forEach((sub) => {
      window.open(sub.magnet, "magnet")
    })
  }

  const generateGroupUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("group", groupName)

    navigator.clipboard.writeText(url.toString())
  }

  useEffect(() => {
    const groupName = searchParams.get("group")

    if (groupName) setGroupName(groupName)
  }, [setGroupName])

  useEffect(() => {
    if (!groupName) return

    fansubService
      .getSubtitles(groupName, anime.id!)
      .then(({ data }) => setSubtitles(data))
  }, [groupName])

  // if (!isDesktop || viewport === "mobile")
  //   return <MobileAnimeDetailsContent anime={anime} />

  return (
    <div className="relative w-full">
      <div className="absolute top-0 aspect-[4/1] max-h-[45vh] min-h-[20vh] w-full overflow-hidden">
        <Image
          src={anime.bannerUrl}
          alt=""
          fill
          className="object-cover blur-sm brightness-75"
        />
        <div className="absolute bottom-2 flex w-full gap-4 px-6">
          <div className="w-1/4 max-w-[300px]" />
          <div>
            <h1 className="text-4xl font-semibold">{anime.title}</h1>
            <div className="ml-2 mt-2 flex items-center gap-2">
              <p className="text-2xl">{anime.alternativeTitles.jp}</p>
              {(!!anime.alternativeTitles.en ||
                anime.alternativeTitles.synonyms.length > 0) && (
                <Popover>
                  <PopoverTrigger asChild className="cursor-pointer">
                    <Ellipsis />
                  </PopoverTrigger>

                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-auto max-w-96"
                  >
                    {!!anime.alternativeTitles.en && (
                      <div className="flex">
                        <Dot className="flex-shrink-0" />
                        {anime.alternativeTitles.en}
                      </div>
                    )}
                    {anime.alternativeTitles.synonyms.map((title) => (
                      <div key={title} className="flex">
                        <Dot className="flex-shrink-0" />
                        {title}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 px-6">
        <div className="relative mt-14 flex w-1/4 max-w-[300px] flex-shrink-0 flex-col gap-4">
          <div className="overflow-hidden rounded-lg border-4 border-primary">
            <AnimeThumbnail thumbnailUrl={anime.thumbnailUrl} />
          </div>

          {user && (
            <AnimeListForm
              numEpisodes={anime.numEpisodes ?? 0}
              animeId={anime.id!}
              userList={userList}
              setUserList={setUserList}
            />
          )}

          <div className="grid gap-4 rounded-lg border p-4">
            {Object.keys(anime.score).map((key) => {
              const score = anime.score[key as keyof typeof anime.score]

              return (
                <div key={key} className="grid gap-1">
                  <div className="flex justify-between">
                    <span>
                      {TRANSLATION.ANIME_SCORE[key as keyof AnimeScore]}
                    </span>
                    <span>{score}</span>
                  </div>
                  <Progress value={score * 10} className="bg-neutral-700" />
                </div>
              )
            })}
            {user && (
              <ScoreForm
                animeId={anime.id!}
                userList={userList}
                setUserList={setUserList}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <div>
              <div className="font-semibold">Data emisji</div>
              <div>
                {anime.startDate &&
                  format(anime.startDate, "dd.LL.yyyy", { locale: pl })}{" "}
                –{" "}
                {anime.endDate &&
                  format(anime.endDate, "dd.LL.yyyy", { locale: pl })}
              </div>
            </div>

            <div>
              <div className="font-semibold">Sezon</div>
              <div>
                {!!anime.startSeason
                  ? `${anime.startSeason?.season} ${anime.startSeason?.year}`
                  : "unknown"}
              </div>
            </div>

            <div>
              <div className="font-semibold">Rodzaj</div>
              <div>{anime.mediaType?.name || "unknown"}</div>
            </div>

            <div>
              <div className="font-semibold">Ilość odcinków</div>
              <div>{anime.numEpisodes || "unknown"}</div>
            </div>

            <div>
              <div className="font-semibold">Pierwowzór</div>
              <div>{anime.source?.name || "unknown"}</div>
            </div>

            <div>
              <div className="font-semibold">Studia</div>
              <div>
                {anime.studios?.map((studio) => studio.name).join(", ") ||
                  "unknown"}
              </div>
            </div>

            <div>
              <div className="font-semibold">Status</div>
              <div>{anime.status || "unknown"}</div>
            </div>

            <div>
              <div className="font-semibold">Kategoria wiekowa</div>
              <div>{anime.rating?.name || "unknown"}</div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="w-1 overflow-hidden">
            <div className="relative top-0 -z-10 aspect-[4/1] max-h-[45vh] min-h-[20vh] w-[100vw] overflow-hidden" />
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              {anime.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>

            <p className="whitespace-pre-wrap px-2">{anime.synopsis}</p>

            {anime?.relationships?.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem
                  className="rounded-md border border-secondary"
                  value="item-1"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    Powiązane
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <ScrollArea>
                      <div className="flex gap-3">
                        {anime.relationships.map((r, i) => (
                          <SimpleAnimeCard
                            anime={r.animeNode}
                            type={r.type}
                            key={i}
                            className="scale-95 md:hover:scale-100"
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

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
                    <SubtitlesDownload
                      selectedEpisodes={selectedEpisodes}
                      groupName={groupName}
                      animeId={anime.id!}
                    />

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
                                <div>Generuj link do napisów</div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        Skopiowano!
                      </PopoverContent>
                    </Popover>
                  </>
                )}

                {translations.some(
                  ({ authors, group }) =>
                    authors.some((author) => author.member.id === user?.id) ||
                    group.admins.some(({ id }) => id === user?.id)
                ) && (
                  <SubtitlesForm
                    episodesCount={anime.episodesCount!}
                    translations={translations}
                    animeId={anime.id!}
                  />
                )}

                {/* {translations.some(({ authors }) =>
                  authors.some((author) => author.member.id === user?.id)
                ) && (
                  <SubtitlesForm
                    episodesCount={anime.episodesCount!}
                    translations={translations}
                    animeId={anime.id!}
                  />
                )} */}
              </div>

              <Select onValueChange={(val) => setSort(val)} value={sort}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sortuj wg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sortuj wg</SelectLabel>
                    <SelectItem value="asc">Odcinek rosnąco</SelectItem>
                    <SelectItem value="desc">Odcinek malejąco</SelectItem>
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
                      <div
                        className="flex items-center gap-3"
                        key={author.member.id}
                      >
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
                              {author.roles
                                .map(
                                  (role) =>
                                    TRANSLATION.FANSUB_ROLES_TRANSLATION[role]
                                )
                                .join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  {translations
                    .filter((t) => t.group.name == groupName)[0]
                    .fakeAuthors.map((author) => (
                      <div
                        className="flex items-center gap-3"
                        key={author.member.id}
                      >
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
                              {author.roles
                                .map(
                                  (role) =>
                                    TRANSLATION.FANSUB_ROLES_TRANSLATION[role]
                                )
                                .join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {episodes.content
                .sort((a, b) =>
                  sort === "asc"
                    ? a.episodeNum - b.episodeNum
                    : b.episodeNum - a.episodeNum
                )
                .map((episode, i) => (
                  <EpisodeCard
                    key={i}
                    subtitle={
                      subtitles.filter(
                        (subtitle) => subtitle.episodeNum === episode.episodeNum
                      )[0]
                    }
                    onClick={switchEpisode}
                    anySubtitles={groupName == "" && translations.length > 0}
                    selected={selectedEpisodes.includes(episode.episodeNum)}
                    animeId={anime.id!}
                    groupName={groupName}
                    {...episode}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
