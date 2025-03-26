import { Group, GroupStats, Post } from "@/types/fansub"
import { ItemPage } from "@/types/page"

import { ServerApi } from "./server-api.service"

class ServerFansubService extends ServerApi {
  getGroup(groupName: number) {
    return this._get<Group>(`/fansub/groups/${groupName}`)
  }

  getPost(groupName: number, postId: string) {
    return this._get<Post>(`/fansub/groups/${groupName}/posts/${postId}`)
  }

  getPosts(groupName: string) {
    return this._get<ItemPage<Post>>(`/fansub/groups/${groupName}/posts`)
  }
}

export { ServerFansubService }
