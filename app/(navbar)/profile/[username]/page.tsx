import { ServerUserService } from "@/services/server/server-user.service"

import { AnimeListTab } from "./components/anime-list-tab"

const userService = new ServerUserService()

export default async function ProfilePage(props: any) {
  const params = await props.params;
  const user = await userService.getUser(params.username)

  return <AnimeListTab defaultTab="summary" user={user} />
}
