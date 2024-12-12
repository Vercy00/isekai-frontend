"use sever"

import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import axios from "axios"

import {
  Anime,
  AnimeMediaType,
  AnimeStudio,
  AnimeTag,
  Episode,
  UserList,
  UserListStatus,
} from "@/types/anime"
import { ItemPage } from "@/types/page"
import { UserStats } from "@/types/user"

import { ServerApi } from "./server-api.service"

export class ServerAnimeService extends ServerApi {
  constructor() {
    super()
  }

  async getAnimeList(params: URLSearchParams | string = "") {
    return await this._get<ItemPage<Anime>>("/anime", params)
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

  async getEpisodes(animeId: number, params?: any) {
    return await this._get<ItemPage<Episode>>(
      `/anime/${animeId}/episodes`,
      new URLSearchParams({ ...params })
    )
  }

  async getUserList(animeId: number) {
    const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies)

    return (
      await axios.get<UserList>(
        `${this.baseUrl}/anime/${animeId}/myListStatus`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      )
    ).data
  }

  async getUserStats(userId: string) {
    return await this._get<UserStats>(
      `/animeListStatus/stats`,
      new URLSearchParams({
        userId,
      })
    )
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
