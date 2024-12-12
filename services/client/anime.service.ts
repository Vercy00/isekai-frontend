import { AxiosRequestConfig } from "axios"

import {
  Anime,
  AnimeFilters,
  UserList,
  UserListReq,
  UserListStatus,
} from "@/types/anime"
import { ItemPage } from "@/types/page"
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
    const params = Object.entries(filters).map(([key, val]) => {
      if (key == "tags") return (val as any[])?.flatMap((tag) => [key, tag])

      return [key, val]
    })

    return await this._get<ItemPage<Anime>>(
      "/anime",
      new URLSearchParams(params as string[][]),
      options
    )
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
    return await this._get<UserList[]>(
      `/animeListStatus`,
      new URLSearchParams(
        type
          ? {
              userId,
              type,
            }
          : {
              userId,
            }
      )
    )
  }
}
