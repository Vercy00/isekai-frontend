"use client"

import Image from "next/image"
import { Dot, Ellipsis } from "lucide-react"

import { Anime } from "@/types/anime"
import { Progress } from "@/components/ui/progress"

import { SimpleAnimeCard } from "../../../../../../components/anime/anime-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../../components/ui/accordion"
import { Badge } from "../../../../../../components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../components/ui/popover"
import {
  ScrollArea,
  ScrollBar,
} from "../../../../../../components/ui/scroll-area"

interface AnimeDetailsContentProps {
  anime: Anime
}

export function MobileAnimeDetailsContent({ anime }: AnimeDetailsContentProps) {
  return (
    <div>
      <div className="relative aspect-[4/1] max-h-[45lvh] min-h-[25lvh] w-full overflow-hidden">
        <Image
          src={`http://localhost:3000/api/v1/anime/${anime.id}/banner`}
          alt=""
          fill
          className="object-cover blur-sm brightness-75"
        />
        <div className="absolute bottom-2 px-4">
          <h1 className="text-2xl">{anime.title}</h1>
          <div className="mt-2 ml-2 flex items-center gap-2">
            <p className="text-xl">{anime.alternativeTitles.jp}</p>
            {(!!anime.alternativeTitles.en ||
              anime.alternativeTitles.synonyms.length > 0) && (
              <Popover>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Ellipsis />
                </PopoverTrigger>

                <PopoverContent side="bottom" align="start">
                  {!!anime.alternativeTitles.en && (
                    <div className="flex">
                      <Dot />
                      {anime.alternativeTitles.en}
                    </div>
                  )}
                  {anime.alternativeTitles.synonyms.map((title) => (
                    <div key={title} className="flex">
                      <Dot />
                      {title}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="px-4">
          <div className="flex gap-2">
            {anime.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
          <p className="mt-2 px-2">{anime.synopsis}</p>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 hover:no-underline">
              Ocena
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 px-4">
              {Object.keys(anime.score).map((key) => {
                const score = anime.score[key as keyof typeof anime.score]

                return (
                  <div key={key}>
                    <span>{key}</span>
                    <Progress value={score / 10} className="bg-neutral-700" />
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              Informacje
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div>
                <div className="font-semibold">Data emisji</div>
                <div>
                  {anime.startDate?.toLocaleDateString().substring(0, 10)} –{" "}
                  {anime.endDate?.toLocaleDateString().substring(0, 10)}
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

              <div>
                <div className="font-semibold">Napisy od</div>
                <div>brak</div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="px-4 hover:no-underline">
              Powiązane
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ScrollArea>
                <SimpleAnimeCard anime={anime} type="prequel" />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
