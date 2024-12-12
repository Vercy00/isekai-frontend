"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { FansubService } from "@/services/client/fansub.service"
import { RowData } from "@tanstack/react-table"

import { Group } from "@/types/fansub"
import { AdvancedTable } from "@/components/ui/advanced-table"

import { TranslationAddForm } from "./translation-add-form"
import { TranslationEditForm } from "./translation-edit-form"
import { columns } from "./translations-table/columns"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    setEditForm?: Dispatch<SetStateAction<number>>
    openAddForm?: () => void
  }
}

interface TranslationsSettingsProps {
  group: Group
}

const fansubService = new FansubService()

export function TranslationsSettings({ group }: TranslationsSettingsProps) {
  const [editForm, setEditForm] = useState(0)
  const [openAddForm, setOpenAddForm] = useState(false)

  if (editForm !== 0)
    return (
      <TranslationEditForm
        animeId={editForm}
        group={group}
        onClose={() => setEditForm(0)}
      />
    )

  if (openAddForm)
    return (
      <TranslationAddForm group={group} onClose={() => setOpenAddForm(false)} />
    )

  return (
    <div className="flex h-full flex-col gap-3">
      <AdvancedTable
        columns={columns}
        fetchData={async () =>
          (await fansubService.getTranslations(group.name)).data
        }
        generateMeta={() => ({
          setEditForm,
          openAddForm: () => setOpenAddForm(true),
        })}
        loading
      />
    </div>
  )
}
