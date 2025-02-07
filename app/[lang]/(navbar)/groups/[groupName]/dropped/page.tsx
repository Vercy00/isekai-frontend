import { FansubService } from "@/services/client/fansub.service"

import { GroupListTab } from "@/components/group"

const fansubService = new FansubService()

export default async function Page(props: any) {
  const groupName = (await props.params).groupName.replaceAll("_", " ")

  return (
    <GroupListTab
      defaultTab="dropped"
      initData={
        (await fansubService.getTranslations(groupName, "dropped")).data
      }
      groupName={groupName}
    />
  )
}
