"use client"

import { ReactNode } from "react"
import { useAnime } from "@/contexts/local/anime"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

import { Anime } from "@/types/anime"
import { useUser } from "@/hooks/store"

import { ScoreForm } from "../score/score-form"
import { Progress } from "../ui/progress"
import { AnimeListForm } from "./anime-list-form"
import { AnimeThumbnail } from "./anime-thumbnail"

function AnimeSidebar() {
  const { t } = useTranslation()
  const anime = useAnime()
  const user = useUser()

  return (
    <div className="relative mt-14 flex w-1/4 max-w-[300px] flex-shrink-0 flex-col gap-4">
      <div className="border-primary overflow-hidden rounded-lg border-4">
        <AnimeThumbnail thumbnailUrl={anime.thumbnailUrl} />
      </div>

      {user && <AnimeListForm />}

      <div className="grid gap-4 rounded-lg border p-4">
        {Object.keys(anime.score).map((key) => {
          const score = anime.score[key as keyof typeof anime.score]

          return (
            <div key={key} className="grid gap-1">
              <div className="flex justify-between">
                <span>{t(key)}</span>
                <span>{score}</span>
              </div>
              <Progress value={score * 10} className="bg-neutral-700" />
            </div>
          )
        })}
        {user && <ScoreForm />}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border p-4">
        {generateAnimeInfoFields(anime)}
      </div>
    </div>
  )
}

interface AnimeInfoField {
  name: string
  body: (anime: Anime, t: TFunction<"translation", undefined>) => ReactNode
}

const ANIME_INFO_FIELDS: AnimeInfoField[] = [
  {
    name: "airingDate",
    body: (anime) => (
      <div>
        {anime.startDate &&
          format(anime.startDate, "dd.LL.yyyy", { locale: pl })}{" "}
        – {anime.endDate && format(anime.endDate, "dd.LL.yyyy", { locale: pl })}
      </div>
    ),
  },
  {
    name: "sezon",
    body: (anime, t) => (
      <div>
        {!!anime.startSeason
          ? `${t(anime.startSeason?.season)} ${anime.startSeason?.year}`
          : "unknown"}
      </div>
    ),
  },
  {
    name: "mediaType",
    body: (anime, t) => <div>{t(anime.mediaType?.name || "unknown")}</div>,
  },
  {
    name: "numEpisodes",
    body: (anime) => <div>{anime.numEpisodes || "unknown"}</div>,
  },
  {
    name: "source",
    body: (anime, t) => <div>{t(anime.source?.name || "unknown")}</div>,
  },
  {
    name: "studios",
    body: (anime) => (
      <div>
        {anime.studios?.map((studio) => studio.name).join(", ") || "unknown"}
      </div>
    ),
  },
  {
    name: "status",
    body: (anime, t) => <div>{t(anime.status?.name || "unknown")}</div>,
  },
  {
    name: "rating",
    body: (anime, t) => <div>{t(anime.rating?.name || "unknown")}</div>,
  },
]

function generateAnimeInfoFields(anime: Anime) {
  const { t } = useTranslation()

  return ANIME_INFO_FIELDS.map((field) => (
    <div key={field.name}>
      <div className="font-semibold">{t(field.name)}</div>
      {field.body(anime, t)}
    </div>
  ))
}

export { AnimeSidebar }
