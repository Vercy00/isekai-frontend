"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { FansubService } from "@/services/client/fansub.service"

import { Translation } from "@/types/fansub"
import { AdvancedTable } from "@/components/ui/advanced-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { columns } from "./group-anime-table/columns"

const fansubService = new FansubService()

export const STATUSES = {
  PLANNED: "Planowane",
  TRANSLATING: "Tłumaczone",
  TRANSLATED: "Przetłumaczone",
  SUSPENDED: "Wstrzymane",
  DROPPED: "Porzucone",
}

interface GroupListTabProps {
  defaultTab?: string
  children?: ReactNode
  initData?: Translation[]
  groupName: string
}

export function GroupListTab({
  defaultTab = "posts",
  children,
  groupName,
  initData,
}: GroupListTabProps) {
  const urlGroupName = groupName.replaceAll(" ", "_")

  return (
    <div className="w-full">
      <Tabs value={defaultTab!}>
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="w-full" asChild>
            <Link href={`/groups/${urlGroupName}`} scroll={false}>
              Wpisy
            </Link>
          </TabsTrigger>
          {Object.entries(STATUSES).map(([key, value]) => (
            <TabsTrigger
              key={key.toLocaleLowerCase()}
              value={key.toLocaleLowerCase()}
              className="w-full"
              asChild
            >
              <Link
                href={`/groups/${urlGroupName}/${key.toLocaleLowerCase()}`}
                scroll={false}
              >
                {value}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={defaultTab!}>{children}</TabsContent>
        {Object.entries(STATUSES).map(([key, value]) => (
          <TabsContent
            key={key.toLocaleLowerCase()}
            value={key.toLocaleLowerCase()}
            className="mt-3 rounded-md border p-3"
          >
            <AdvancedTable
              columns={columns}
              fetchData={async () =>
                (
                  await fansubService.getTranslations(
                    groupName,
                    defaultTab?.toLocaleUpperCase()
                  )
                ).data
              }
              initData={initData}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
