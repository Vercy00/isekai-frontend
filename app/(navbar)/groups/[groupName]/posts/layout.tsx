import { ServerFansubService } from "@/services/server/server-fansub.service"

import { GroupListTab } from "../components/group-list-tab"
import { GroupPosts } from "../components/group-posts"

const fansubService = new ServerFansubService()

interface PostsLayoutProps {
  children: React.ReactNode
  params: Promise<any>
}

export default async function Layout(props: PostsLayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  const groupName = params.groupName.replaceAll("_", " ")
  const posts = await fansubService.getPosts(
    params.groupName.replaceAll("_", " ")
  )

  return (
    <GroupListTab defaultTab="posts" groupName={groupName}>
      <GroupPosts posts={posts} />
      {children}
    </GroupListTab>
  )
}
