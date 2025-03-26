import { ServerAnimeService } from "@/services/server/server-anime.service"

import { AnimeEditForm } from "./components/anime-edit-form"

const animeService = new ServerAnimeService()

export default async function AnimeEditPage(request: any) {
  const anime = await animeService.getAnime(
    parseInt((await request.params).animeId),
    true
  )

  return <AnimeEditForm initAnime={anime} />
}
