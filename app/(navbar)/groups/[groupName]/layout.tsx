import { ServerFansubService } from "@/services/server/server-fansub.service"

import { GroupsContent } from "./components/groups-content"

const fansubService = new ServerFansubService()

interface GroupLayoutProps {
  children: React.ReactNode
  params: Promise<any>
}

export default async function Layout(props: GroupLayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  const groupName = params.groupName.replaceAll("_", " ")
  const group = await fansubService.getGroup(groupName)

  return <GroupsContent group={group}>{children}</GroupsContent>
}
