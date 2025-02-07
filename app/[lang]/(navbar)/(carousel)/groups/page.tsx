import { FansubService } from "@/services/client/fansub.service"

import { GroupPageContent } from "@/components/group"

const fansubService = new FansubService()

export default async function GroupPage() {
  const initGroups = await fansubService.searchGroups("")

  return <GroupPageContent initGroups={initGroups.data.content} />
}
