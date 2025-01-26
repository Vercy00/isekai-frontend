import { Metadata, ResolvingMetadata } from "next"
import { cookies } from "next/headers"
import { FansubService } from "@/services/client/fansub.service"
import { ServerAnimeService } from "@/services/server/server-anime.service"

import { AnimeDetailsContent } from "@/app/(navbar)/anime/[animeId]/components/anime-details-content"

const animeService = new ServerAnimeService()
const fansubService = new FansubService()

type Props = {
  params: Promise<{ animeId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const animeId = parseInt((await params).animeId)
  const anime = await animeService.getAnime(animeId)
  const searchImages = [(await searchParams).images || []].flat()
  const previousImages = (await parent).openGraph?.images ?? []
  const images = []

  if (searchImages.length === 0 || searchImages.includes("thumbnail"))
    images.push(anime.thumbnailUrl)

  if (searchImages.includes("banner")) images.push(anime.bannerUrl)

  if (searchImages.includes("all"))
    images.push(anime.thumbnailUrl, anime.bannerUrl, ...previousImages)

  return {
    title: anime.title,
    description: anime.synopsis,
    openGraph: {
      images: [anime.thumbnailUrl],
    },
  }
}

export default async function AnimeDetails(request: any) {
  const animeId = parseInt((await request.params).animeId)
  const anime = await animeService.getAnime(animeId)
  const episodes = await animeService.getEpisodes(animeId, {
    size: 1000,
  })
  const translations = (await fansubService.getTranslationsToAnime(animeId))
    .data.content
  const cookie = await cookies()
  let userList

  if (cookie.has("SESSION")) {
    try {
      userList = await animeService.getUserList(animeId)
    } catch {}
  }

  return (
    <AnimeDetailsContent
      anime={anime}
      episodes={episodes}
      initUserList={userList}
      viewport={(await request.searchParams).viewport}
      translations={translations}
    />
  )
}
