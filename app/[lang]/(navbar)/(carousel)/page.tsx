import React from "react"
import { findAnimeClient } from "@/gen/anime"
import { getTranslationsClient } from "@/gen/fansub"

import { AutoplayAnimeCarousel, MediumAnimeCard } from "@/components/anime"

export const metadata = {
  title: "Strona główna",
}

export default async function Home() {
  const animeList = (await findAnimeClient({ size: 12, sort: ["score,DESC"] }))
    .content
  const lastTranslationAnime = (await getTranslationsClient()).content
  const animeListTop = (
    await findAnimeClient({ size: 8, sort: ["score,DESC"] })
  ).content

  return (
    <div className="mt-4 block grid-cols-10 lg:grid">
      <div className="col-start-1 col-end-8 flex flex-col gap-4">
        <div>
          <h2 className="m-2 text-3xl">Ostatnio dodane napisy</h2>
          <AutoplayAnimeCarousel itemList={lastTranslationAnime} />
        </div>

        <div>
          <h2 className="m-2 text-3xl">Ostatnio zakończone</h2>
          <AutoplayAnimeCarousel itemList={animeList} />
        </div>
      </div>

      <div className="col-start-8 col-end-11 px-4">
        <h2 className="my-2 text-3xl">Najlepiej oceniane</h2>
        <div className="mt-4 flex w-full flex-col gap-4">
          {animeListTop.map((anime, index) => (
            <MediumAnimeCard anime={anime} key={index} number={index + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
