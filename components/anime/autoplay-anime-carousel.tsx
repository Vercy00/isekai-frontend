"use client"

import React, { useRef, useState } from "react"
import { AnimeNodeDto } from "@/gen/anime"
import { TranslationDto } from "@/gen/fansub"
import Autoplay from "embla-carousel-autoplay"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { SimpleAnimeCard } from "./anime-card"

interface AutoplayAnimeCarouselProps {
  delay?: number
  itemList: AnimeNodeDto[] | TranslationDto[]
}

export function AutoplayAnimeCarousel({
  delay,
  itemList,
}: AutoplayAnimeCarouselProps) {
  const [childOpen, setChildOpen] = useState<object>({})
  const contentRef = useRef<HTMLDivElement>(null)
  const plugin = React.useRef(
    Autoplay({
      delay: delay ?? 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  return (
    <div ref={contentRef}>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="overflow-visible">
          {itemList?.map((item, index) => (
            <CarouselItem
              key={index}
              className={cn("group basis-auto pl-1")}
              style={{
                zIndex: childOpen[index as keyof typeof childOpen] ? "1" : "0",
              }}
            >
              <SimpleAnimeCard
                anime={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item as any)?.title !== undefined
                    ? (item as AnimeNodeDto)
                    : ((item as TranslationDto).animeNode as AnimeNodeDto)
                }
                onCardOpenChange={(open) =>
                  setChildOpen((c) => ({ ...c, [index]: open }))
                }
                className="scale-95 md:group-hover:scale-100"
                number={(item as TranslationDto).subtitlesCount}
                group={(item as TranslationDto).group}
                collisionBox={contentRef.current}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
