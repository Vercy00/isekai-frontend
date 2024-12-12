import { ServerFansubService } from "@/services/server/server-fansub.service"

import { PostContent } from "./components/post-content"

const fansubService = new ServerFansubService()

export default async function PostPage(request: any) {
  const groupName = (await request.params).groupName.replaceAll("_", " ")
  const postId = (await request.params).postId
  const post = await fansubService.getPost(groupName, postId)

  return <PostContent post={post} />
}
