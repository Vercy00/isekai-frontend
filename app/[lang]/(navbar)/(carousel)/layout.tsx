import { ServerAnimeService } from "@/services/server/server-anime.service"

import { MainCarousel } from "@/components/layout"

interface CarouselLayoutProps {
  children: React.ReactNode
}

const animeService = new ServerAnimeService()

export default async function CarouselLayout({
  children,
}: CarouselLayoutProps) {
  const animeList = await animeService.getAnimeList(
    new URLSearchParams({
      size: "5",
      sort: "score,DESC",
    })
  )

  return (
    <>
      <MainCarousel animeList={animeList} />
      {children}
    </>
  )
}
