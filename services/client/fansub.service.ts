import { AxiosRequestConfig } from "axios"

import {
  FakeMember,
  Group,
  GroupNode,
  Post,
  Subtitles,
  Translation,
} from "@/types/fansub"
import { ItemPage, ItemPageFilters } from "@/types/page"

import { Api } from "./api.service"

export class FansubService extends Api {
  constructor() {
    super("/fansub")
  }

  searchGroups(groupName: string) {
    return this._get<ItemPage<GroupNode>>("/groups", {
      params: { groupName },
    })
  }

  getGroup(groupName: string) {
    return this._get<Group>(`/groups/${groupName}`)
  }

  patchGroup(groupName: string, group: Partial<Group>) {
    return this._patch<Group>(`/groups/${groupName}`, group)
  }

  getPosts(groupName: string) {
    return this._get<ItemPage<Post>>(`/groups/${groupName}/posts`)
  }

  addPost(groupName: string, post: Partial<Post>) {
    return this._post(`/groups/${groupName}/posts`, post)
  }

  patchPost(groupName: string, postId: string, post: Partial<Post>) {
    return this._patch(`/groups/${groupName}/posts/${postId}`, post)
  }

  updateProfilePicture(groupName: string, formData: FormData) {
    return this._put(`/groups/${groupName}/avatar`, formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  updateBanner(groupName: string, formData: FormData) {
    return this._put(`/groups/${groupName}/banner`, formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  addMemberRole(groupName: string, userId: string, role: string) {
    return this._put(`/groups/${groupName}/members/${userId}/roles/${role}`)
  }

  removeMemberRole(groupName: string, userId: string, role: string) {
    return this._delete(`/groups/${groupName}/members/${userId}/roles/${role}`)
  }

  getTranslations(groupName: string, status: string = "") {
    return this._get<Translation[]>(`/groups/${groupName}/translations`, {
      params: { status },
    })
  }

  addTranslation(groupName: string, animeId: number) {
    return this._post(`/groups/${groupName}/translations`, { animeId })
  }

  getTranslation(groupName: string, animeId: number) {
    return this._get<Translation>(
      `/groups/${groupName}/translations/${animeId}`
    )
  }

  getSubtitles(
    groupName: string,
    animeId: number,
    filters?: ItemPageFilters<Subtitles>,
    options?: AxiosRequestConfig<Subtitles>
  ) {
    return this._get<ItemPage<Subtitles>>(
      `/groups/${groupName}/translations/${animeId}/subtitles`,
      {
        ...options,
        params: filters,
      }
    )
  }

  addTranslationAuthor(groupName: string, animeId: number, userId: string) {
    return this._put<Translation>(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}`
    )
  }

  addFakeTranslationAuthor(
    groupName: string,
    animeId: number,
    memberId: string
  ) {
    return this._put<Translation>(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}`
    )
  }

  removeTranslationAuthor(groupName: string, animeId: number, userId: string) {
    return this._delete(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}`
    )
  }

  removeFakeTranslationAuthor(
    groupName: string,
    animeId: number,
    memberId: string
  ) {
    return this._delete(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}`
    )
  }

  addTranslationAuthorRole(
    groupName: string,
    animeId: number,
    userId: string,
    role: string
  ) {
    return this._put(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}/roles/${role}`
    )
  }

  removeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    userId: string,
    role: string
  ) {
    return this._delete(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}/roles/${role}`
    )
  }

  addFakeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    memberId: string,
    role: string
  ) {
    return this._put(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}/roles/${role}`
    )
  }

  removeFakeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    memberId: string,
    role: string
  ) {
    return this._delete(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}/roles/${role}`
    )
  }

  getTranslationsToAnime(animeId: number) {
    return this._get<ItemPage<Translation>>("/translations", {
      params: { animeId },
    })
  }

  getLastTranslations() {
    return this._get<ItemPage<Translation>>("/translations", {
      params: { size: "20" },
    })
  }

  addSubtitle(
    groupName: string,
    animeId: number,
    episodeNum: number,
    formData: FormData
  ) {
    return this._put<Subtitles>(
      `/groups/${groupName}/translations/${animeId}/subtitles/${episodeNum}`,
      formData,
      {
        timeout: 1_000 * 60 * 5,
      }
    )
  }

  patchSubtitle(
    groupName: string,
    animeId: number,
    episodeNum: number,
    formData: FormData
  ) {
    return this._patch<Subtitles>(
      `/groups/${groupName}/translations/${animeId}/subtitles/${episodeNum}`,
      formData,
      {
        timeout: 1_000 * 60 * 5,
      }
    )
  }

  downloadSubtitle(
    groupName: string,
    animeId: number,
    episodeNumList: number[]
  ) {
    return this._get<Subtitles[]>("/subtitles", {
      params: {
        groupName,
        animeId,
        episodeNumList,
      },
    })
  }

  inviteMember(groupName: string, userId: string) {
    return this._put(`/groups/${groupName}/members/${userId}`)
  }

  kickMember(groupName: string, userId: string) {
    return this._delete(`/groups/${groupName}/members/${userId}`)
  }

  deleteFakeMember(groupName: string, userId: string) {
    return this._delete(`/groups/${groupName}/fakeMembers/${userId}`)
  }

  addFakeMember(groupName: string, request: { displayName: string }) {
    return this._post<FakeMember>(`/groups/${groupName}/fakeMembers/`, request)
  }
}
