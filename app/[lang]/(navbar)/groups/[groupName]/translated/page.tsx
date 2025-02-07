import { FansubService } from "@/services/client/fansub.service"

import { GroupListTab } from "@/components/group"

const fansubService = new FansubService()

export default async function Page(props: any) {
  const groupName = (await props.params).groupName.replaceAll("_", " ")

  return (
    <GroupListTab
      defaultTab="translated"
      initData={
        (await fansubService.getTranslations(groupName, "translated")).data
      }
      groupName={groupName}
    />
  )
}
