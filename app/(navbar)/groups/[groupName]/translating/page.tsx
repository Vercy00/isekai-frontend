import { FansubService } from "@/services/client/fansub.service"

import { GroupListTab } from "../components/group-list-tab"

const fansubService = new FansubService()

export default async function Page(props: any) {
  const groupName = (await props.params).groupName.replaceAll("_", " ")

  return (
    <GroupListTab
      defaultTab="translating"
      initData={
        (await fansubService.getTranslations(groupName, "translating")).data
      }
      groupName={groupName}
    />
  )
}
