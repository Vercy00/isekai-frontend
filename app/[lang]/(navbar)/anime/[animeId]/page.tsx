import { Metadata, ResolvingMetadata } from "next"
import { AnimeProvider } from "@/contexts/local/anime"
import { FansubService } from "@/services/client/fansub.service"
import { ServerAnimeService } from "@/services/server/server-anime.service"
import { getServerSession } from "next-auth"

import { UserList } from "@/types/anime"
import { SortDirection } from "@/types/page"
import { AnimeDetailsContent } from "@/app/[lang]/(navbar)/anime/[animeId]/components/anime-details-content"
import { authOptions } from "@/app/auth/[...nextauth]/route"

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
  const session = await getServerSession(authOptions)
  const animeId = parseInt((await request.params).animeId)
  const anime = await animeService.getAnime(animeId)
  const episodeSortDir = (await request.searchParams).episodeSortDir || "ASC"
  const episodePage = parseInt((await request.searchParams).episodePage || "0")
  const episodes = await animeService.getEpisodes(animeId, {
    size: 12,
    page: episodePage,
    sort: [`episodeNum,${episodeSortDir as SortDirection}`],
  })
  const translations = (await fansubService.getTranslationsToAnime(animeId))
    .data.content
  // const translations: any[] = []
  let userList: UserList = {
    favorite: false,
    score: {
      animation: 0,
      characters: 0,
      music: 0,
      plot: 0,
      mean: 0,
    },
    status: null,
    watchedEpisodes: 0,
  }

  if (session) {
    try {
      userList = await animeService.getUserList(animeId)
    } catch {}
  }

  return (
    <AnimeProvider
      anime={anime}
      episodes={episodes}
      translations={translations}
      userList={userList}
    >
      <AnimeDetailsContent
        episodes={episodes}
        viewport={(await request.searchParams).viewport}
        translations={translations}
      />
    </AnimeProvider>
  )
}
