"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ANIME_LIST_STATUS } from "@/const/animeListStatus"
import { AnimeService } from "@/services/client/anime.service"
import { TRANSLATION } from "@/translations/pl-pl"

import { UserList } from "@/types/anime"
import { AnimeListStatus } from "@/types/animeListStatus"
import { User } from "@/types/user"
import { AdvancedTable } from "@/components/ui/advanced-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { columns } from "./anime-list-table/columns"

interface AnimeListTabProps {
  defaultTab: AnimeListStatus["name"] | "summary"
  initList?: UserList[]
  user: User
}

const animeService = new AnimeService()

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
                  await animeService.getUserListStatus(
                    user.id,
                    defaultTab?.toLocaleUpperCase() as any
                  )
                ).data!
              }
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
