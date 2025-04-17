"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ANIME_LIST_STATUS } from "@/constants/anime-list-status"
import {
  AnimeListStatusNodeDto,
  getAnimeListStatusesClient,
  GetAnimeListStatusesQueryParamsTypeEnum,
} from "@/gen/anime"
import { TRANSLATION } from "@/translations/pl-pl"

import { AnimeListStatus } from "@/types/animeListStatus"
import { User } from "@/types/user"
import { AdvancedTable } from "@/components/ui/advanced-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { columns } from "./anime-list-table/columns"

interface AnimeListTabProps {
  defaultTab: AnimeListStatus["name"] | "summary"
  initList?: AnimeListStatusNodeDto[]
  user: User
}

export function AnimeListTab({
  defaultTab = "summary",
  initList,
  user,
}: AnimeListTabProps) {
  const params = useParams()

  return (
    <div className="w-full">
      <Tabs value={defaultTab.toLocaleLowerCase()}>
        <TabsList className="w-full">
          <TabsTrigger value="summary" className="w-full" asChild>
            <Link href={`/profile/${params.username}`} scroll={false}>
              Podsumowanie
            </Link>
          </TabsTrigger>
          {ANIME_LIST_STATUS.STATUS.map((status) => (
            <TabsTrigger
              key={status.name.toLocaleLowerCase()}
              value={status.name.toLocaleLowerCase()}
              className="w-full"
              asChild
            >
              <Link
                href={`/profile/${params.username}/${status.name.toLocaleLowerCase()}`}
                scroll={false}
              >
                {TRANSLATION.ANIME_LIST_STATUS[status.name]}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="summary">Podsumowanie</TabsContent>
        {defaultTab !== "summary" && (
          <TabsContent
            value={defaultTab.toLocaleLowerCase()}
            className="mt-3 rounded-md border p-3"
          >
            <AdvancedTable
              columns={columns}
              initData={initList}
              fetchData={async () =>
                (
                  await getAnimeListStatusesClient({
                    userId: user.id,
                    type: defaultTab?.toLocaleUpperCase() as GetAnimeListStatusesQueryParamsTypeEnum,
                  })
                ).data
              }
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
