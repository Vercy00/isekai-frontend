import { AnimeScore } from "@/types/anime"

const SCORE: { name: keyof AnimeScore }[] = [
  { name: "animation" },
  { name: "music" },
  { name: "plot" },
  { name: "characters" },
]

const ANIME = {
  SCORE,
}

export { ANIME }
