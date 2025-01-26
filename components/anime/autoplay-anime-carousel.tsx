"use client"

import React, { useRef, useState } from "react"
import Autoplay from "embla-carousel-autoplay"

import { Anime } from "@/types/anime"
import { Translation } from "@/types/fansub"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { SimpleAnimeCard } from "./"

interface AutoplayAnimeCarouselProps {
  delay?: number
  itemList: Anime[] | Translation[]
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
                  (item as any)?.title !== undefined
                    ? (item as Anime)
                    : (item as Translation).animeNode
                }
                onCardOpenChange={(open) =>
                  setChildOpen((c) => ({ ...c, [index]: open }))
                }
                className="scale-95 md:group-hover:scale-100"
                number={(item as any).subtitlesCount}
                group={(item as any).group}
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
