import React from "react"
import {
  findAnimeClient,
  getMediaTypesClient,
  getStudiosClient,
  getTagsClient,
} from "@/gen/anime"

import { AnimeSearch } from "@/components/anime"

export const metadata = {
  title: "Anime",
}

export default async function AnimePage() {
  const animeList = await findAnimeClient({ size: 36 })
  const mediaTypes = await getMediaTypesClient()
  const tags = await getTagsClient()
  const studios = await getStudiosClient()

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
