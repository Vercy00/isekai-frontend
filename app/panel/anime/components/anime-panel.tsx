"use client"

import { useEffect, useRef, useState } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { useDebounce } from "@uidotdev/usehooks"
import { ChevronLeft, Plus } from "lucide-react"

import { Anime } from "@/types/anime"
import { ItemPage } from "@/types/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AnimeAddForm } from "./anime-add-form"
import { AnimePanelCard } from "./anime-panel-card"

const animeService = new AnimeService()

interface AnimePanelProps {
  initAnimeList: ItemPage<Anime>
}

export function AnimePanel({ initAnimeList }: AnimePanelProps) {
  const [animeList, setAnimeList] = useState(initAnimeList.content)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 200)
  const [addAnime, setAddAnime] = useState(false)

  useEffect(() => {
    animeService
      .searchAnimeList({ search: debouncedSearch })
      .then(({ data }) => setAnimeList(data.content))
  }, [debouncedSearch, setAnimeList])

  if (addAnime)
    return (
      <div className="grid gap-3">
        <div className="flex items-center gap-3">
          <Button
            className="aspect-square p-2"
            onClick={() => setAddAnime(false)}
          >
            <ChevronLeft />
          </Button>
          <h2>Dodaj anime</h2>
        </div>
        <AnimeAddForm />
      </div>
    )

  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <Input
          className="w-80"
          placeholder="Szukaj..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button className="aspect-square p-2" onClick={() => setAddAnime(true)}>
          <Plus />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {animeList.map((anime, i) => (
          <AnimePanelCard key={i} anime={anime} />
        ))}
      </div>
    </div>
  )
}
