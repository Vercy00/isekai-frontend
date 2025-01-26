"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FansubService } from "@/services/client/fansub.service"
import CircularProgress from "@mui/material/CircularProgress"
import { RowData } from "@tanstack/react-table"
import { ChevronLeft } from "lucide-react"

import { Group, Subtitle, Translation } from "@/types/fansub"
import { AdvancedTable } from "@/components/ui/advanced-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { STATUSES } from "../../../group-list-tab"
import { columns as authorsColums } from "./authors-table/columns"
import { columns as fakeAuthorsColums } from "./fake-authors-table/columns"
import { columns as subtitlesColumns } from "./subtitles-table/columns"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    authorsTable?: {
      translation: Translation | null
      group: Group
      setTranslation: Dispatch<SetStateAction<Translation | null>>
    }
  }
}

const fansubService = new FansubService()

interface TranslationEditFormProps {
  group: Group
  animeId: number
  onClose: () => void
}

export function TranslationEditForm({
  group,
  animeId,
  onClose,
}: TranslationEditFormProps) {
  const [translation, setTranslation] = useState<Translation | null>(null)
  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null)

  useEffect(() => {
    fansubService.getTranslation(group.name, animeId).then(({ data }) => {
      setTranslation(data)
    })

    fansubService.getSubtitles(group.name, animeId).then(({ data }) => {
      setSubtitles(data)
    })
  }, [])

  return (
    <>
      <div className="flex">
        <div role="button" onClick={onClose} className="pr-3">
          <ChevronLeft />
        </div>
        <h2 className="mb-3">
          Edytowanie serii: {translation?.animeNode.title}
        </h2>
      </div>
      <div className="grid gap-4">
        <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
          {STATUSES[translation?.status || "PLANNED"]}
        </div>

        <Tabs defaultValue="members">
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="members" className="w-full">
              Autorzy
            </TabsTrigger>
            <TabsTrigger value="fake-members" className="w-full">
              Autorzy widmo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <AdvancedTable
              columns={authorsColums}
              initData={translation?.authors || []}
              generateMeta={() => ({
                authorsTable: {
                  group,
                  translation,
                  setTranslation,
                },
              })}
            />
          </TabsContent>
          <TabsContent value="fake-members">
            <AdvancedTable
              columns={fakeAuthorsColums}
              initData={translation?.fakeAuthors || []}
              generateMeta={() => ({
                authorsTable: {
                  group,
                  translation,
                  setTranslation,
                },
              })}
            />
          </TabsContent>
        </Tabs>

        <AdvancedTable columns={subtitlesColumns} initData={subtitles || []} />
      </div>

      {(!translation || !subtitles) && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/80">
          <CircularProgress />
        </div>
      )}
    </>
  )
}
