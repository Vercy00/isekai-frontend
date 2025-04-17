"use client"

import React from "react"
import Image from "next/image"
import { useAnime } from "@/contexts/local/anime/use-anime"
import { Dot, Ellipsis } from "lucide-react"

import { useUser } from "@/hooks/store"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AnimeSidebar, SimpleAnimeCard } from "@/components/anime"
import { EpisodeList } from "@/components/episode/episode-list"

export function AnimeDetailsContent() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const anime = useAnime()
  const user = useUser()

  // if (!isDesktop || viewport === "mobile")
  //   return <MobileAnimeDetailsContent anime={anime} />

  return (
    <div className="relative w-full">
      <div className="absolute top-0 aspect-[4/1] max-h-[45lvh] min-h-[20lvh] w-full overflow-hidden">
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
            <div className="mt-2 ml-2 flex items-center gap-2">
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
        <AnimeSidebar />

        <div className="w-full">
          <div className="w-1 overflow-hidden">
            <div className="relative top-0 -z-10 aspect-[4/1] max-h-[45lvh] min-h-[20lvh] w-[100vw] overflow-hidden" />
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              {anime.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>

            <p className="px-2 whitespace-pre-wrap">{anime.synopsis}</p>

            {anime?.relationships?.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem
                  className="border-secondary rounded-md border"
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

            <EpisodeList />
          </div>
        </div>
      </div>
    </div>
  )
}
