interface AlternativeTitles {
  jp: string | null
  en: string | null
  synonyms: string[]
}

interface AnimeMediaType {
  id: number
  name: "tv" | "ova" | "movie" | "special" | "ona"
}

interface AnimeStatus {
  id: number
  name: "finished_airing" | "ongoing" | "not_yet_aired" | "interrupted"
}

interface AnimeTag {
  id: number
  name: string
  type: string
}

interface AnimeStudio {
  id: number
  name: string
}

type AnimeSeason = "spring" | "summer" | "fall" | "winter"

interface AnimeStartSeason {
  year: number
  season: AnimeSeason
}

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

interface AnimeBroadcast {
  dayOfTheWeek: DayOfWeek
  startTime: Date
}

interface AnimeSource {
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

interface AnimeRating {
  id: number
  name: "G" | "PG" | "PG-13" | "R" | "R+" | "Rx"
}

type AnimeRelationType =
  | "sequel"
  | "prequel"
  | "alternative_version"
  | "alternative_setting"

interface AnimeRelatedAnime {
  animeNode: IAnime
  type: AnimeRelationType
}

interface AnimeScore {
  animation: number
  music: number
  plot: number
  characters: number
  mean: number
}

interface Episode {
  title: string
  episodeNum: number
}

interface Anime {
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

interface AnimeFilters {
  search: string
  tagIds: number[]
  studioId: number
  mediaTypeId: number
  startSeason: number
  sort: string
  size: number
  page: number
}

type UserListStatus =
  | "WATCHING"
  | "COMPLETED"
  | "ON_HOLD"
  | "DROPPED"
  | "PLAN_TO_WATCH"

interface UserList {
  score: AnimeScore | null
  watchedEpisodes: number
  status: UserListStatus | null
  favorite: boolean
  animeNode?: Anime
}

interface UserListReq {
  score: Omit<AnimeScore, "mean"> | null
  watchedEpisodes: number
  status: UserListStatus | null
  favorite: boolean
  animeNode?: Anime
}

interface ImportAnimeRequest {
  malId: number
  aniDB: {
    id: number
    episodeType: AniDBEpisodeType
  }
}

export {
  AlternativeTitles,
  AnimeMediaType,
  AnimeStatus,
  AnimeTag,
  AnimeStudio,
  AnimeSeason,
  AnimeStartSeason,
  DayOfWeek,
  AnimeBroadcast,
  AnimeSource,
  AnimeRating,
  AnimeRelationType,
  AnimeRelatedAnime,
  AnimeScore,
  Episode,
  Anime,
  AnimeFilters,
  UserListStatus,
  UserList,
  UserListReq,
  ImportAnimeRequest,
}
