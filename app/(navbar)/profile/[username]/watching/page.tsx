import { ServerAnimeService } from "@/services/server/server-anime.service"
import { ServerUserService } from "@/services/server/server-user.service"

import { AnimeListTab } from "../components/anime-list-tab"

const userService = new ServerUserService()
const animeService = new ServerAnimeService()

export default async function Page(props: any) {
  const params = await props.params;
  const user = await userService.getUser(params.username)
  const initList = await animeService.getUserListStatus(user!.id, "WATCHING")

  return <AnimeListTab defaultTab="WATCHING" initList={initList} user={user} />
}
