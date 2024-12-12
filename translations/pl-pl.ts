import { AnimeScore } from "@/types/anime"
import { AnimeListStatus } from "@/types/animeListStatus"
import { FansubRole, TranslationStatus } from "@/types/fansub"

const ANIME_LIST_STATUS: {
  [key in AnimeListStatus["name"]]: string
} = {
  WATCHING: "Oglądane",
  COMPLETED: "Zakończone",
  ON_HOLD: "Wstrzymane",
  DROPPED: "Porzucone",
  PLAN_TO_WATCH: "W planach",
}

const ANIME_SCORE: {
  [key in keyof AnimeScore]: string
} = {
  animation: "Animacja",
  characters: "Postacie",
  mean: "Średnia",
  music: "Muzyka",
  plot: "Fabuła",
}

const FANSUB_ROLES_TRANSLATION: { [key in FansubRole["name"]]: string } = {
  TRANSLATOR: "Tłumacz",
  PROOFREADER: "Korektor",
  TYPESETTER: "Typesetter",
  RETIRED: "Emeryt",
  ADMIN: "Admin",
  OWNER: "Właściciel",
}

const FANSUB_TRANSLATION_STATUS: {
  [key in TranslationStatus]: string
} = {
  PLANNED: "Planowane",
  TRANSLATING: "Tłumaczone",
  TRANSLATED: "Przetłumaczone",
  SUSPENDED: "Wstrzymane",
  DROPPED: "Porzucone",
}

const BADGE: {
  [key: string]: string
} = {
  "badge.owner": "Właściciel",
  "badge.beta_supporter_tier_1": "Beta Wspierający tier 1",
  "badge.beta_supporter_tier_2": "Beta Wspierający tier 2",
  "badge.beta_supporter_tier_3": "Beta Wspierający tier 3",
  "badge.beta_supporter_tier_4": "Beta Wspierający tier 4",
  "badge.beta_supporter_tier_5": "Beta Wspierający tier 5",
}

export const TRANSLATION = {
  ANIME_LIST_STATUS,
  ANIME_SCORE,
  FANSUB_ROLES_TRANSLATION,
  FANSUB_TRANSLATION_STATUS,
  BADGE,
}
