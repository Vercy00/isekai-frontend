import { Metadata, ResolvingMetadata } from "next"
import { AnimeProvider } from "@/contexts/local/anime"
import {
  AnimeDto,
  AnimeListStatusDto,
  getAnime11Client,
  getEpisodesClient,
  getMyListStatusClient,
} from "@/gen/anime"
import { getTranslationsClient } from "@/gen/fansub"
import { getServerSession } from "next-auth"

import { getAuthOptions } from "@/lib/auth"
import { AnimeDetailsContent } from "@/app/[lang]/(navbar)/anime/[animeId]/components/anime-details-content"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function AnimeDetails(request: any) {
  const session = await getServerSession(await getAuthOptions())
  const animeId = parseInt((await request.params).animeId)
  const anime = (await getAnime11Client({ animeId })) as AnimeDto
  const episodeSortDir = (await request.searchParams).episodeSortDir || "ASC"
  const episodePage = parseInt((await request.searchParams).episodePage || "0")
  const episodes = await getEpisodesClient(
    { animeId },
    { size: 12, page: episodePage, sort: [`episodeNum,${episodeSortDir}`] }
  )
  const translations = (await getTranslationsClient({ animeId })).content
  // const translations: any[] = []
  let userList: AnimeListStatusDto | null = null

  if (session) {
    try {
      userList = await getMyListStatusClient({ animeId })
    } catch {}
  }

  return (
    <AnimeProvider
      anime={anime}
      episodes={episodes}
      translations={translations}
      userList={userList}
    >
      <AnimeDetailsContent />
    </AnimeProvider>
  )
}

type Props = {
  params: Promise<{ animeId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const animeId = parseInt((await params).animeId)
  const anime = (await getAnime11Client({ animeId })) as AnimeDto
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
