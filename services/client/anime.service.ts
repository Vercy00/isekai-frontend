import { AxiosRequestConfig } from "axios"

import {
  Anime,
  AnimeFilters,
  Episode,
  UserList,
  UserListReq,
  UserListStatus,
} from "@/types/anime"
import { ItemPage, ItemPageFilters } from "@/types/page"
import { UserStats } from "@/types/user"

import { Api } from "./api.service"

export class AnimeService extends Api {
  constructor() {
    super()
  }

  async searchAnimeList(
    filters: Partial<AnimeFilters>,
    options?: AxiosRequestConfig<any> | undefined
  ) {
    return await this._get<ItemPage<Anime>>("/anime", {
      ...options,
      params: filters,
    })
  }

  async addAnime(anime: any) {
    return await this._post("/anime", anime)
  }

  async hideAnime(animeId: number, hide: boolean) {
    return await this._patch(`/anime/${animeId}`, { hide })
  }

  async patchAnime(animeId: number, anime: Partial<Anime>) {
    return await this._patch(`/anime/${animeId}`, anime)
  }

  async updateThumbnail(animeId: number, formData: FormData) {
    return await this._put(`/anime/${animeId}/thumbnail`, formData, {
      timeout: 10_000,
    })
  }

  async updateBanner(animeId: number, formData: FormData) {
    return await this._put(`/anime/${animeId}/banner`, formData, {
      timeout: 10_000,
    })
  }

  async getUserStatus(animeId: number) {
    return await this._get<UserList>(`/anime/${animeId}/myListStatus`)
  }

  async patchUserStatus(animeId: number, userList: Partial<UserListReq>) {
    return await this._patch<UserList>(
      `/anime/${animeId}/myListStatus`,
      userList
    )
  }

  async addToFavorite(animeId: number, favorite: boolean) {
    return await this._patch<UserList>(`/anime/${animeId}/myListStatus`, {
      favorite,
    })
  }

  async deleteUserListStatus(animeId: number) {
    return await this._delete(`/anime/${animeId}/myListStatus`)
  }

  async getUserList(userId: string) {
    return await this._get<UserStats>(`/animeListStatus/stats`)
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

  async getEpisodes(animeId: number, filters?: ItemPageFilters<Episode>) {
    return await this._get<ItemPage<Episode>>(`/anime/${animeId}/episodes`, {
      params: filters,
    })
  }
}
