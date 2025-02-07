"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimeService } from "@/services/client/anime.service"
import { AxiosError } from "axios"
import { Ellipsis, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Anime } from "@/types/anime"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const animeService = new AnimeService()

interface AnimePanelCardProps {
  anime: Anime
}

export function AnimePanelCard({ anime }: AnimePanelCardProps) {
  const [hideDisabled, setHideDisabled] = useState(false)

  const handleHide = () => {
    setHideDisabled(true)

    toast.promise(animeService.hideAnime(anime.id!, !(anime as any).hide), {
      loading: "Ukrywanie anime...",
      success: () => {
        setHideDisabled(false)
        ;(anime as any).hide = !(anime as any).hide

        return `Anime "${anime.title}" zostało ${(anime as any).hide ? "ukryte" : "upublicznione"}`
      },
      error: (err: AxiosError) => {
        setHideDisabled(false)

        return "Nieznany błąd"
      },
    })
  }

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-md">
      {(anime as any).hide && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-background/75 p-2">
          <EyeOff className="size-5" />
        </div>
      )}

      <Image
        src={anime.bannerUrl}
        alt=""
        fill
        className="-z-10 object-cover blur-sm brightness-75"
      />
      <div className="grid h-full grid-cols-[3fr_5fr]">
        <div className="relative m-4 overflow-hidden rounded-md">
          <Image
            src={anime.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="h-full w-full bg-background/50 p-3">
          <div className="flex justify-between gap-2">
            <h2 className="line-clamp-2 font-bold">{anime.title}</h2>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="size-8 p-2">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/panel/anime/${anime.id}`}>Edytuj</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={hideDisabled} onClick={handleHide}>
                  {(anime as any).hide ? "Pokaż" : "Ukryj"}
                </DropdownMenuItem>
                <DropdownMenuItem>Usuń</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-2 grid gap-1">
            <div className="text-sm">
              <span className="font-semibold">Odcinki: </span>
              <span>{anime.numEpisodes ?? "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Typ: </span>
              <span>{anime.mediaType?.name ?? "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Studia: </span>
              <span>
                {anime.studios?.map((studio) => studio.name).join(",") || "N/A"}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Kategoria wiekowa: </span>
              <span>{anime.rating?.name ?? "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Status: </span>
              <span>{anime.status ?? "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
