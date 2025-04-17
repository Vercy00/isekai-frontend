"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimeNodeDto, RelationshipDtoTypeEnum } from "@/gen/anime"
import { FansubGroupNodeDto } from "@/gen/fansub"
import { Dot, Flame, Star, Tv2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "../ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { AnimeThumbnail } from "./anime-thumbnail"

const colors = ["109 40 217", "253 186 116", "163 230 53"]

interface AnimeCardProps {
  anime: AnimeNodeDto
  number?: number
  onCardOpenChange?: (open: boolean) => void
  className?: React.ComponentProps<"div">["className"]
  type?: RelationshipDtoTypeEnum
  collisionBox?: HTMLDivElement | null
  group?: FansubGroupNodeDto
  as?: "div" | "link"
}

export function SimpleAnimeCard({
  anime,
  onCardOpenChange,
  className,
  number,
  group,
  type,
  collisionBox,
  as = "link",
}: AnimeCardProps) {
  const [mouseDown, setMouseDown] = useState(false)
  const children = (
    <>
      <AnimeThumbnail
        thumbnailUrl={anime.thumbnailUrl!}
        className="border-primary rounded-lg border-2"
      >
        {!!type && (
          <div className="bg-secondary/75 text-foreground absolute bottom-2 left-1/2 -translate-x-1/2 transform rounded-md px-3 py-1">
            {type}
          </div>
        )}
      </AnimeThumbnail>

      {number !== undefined && (
        <div className="absolute top-2 flex w-full justify-between gap-2 px-2">
          <div className="text-foreground line-clamp-1 block truncate rounded-md bg-neutral-600/80 px-3.5 py-0.5 text-sm">
            {group?.name}
          </div>
          <div className="text-foreground rounded-md bg-neutral-600/80 px-3.5 py-0.5 text-sm">
            {number}
          </div>
        </div>
      )}

      <div className="line-clamp-2">{anime.title}</div>
    </>
  )

  const handleOpenChange = (open: boolean) =>
    open
      ? onCardOpenChange?.(open)
      : setTimeout(() => onCardOpenChange?.(open), 300)

  return (
    <HoverCard
      onOpenChange={handleOpenChange}
      open={mouseDown ? false : undefined}
    >
      <HoverCardTrigger asChild>
        {as === "div" ? (
          <div
            className={cn(
              "hover:text-foreground relative block w-48 font-medium text-neutral-400 transition-all",
              className
            )}
          >
            {children}
          </div>
        ) : (
          <Link
            href={`/anime/${anime.id}/${anime.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}${group ? `?group=${group.name}` : ""}`}
            className={cn(
              "hover:text-foreground relative block w-48 font-medium text-neutral-400 transition-all",
              className
            )}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
          >
            {children}
          </Link>
        )}
      </HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        className="hidden w-80 md:block"
        collisionBoundary={collisionBox}
      >
        <div className="relative h-full w-full">
          <div className="line-clamp-2 text-left text-lg">{anime.title}</div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Star className="text-primary size-5 gap-1" />
              {anime.score?.mean}
            </div>
            <div className="flex items-center gap-1">
              <Flame className="text-primary size-5" />
              {anime.popularity}
            </div>
          </div>
          <div className="my-2 flex gap-2">
            {anime.tags
              ?.slice(0, 3)
              .map((tag) => <Badge key={tag.name}>{tag.name}</Badge>)}
          </div>
          <p className="line-clamp-5 text-sm">
            <span className="text-primary">Opis: </span>
            {anime.synopsis}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function MediumAnimeCard({
  anime,
  number = 0,
  className,
}: AnimeCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/anime/${anime.id}/${anime.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}`}
          className={cn(
            "bg-secondary hover:text-foreground relative flex h-28 w-full overflow-hidden rounded-lg transition-all md:hover:opacity-80",
            className
          )}
        >
          <Image
            src={anime.bannerUrl}
            alt=""
            fill
            className="absolute object-cover blur-sm brightness-75"
          />
          <div className="relative z-10 flex">
            <div
              className="flex h-full items-center px-4 text-4xl"
              style={{
                backgroundColor: `rgb(${number - 1 < colors.length ? colors[number - 1] : "31 41 55"})`,
              }}
            >
              {number}
            </div>
            <div className="px-4 py-2 text-sm">
              <div className="flex gap-1">
                {anime.tags
                  ?.slice(0, 3)
                  .map((tag, index) => <Badge key={index}>{tag.name}</Badge>)}
              </div>
              <div className="line-clamp-2 text-xl font-medium">
                {anime.title}
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-1">
                  <Star className="size-4" />
                  <span>{anime.score?.mean}</span>
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
          </div>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent align="end" className="hidden w-80 md:block">
        <div className="relative h-full w-full">
          <div className="line-clamp-2 text-lg">{anime.title}</div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Star className="text-primary size-5 gap-1" />
              {anime.score?.mean}
            </div>
            <div className="flex items-center gap-1">
              <Flame className="text-primary size-5" />
              {anime.popularity}
            </div>
          </div>
          <div className="my-2 flex gap-2">
            {anime.tags
              ?.slice(0, 3)
              .map((tag) => <Badge key={tag.name}>{tag.name}</Badge>)}
          </div>
          <p className="line-clamp-5 text-sm">
            <span className="text-primary">Opis: </span>
            {anime.synopsis}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
