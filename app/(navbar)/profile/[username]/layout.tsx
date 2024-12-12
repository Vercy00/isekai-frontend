import { ServerUserService } from "@/services/server/server-user.service"

import { ProfileContent } from "./components/profile-content"
import { ServerAnimeService } from "@/services/server/server-anime.service"

const userService = new ServerUserService()
const animeService = new ServerAnimeService()

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<any>
}

export default async function ProfileLayout(props: ProfileLayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  const user = await userService.getUser(params.username)
  const userStats = await animeService.getUserStats(user!.id)

  return (
    <ProfileContent user={user!} userStats={userStats!}>
      {children}
    </ProfileContent>
  )
}
