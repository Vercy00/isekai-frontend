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
  async getAnimeList(params: URLSearchParams | string = "") {
    return await this._get<ItemPage<Anime>>("/anime", {
      params,
    })
  }

  async getMediaTypes() {
    return await this._get<AnimeMediaType[]>("/mediaTypes")
  }

  async getTags() {
    return await this._get<AnimeTag[]>("/tags")
  }

  async getStudios() {
    return await this._get<AnimeStudio[]>("/studios")
  }

  async getAnime(animeId: number, show = false) {
    return await this._get<Anime>(`/anime/${animeId}?show=${show}`)
  }

  async getEpisodes(animeId: number, filters?: ItemPageFilters<Episode>) {
    return await this._get<ItemPage<Episode>>(`/anime/${animeId}/episodes`, {
      params: filters,
    })
  }

  async getUserList(animeId: number) {
    const token = (await getServerSession(authOptions))?.accessToken

    return await this._get<UserList>(`/anime/${animeId}/myListStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async getUserStats(userId: string) {
    return await this._get<UserStats>(`/animeListStatus/stats`, {
      params: {
        userId,
      },
    })
  }

  async getUserListStatus(userId: string, type: UserListStatus | null = null) {
    return await this._get<UserList[]>(`/animeListStatus`, {
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
