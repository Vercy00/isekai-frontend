"use client"

import Image from "next/image"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { AppWindowIcon, ListPlusIcon, ListXIcon } from "lucide-react"

import { Subtitles } from "@/types/fansub"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EpisodeCardProps {
  animeId: number
  groupName: string
  title: string
  subtitle?: Subtitles
  episodeNum: number
  selected?: boolean
  anySubtitles?: boolean
  onClick: (episodeNum: number) => void
}

export function EpisodeCard({
  animeId,
  groupName,
  title,
  subtitle,
  episodeNum,
  selected,
  anySubtitles,
  onClick,
}: EpisodeCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border",
        selected ? "outline-primary outline" : ""
      )}
    >
      <div className="relative grid w-full grid-cols-[1fr_30%]">
        <h3 className="w-full border-r p-4 text-left">
          ODC {episodeNum} {title}
        </h3>
        <div className="relative h-full w-full">
          <Image
            src={
              "https://api.isekai.pl/v1/storage/banners/1ca962ee-0fc0-409a-9924-20a019a23f41/672910b5a1b7077eecd68799"
            }
            alt=""
            fill
            className="object-cover"
          />
          {subtitle && (
            <div className="absolute flex h-full w-full items-center justify-end gap-3 p-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-full p-0"
                      variant="ghost"
                      onClick={() => onClick(episodeNum)}
                    >
                      {selected ? <ListXIcon /> : <ListPlusIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      {selected
                        ? "Usuń z listy pobieranych napisów"
                        : "Dodaj do listy pobieranych napisów"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`isekai://watch?animeId=${animeId}&episodeNum=${episodeNum}&groupName=${groupName}`}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-full p-0"
                      )}
                    >
                      <AppWindowIcon />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>Odtwórz odcinek w aplikacji isekai</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_30%] border-t">
        <p className="w-full border-r p-4 text-left whitespace-pre-wrap">
          {subtitle
            ? subtitle.description
            : anySubtitles
              ? "Wybierz grupę, aby wyświetlić napisy"
              : "Brak napisów"}
        </p>
        <div className="relative grid w-full grid-cols-[1fr_10px] p-4 text-left">
          {subtitle ? (
            <>
              <div>
                <div>Dodał: {subtitle.uploadedBy.displayName}</div>
                <div>
                  Dnia: {format(subtitle.createdAt, "PPpp", { locale: pl })}
                </div>
                <div>
                  Ostatnia zmiana:{" "}
                  {format(subtitle.updatedAt, "PPpp", { locale: pl })}
                </div>
              </div>
            </>
          ) : (
            <div>
              {anySubtitles
                ? "Wybierz grupę, aby wyświetlić napisy"
                : "Brak napisów"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
