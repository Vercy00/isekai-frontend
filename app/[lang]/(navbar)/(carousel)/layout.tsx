import { findAnimeClient } from "@/gen/anime"

import { MainCarousel } from "@/components/layout"

interface CarouselLayoutProps {
  children: React.ReactNode
}

export default async function CarouselLayout({
  children,
}: CarouselLayoutProps) {
  const animeNodeDtoPage = await await findAnimeClient({
    size: 5,
    sort: ["score,DESC"],
  })

  return (
    <>
      <MainCarousel animeNodeDtoPage={animeNodeDtoPage} />
      {children}
    </>
  )
}
