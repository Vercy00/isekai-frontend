import { ServerAnimeService } from "@/services/server/server-anime.service"

import { AnimePanel } from "./components/anime-panel"

export const metadata = {
  title: "Panel Anime",
}

const animeService = new ServerAnimeService()

export default async function Page() {
  const animeList = await animeService.getAnimeList()

  return <AnimePanel initAnimeList={animeList} />
}
