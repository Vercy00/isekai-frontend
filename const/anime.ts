import { AnimeScore } from "@/types/anime"

const SCORE: { name: keyof AnimeScore }[] = [
  { name: "animation" },
  { name: "music" },
  { name: "plot" },
  { name: "characters" },
]

export const ANIME = {
  SCORE,
}
