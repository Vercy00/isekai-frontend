import { Group, GroupStats, Post } from "@/types/fansub"
import { ItemPage } from "@/types/page"

import { ServerApi } from "./server-api.service"

class ServerFansubService extends ServerApi {
  async getGroup(groupName: number) {
    return await this._get<Group>(`/fansub/groups/${groupName}`)
  }

  async getPost(groupName: number, postId: string) {
    return await this._get<Post>(`/fansub/groups/${groupName}/posts/${postId}`)
  }

  async getPosts(groupName: string) {
    return await this._get<ItemPage<Post>>(`/fansub/groups/${groupName}/posts`)
  }
}

export { ServerFansubService }
