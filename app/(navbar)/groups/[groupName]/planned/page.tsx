import { FansubService } from "@/services/client/fansub.service"

import { GroupListTab } from "../components/group-list-tab"

const fansubService = new FansubService()

export default async function Page(props: any) {
  const groupName = (await props.params).groupName.replaceAll("_", " ")

  return (
    <GroupListTab
      defaultTab="planned"
      initData={
        (await fansubService.getTranslations(groupName, "planned")).data
      }
      groupName={groupName}
    />
  )
}
