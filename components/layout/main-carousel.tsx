"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimeNodeDtoPage } from "@/gen/types/AnimeNodeDtoPage"
import Autoplay from "embla-carousel-autoplay"
import { Dot, Flame, Star, Tv2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

import { Indicator } from "../indicator"
import { buttonVariants } from "../ui/button"

interface MainCarouselProps {
  animeNodeDtoPage: AnimeNodeDtoPage
}

export function MainCarousel({
  animeNodeDtoPage: { content },
}: MainCarouselProps) {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(content.length)

  const scrollTo = (index: number) => api?.scrollTo(index)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="relative">
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {content.map((anime, index) => (
            <CarouselItem key={index} className="basis-[90%]">
              <Card>
                <CardContent className="flex h-[50vh] min-h-[200px] items-center justify-center overflow-hidden rounded-md border p-0">
                  <div className="relative h-full w-full">
                    <Image
                      src={anime.bannerUrl}
                      alt=""
                      fill
                      quality={85}
                      className="object-cover"
                    />

                    <div className="absolute bottom-0 flex h-full w-full">
                      <div className="bg-background/50 z-10 flex w-1/2 flex-col p-6 backdrop-blur-md md:gap-6">
                        <div className="grid gap-3">
                          <h2 className="line-clamp-1 text-4xl md:line-clamp-2">
                            {anime.title}
                          </h2>

                          <div className="flex items-center text-lg">
                            <div className="flex items-center gap-1">
                              <Star className="size-4" />
                              <span>{anime.score.mean}</span>
                            </div>

                            <Dot className="size-4" />

                            <div className="flex items-center gap-1">
                              <Flame className="size-4" />
                              <span>{anime.popularity}</span>
                            </div>

                            {!!anime.mediaType && (
                              <>
                                <Dot className="size-4" />
                                <div className="flex items-center gap-1">
                                  <Tv2 className="size-4" />
                                  <span>{anime.mediaType?.name}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <p className="line-clamp-1 text-lg md:line-clamp-6">
                          {anime.synopsis}
                        </p>

                        <Link
                          href={`/anime/${anime.id}/${anime.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}`}
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "border-primary mt-3 w-fit border-2 bg-transparent"
                          )}
                        >
                          Przejdź do serii
                        </Link>
                      </div>

                      <div className="relative h-full w-1/2">
                        <Image
                          src={anime.bannerUrl}
                          alt=""
                          fill
                          quality={100}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Indicator count={count} current={current} onClick={scrollTo} />
    </div>
  )
}
