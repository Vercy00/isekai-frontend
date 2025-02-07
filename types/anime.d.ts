export type AlternativeTitles = {
  jp: string | null
  en: string | null
  synonyms: string[]
}

export type AnimeMediaType = {
  id: number
  name: "tv" | "ova" | "movie" | "special" | "ona"
}

export type AnimeStatus = {
  id: number
  name: "finished_airing" | "ongoing" | "not_yet_aired" | "interrupted"
}

export type AnimeTag = {
  id: number
  name: string
  type: string
}

export type AnimeStudio = {
  id: number
  name: string
}

export type AnimeSeason = "spring" | "summer" | "fall" | "winter"

export type AnimeStartSeason = {
  year: number
  season: AnimeSeason
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

export type AnimeBroadcast = {
  dayOfTheWeek: DayOfWeek
  startTime: Date
}

export type AnimeSource = {
  id: number
  name:
    | "4-koma"
    | "comic"
    | "doujinshi"
    | "light_novel"
    | "live_action"
    | "manga"
    | "music"
    | "novel"
    | "original"
    | "other"
    | "unknown"
    | "game"
    | "visual_novel"
    | "web_manga"
    | "web_novel"
}

export type AnimeRating = {
  id: number
  name: "G" | "PG" | "PG-13" | "R" | "R+" | "Rx"
}

export type AnimeRelationType =
  | "sequel"
  | "prequel"
  | "alternative_version"
  | "alternative_setting"

export type AnimeRelatedAnime = {
  animeNode: IAnime
  type: AnimeRelationType
}

export type AnimeScore = {
  animation: number
  music: number
  plot: number
  characters: number
  mean: number
}

export type Episode = {
  title: string
  episodeNum: number
}

// export type Anime = {
//   id: number | null
//   title: string
//   episodesCount: number
//   alternativeTitles: AlternativeTitles
//   startDate: Date | null
//   endDate: Date | null
//   synopsis: string | null
//   nsfw: boolean
//   createdAt: string
//   updatedAt: string
//   mediaType: AnimeMediaType | null
//   status: AnimeStatus
//   tags: AnimeTag[]
//   numEpisodes: number | null
//   startSeason: AnimeStartSeason | null
//   broadcast: AnimeBroadcast
//   source: AnimeSource | null
//   averageEpisodeDuration: number
//   rating: AnimeRating | null
//   relationships: AnimeRelatedAnime[]
//   studios: AnimeStudio[] | null
//   malId: number | null
//   score: AnimeScore
//   popularity: number
//   hide: boolean
//   thumbnailUrl: string
//   bannerUrl: string
// }

export type Anime = {
  id: number
  title: string
  episodesCount: number
  alternativeTitles: AlternativeTitles
  startDate: Date | null
  endDate: Date | null
  synopsis: string | null
  nsfw: boolean
  createdAt: string
  updatedAt: string
  mediaType: AnimeMediaType | null
  status: AnimeStatus
  tags: AnimeTag[]
  numEpisodes: number | null
  startSeason: AnimeStartSeason | null
  broadcast: AnimeBroadcast
  source: AnimeSource | null
  averageEpisodeDuration: number
  rating: AnimeRating | null
  relationships: AnimeRelatedAnime[]
  studios: AnimeStudio[] | null
  malId: number | null
  score: AnimeScore
  popularity: number
  hide: boolean
  thumbnailUrl: string
  bannerUrl: string
}

export type AnimeFilters = {
  search: string
  tagIds: number[]
  studioId: number
  mediaTypeId: number
  startSeason: number
  sort: string
  size: number
  page: number
}

export type UserListStatus =
  | "WATCHING"
  | "COMPLETED"
  | "ON_HOLD"
  | "DROPPED"
  | "PLAN_TO_WATCH"

export type UserList = {
  score: AnimeScore | null
  watchedEpisodes: number
  status: UserListStatus | null
  favorite: boolean
  animeNode?: Anime
}

export type UserListReq = {
  score: Omit<AnimeScore, "mean"> | null
  watchedEpisodes: number
  status: UserListStatus | null
  favorite: boolean
  animeNode?: Anime
}
