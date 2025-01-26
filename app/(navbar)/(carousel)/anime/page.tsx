import React from "react"
import { ServerAnimeService } from "@/services/server/server-anime.service"

import { AnimeSearch } from "@/components/anime"

const animeService = new ServerAnimeService()

export const metadata = {
  title: "Anime",
}

export default async function AnimePage() {
  const animeList = await animeService.getAnimeList(
    new URLSearchParams({ size: "36" })
  )
  const mediaTypes = await animeService.getMediaTypes()
  const tags = await animeService.getTags()
  const studios = await animeService.getStudios()

  return (
    <div className="mx-4 mt-4">
      <AnimeSearch
        animeDefaultList={animeList}
        mediaTypes={mediaTypes}
        tags={tags}
        studios={studios}
      />
    </div>
  )
}
