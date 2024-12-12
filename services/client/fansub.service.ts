import {
  FakeMember,
  Group,
  GroupNode,
  Post,
  Subtitle,
  Translation,
} from "@/types/fansub"
import { ItemPage } from "@/types/page"

import { Api } from "./api.service"

export class FansubService extends Api {
  constructor() {
    super("/api/v1/fansub")
  }

  async searchGroups(groupName: string) {
    return await this._get<ItemPage<GroupNode>>(
      "/groups",
      new URLSearchParams({ groupName })
    )
  }

  async getGroup(groupName: string) {
    return await this._get<Group>(`/groups/${groupName}`)
  }

  async patchGroup(groupName: string, group: Partial<Group>) {
    return await this._patch<Group>(`/groups/${groupName}`, group)
  }

  async getPosts(groupName: string) {
    return await this._get<ItemPage<Post>>(`/groups/${groupName}/posts`)
  }

  async addPost(groupName: string, post: Partial<Post>) {
    return await this._post(`/groups/${groupName}/posts`, post)
  }

  async patchPost(groupName: string, postId: string, post: Partial<Post>) {
    return await this._patch(`/groups/${groupName}/posts/${postId}`, post)
  }

  async updateProfilePicture(groupName: string, formData: FormData) {
    return await this._put(`/groups/${groupName}/avatar`, formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  async updateBanner(groupName: string, formData: FormData) {
    return await this._put(`/groups/${groupName}/banner`, formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  async addMemberRole(groupName: string, userId: string, role: string) {
    return await this._put(
      `/groups/${groupName}/members/${userId}/roles/${role}`
    )
  }

  async removeMemberRole(groupName: string, userId: string, role: string) {
    return await this._delete(
      `/groups/${groupName}/members/${userId}/roles/${role}`
    )
  }

  async getTranslations(groupName: string, status: string = "") {
    return await this._get<Translation[]>(
      `/groups/${groupName}/translations`,
      new URLSearchParams({ status })
    )
  }

  async addTranslation(groupName: string, animeId: number) {
    return await this._post(`/groups/${groupName}/translations`, { animeId })
  }

  async getTranslation(groupName: string, animeId: number) {
    return await this._get<Translation>(
      `/groups/${groupName}/translations/${animeId}`
    )
  }

  async getSubtitles(groupName: string, animeId: number) {
    return await this._get<Subtitle[]>(
      `/groups/${groupName}/translations/${animeId}/subtitles`,
      new URLSearchParams({
        size: "1000",
      })
    )
  }

  async addTranslationAuthor(
    groupName: string,
    animeId: number,
    userId: string
  ) {
    return await this._put<Translation>(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}`
    )
  }

  async addFakeTranslationAuthor(
    groupName: string,
    animeId: number,
    memberId: string
  ) {
    return await this._put<Translation>(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}`
    )
  }

  async removeTranslationAuthor(
    groupName: string,
    animeId: number,
    userId: string
  ) {
    return await this._delete(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}`
    )
  }

  async removeFakeTranslationAuthor(
    groupName: string,
    animeId: number,
    memberId: string
  ) {
    return await this._delete(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}`
    )
  }

  async addTranslationAuthorRole(
    groupName: string,
    animeId: number,
    userId: string,
    role: string
  ) {
    return await this._put(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}/roles/${role}`
    )
  }

  async removeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    userId: string,
    role: string
  ) {
    return await this._delete(
      `/groups/${groupName}/translations/${animeId}/authors/${userId}/roles/${role}`
    )
  }

  async addFakeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    memberId: string,
    role: string
  ) {
    return await this._put(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}/roles/${role}`
    )
  }

  async removeFakeTranslationAuthorRole(
    groupName: string,
    animeId: number,
    memberId: string,
    role: string
  ) {
    return await this._delete(
      `/groups/${groupName}/translations/${animeId}/fakeAuthors/${memberId}/roles/${role}`
    )
  }

  async getTranslationsToAnime(animeId: number) {
    return await this._get<ItemPage<Translation>>(
      "/translations",
      new URLSearchParams({ animeId: animeId.toString() })
    )
  }

  async getLastTranslations() {
    return await this._get<ItemPage<Translation>>(
      "/translations",
      new URLSearchParams({ size: "20" })
    )
  }

  async addSubtitle(
    groupName: string,
    animeId: number,
    episodeNum: number,
    formData: FormData
  ) {
    return await this._put<Subtitle>(
      `/groups/${groupName}/translations/${animeId}/subtitles/${episodeNum}`,
      formData,
      {
        timeout: 1_000 * 60 * 5,
      }
    )
  }

  async patchSubtitle(
    groupName: string,
    animeId: number,
    episodeNum: number,
    formData: FormData
  ) {
    return await this._patch<Subtitle>(
      `/groups/${groupName}/translations/${animeId}/subtitles/${episodeNum}`,
      formData,
      {
        timeout: 1_000 * 60 * 5,
      }
    )
  }

  async downloadSubtitle(
    groupName: string,
    animeId: number,
    episodeNumList: number[]
  ) {
    return await this._get<Subtitle[]>(
      "/subtitles",
      new URLSearchParams({
        groupName,
        animeId: animeId.toString(),
        episodeNumList: episodeNumList.join(","),
      })
    )
  }

  async inviteMember(groupName: string, userId: string) {
    return await this._put(`/groups/${groupName}/members/${userId}`)
  }

  async kickMember(groupName: string, userId: string) {
    return await this._delete(`/groups/${groupName}/members/${userId}`)
  }

  async deleteFakeMember(groupName: string, userId: string) {
    return await this._delete(`/groups/${groupName}/fakeMembers/${userId}`)
  }

  async addFakeMember(groupName: string, request: { displayName: string }) {
    return await this._post<FakeMember>(
      `/groups/${groupName}/fakeMembers/`,
      request
    )
  }
}
