"use client"

import React from "react"
import { ta } from "date-fns/locale"
import { SettingsIcon } from "lucide-react"

import {
  AnimeFilters,
  AnimeMediaType,
  AnimeStudio,
  AnimeTag,
} from "@/types/anime"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "../../../../../components/ui/button"
import Combobox, {
  ComboboxAcordion,
} from "../../../../../components/ui/combobox"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../../../../../components/ui/drawer"
import { Input } from "../../../../../components/ui/input"
import MultiCombobox, {
  MultiComboboxAcordion,
} from "../../../../../components/ui/multi-combobox"
import { ScrollArea } from "../../../../../components/ui/scroll-area"

export interface AnimeSearchFormProps {
  mediaTypes: AnimeMediaType[]
  tags: AnimeTag[]
  studios: AnimeStudio[]
  filters: Partial<AnimeFilters>
  onChange: (filters: Partial<AnimeFilters>) => void
}

export default function AnimeSearchForm({
  mediaTypes,
  tags,
  studios,
  filters,
  onChange,
}: AnimeSearchFormProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 1536px)")

  const handleOnChange = (name: keyof AnimeFilters, val: any) => {
    if (val === null || val === undefined || val === "" || val?.length === 0) {
      delete filters[name]

      onChange({ ...filters })
    } else onChange({ ...filters, [name]: val })
  }

  if (isDesktop)
    return (
      <div>
        <div className="flex justify-between">
          <Input
            className="w-48"
            placeholder="Szukaj..."
            value={filters.search}
            onChange={(e) => handleOnChange("search", e.currentTarget.value)}
          />
          <div className="flex gap-4">
            <MultiCombobox
              options={tags.filter(
                (tag) => tag.type?.toLocaleLowerCase() === "genre"
              )}
              values={tags.filter(
                (tag) =>
                  tag.type?.toLocaleLowerCase() === "genre" &&
                  filters.tagIds?.includes(tag.id)
              )}
              onValueChange={(val) => handleOnChange("tagIds", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Gatunki"}
              className="w-48"
            />
            <MultiCombobox
              options={tags.filter(
                (tag) => tag.type?.toLocaleLowerCase() === "theme"
              )}
              values={tags.filter(
                (tag) =>
                  tag.type?.toLocaleLowerCase() === "theme" &&
                  filters.tagIds?.includes(tag.id)
              )}
              onValueChange={(val) => handleOnChange("tagIds", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Motywy"}
              className="w-48"
            />
            <Combobox
              options={mediaTypes}
              value={mediaTypes.filter((o) => filters.mediaTypeId == o.id)[0]}
              onValueChange={(val) => handleOnChange("mediaTypeId", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Rodzaj"}
              className="w-48"
            />
            <Combobox
              options={studios}
              value={studios.filter((o) => filters.studioId == o.id)[0]}
              onValueChange={(val) => handleOnChange("studioId", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Studio"}
              className="w-48"
            />
            <Combobox
              options={[]}
              value={filters.startSeason}
              onValueChange={(val) => handleOnChange("startSeason", val)}
              getId={(o) => o.toString()}
              getItem={(o) => o}
              placeholder={"Rok | Sezon"}
              className="w-48"
            />
          </div>
          <Combobox
            options={[]}
            placeholder={"Sortuj wg"}
            className="w-48"
            getId={function (value: never): string {
              throw new Error("Function not implemented.")
            }}
            getItem={function (value: never): React.ReactNode {
              throw new Error("Function not implemented.")
            }}
          />
        </div>
      </div>
    )

  return (
    <div className="mx-4 flex gap-4">
      <Input
        className="w-1/2"
        placeholder="Szukaj..."
        value={filters.search}
        onChange={(e) => handleOnChange("search", e.currentTarget.value)}
      />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild className="w-1/2">
          <Button variant="outline" className="justify-between">
            Zaawansowane
            <SettingsIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col gap-4 pb-10">
          <ScrollArea maxHeight="max-h-[70svh]">
            <MultiComboboxAcordion
              options={tags.filter(
                (tag) => tag.type?.toLocaleLowerCase() === "genre"
              )}
              values={tags.filter(
                (tag) =>
                  tag.type?.toLocaleLowerCase() === "genre" &&
                  filters.tagIds?.includes(tag.id)
              )}
              onValueChange={(val) => handleOnChange("tagIds", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Gatunki"}
              className="w-full"
            />
            <MultiComboboxAcordion
              options={tags.filter(
                (tag) => tag.type?.toLocaleLowerCase() === "theme"
              )}
              values={tags.filter(
                (tag) =>
                  tag.type?.toLocaleLowerCase() === "theme" &&
                  filters.tagIds?.includes(tag.id)
              )}
              onValueChange={(val) => handleOnChange("tagIds", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Motywy"}
              className="w-full"
            />
            <ComboboxAcordion
              options={mediaTypes}
              value={mediaTypes.filter((o) => filters.mediaTypeId == o.id)[0]}
              onValueChange={(val) => handleOnChange("mediaTypeId", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Rodzaj"}
              className="w-full"
            />
            <ComboboxAcordion
              options={studios}
              value={studios.filter((o) => filters.studioId == o.id)[0]}
              onValueChange={(val) => handleOnChange("studioId", val)}
              getId={(o) => o.id.toString()}
              getItem={(o) => o.name}
              placeholder={"Studio"}
              className="w-full"
            />
            <ComboboxAcordion
              options={[]}
              value={filters.startSeason}
              onValueChange={(val) => handleOnChange("startSeason", val)}
              getId={(o) => o.toString()}
              getItem={(o) => o}
              placeholder={"Rok | Sezon"}
              className="w-full"
            />
            <ComboboxAcordion
              options={[]}
              placeholder={"Sortuj wg"}
              className="w-full"
              getId={function (value: never): string {
                throw new Error("Function not implemented.")
              }}
              getItem={function (value: never): React.ReactNode {
                throw new Error("Function not implemented.")
              }}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
