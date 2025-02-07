import React from "react"
import { FansubService } from "@/services/client/fansub.service"
import { ServerAnimeService } from "@/services/server/server-anime.service"

import { AutoplayAnimeCarousel, MediumAnimeCard } from "@/components/anime"

const animeService = new ServerAnimeService()
const fansubService = new FansubService()

export const metadata = {
  title: "Strona główna",
}

export default async function Home() {
  const animeList = await animeService.getAnimeList()
  // const lastTranslations = (await fansubService.getLastTranslations()).data
  const animeListTop = await animeService.getAnimeList(
    new URLSearchParams({
      size: "8",
      sort: "score,DESC",
    })
  )

  return (
    <div className="mt-4 block grid-cols-10 lg:grid">
      <div className="col-start-1 col-end-8 flex flex-col gap-4">
        <div>
          <h2 className="m-2 text-3xl">Ostatnio dodane napisy</h2>
          {/* <AutoplayAnimeCarousel itemList={lastTranslations.content} /> */}
        </div>

        <div>
          <h2 className="m-2 text-3xl">Ostatnio zakończone</h2>
          <AutoplayAnimeCarousel itemList={animeList.content} />
        </div>
      </div>

      <div className="col-start-8 col-end-11 px-4">
        <h2 className="my-2 text-3xl">Najlepiej oceniane</h2>
        <div className="mt-4 flex w-full flex-col gap-4">
          {animeListTop.content.map((anime, index) => (
            <MediumAnimeCard anime={anime} key={index} number={index + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
