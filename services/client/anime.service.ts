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

  searchAnimeList(
    filters: Partial<AnimeFilters>,
    options?: AxiosRequestConfig<any> | undefined
  ) {
    return this._get<ItemPage<Anime>>("/anime", {
      ...options,
      params: filters,
    })
  }

  addAnime(anime: any) {
    return this._post("/anime", anime)
  }

  hideAnime(animeId: number, hide: boolean) {
    return this._patch(`/anime/${animeId}`, { hide })
  }

  patchAnime(animeId: number, anime: Partial<Anime>) {
    return this._patch(`/anime/${animeId}`, anime)
  }

  updateThumbnail(animeId: number, formData: FormData) {
    return this._put(`/anime/${animeId}/thumbnail`, formData, {
      timeout: 10_000,
    })
  }

  updateBanner(animeId: number, formData: FormData) {
    return this._put(`/anime/${animeId}/banner`, formData, {
      timeout: 10_000,
    })
  }

  getUserStatus(animeId: number) {
    return this._get<UserList>(`/anime/${animeId}/myListStatus`)
  }

  patchUserStatus(animeId: number, userList: Partial<UserListReq>) {
    return this._patch<UserList>(`/anime/${animeId}/myListStatus`, userList)
  }

  addToFavorite(animeId: number, favorite: boolean) {
    return this._patch<UserList>(`/anime/${animeId}/myListStatus`, {
      favorite,
    })
  }

  deleteUserListStatus(animeId: number) {
    return this._delete(`/anime/${animeId}/myListStatus`)
  }

  getUserList(userId: string) {
    return this._get<UserStats>(`/animeListStatus/stats`)
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

  getEpisodes(
    animeId: number,
    filters?: ItemPageFilters<Episode>,
    options?: AxiosRequestConfig<Episode>
  ) {
    return this._get<ItemPage<Episode>>(`/anime/${animeId}/episodes`, {
      ...options,
      params: filters,
    })
  }
}
