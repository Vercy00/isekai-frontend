import { AnimeListStatus } from "@/types/animeListStatus"

const STATUS: AnimeListStatus[] = [
  { name: "PLAN_TO_WATCH", type: "planToWatch" },
  { name: "WATCHING", type: "watching" },
  { name: "COMPLETED", type: "completed" },
  { name: "ON_HOLD", type: "onHold" },
  { name: "DROPPED", type: "dropped" },
]

export const ANIME_LIST_STATUS = { STATUS }
