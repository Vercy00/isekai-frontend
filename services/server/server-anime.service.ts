import { getServerSession } from "next-auth"

import {
  Anime,
  AnimeMediaType,
  AnimeStudio,
  AnimeTag,
  Episode,
  UserList,
  UserListStatus,
} from "@/types/anime"
import { ItemPage, ItemPageFilters } from "@/types/page"
import { UserStats } from "@/types/user"
import { authOptions } from "@/app/auth/[...nextauth]/route"

import { ServerApi } from "./server-api.service"

class ServerAnimeService extends ServerApi {
  getAnimeList(params: URLSearchParams | string = "") {
    return this._get<ItemPage<Anime>>("/anime", {
      params,
    })
  }

  getMediaTypes() {
    return this._get<AnimeMediaType[]>("/mediaTypes")
  }

  getTags() {
    return this._get<AnimeTag[]>("/tags")
  }

  getStudios() {
    return this._get<AnimeStudio[]>("/studios")
  }

  getAnime(animeId: number, show = false) {
    return this._get<Anime>(`/anime/${animeId}?show=${show}`)
  }

  getEpisodes(animeId: number, filters?: ItemPageFilters<Episode>) {
    return this._get<ItemPage<Episode>>(`/anime/${animeId}/episodes`, {
      params: filters,
    })
  }

  async getUserList(animeId: number) {
    const token = (await getServerSession(authOptions))?.accessToken

    return this._get<UserList>(`/anime/${animeId}/myListStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  getUserStats(userId: string) {
    return this._get<UserStats>(`/animeListStatus/stats`, {
      params: {
        userId,
      },
    })
  }

  getUserListStatus(userId: string, type: UserListStatus | null = null) {
    return this._get<UserList[]>(`/animeListStatus`, {
      params: type
        ? {
            userId,
            type,
          }
        : {
            userId,
          },
    })
  }
}

export { ServerAnimeService }
