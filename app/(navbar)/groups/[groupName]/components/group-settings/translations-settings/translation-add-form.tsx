"use client"

import { useEffect, useRef, useState } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { FansubService } from "@/services/client/fansub.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounce } from "@uidotdev/usehooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Anime } from "@/types/anime"
import { Group } from "@/types/fansub"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SimpleAnimeCard } from "@/components/anime-card"
import { AnimeThumbnail } from "@/components/anime-thumbnail"

const animeService = new AnimeService()
const fansubService = new FansubService()

const FormSchema = z.object({
  animeId: z.number({ invalid_type_error: "Wybierz serię" }),
})

interface TranslationAddFormProps {
  onClose: () => void
  group: Group
}

export function TranslationAddForm({
  onClose,
  group,
}: TranslationAddFormProps) {
  const [search, setSearch] = useState("")
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const debouncedSearch = useDebounce(search, 200)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      animeId: undefined,
    },
    mode: "onChange",
  })
  const collisionBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    form.setValue("animeId", parseInt(""))

    animeService
      .searchAnimeList({ search: debouncedSearch, size: 10 })
      .then(({ data }) => setAnimeList(data.content))
  }, [debouncedSearch, setAnimeList])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise((resolve) =>
      toast.promise(fansubService.addTranslation(group.name, data.animeId), {
        loading: "Dodawanie serii...",
        success: () => {
          resolve(true)
          onClose()
          return `Seria została dodana`
        },
        error: (err) => {
          resolve(false)
          return "Nieznany błąd"
        },
      })
    )
  }

  return (
    <div className="flex h-full flex-col gap-3" ref={collisionBox}>
      <Input
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Szukaj..."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-1 basis-0 flex-col justify-between gap-4 overflow-hidden"
        >
          <ScrollArea>
            <FormField
              control={form.control}
              name="animeId"
              render={({ field }) => (
                <FormItem className="h-full py-2">
                  <FormControl>
                    <RadioGroup
                      {...field}
                      value={field.value?.toString()}
                      onChange={() => {}}
                      onValueChange={(e) => field.onChange(parseInt(e))}
                      className="grid grid-cols-[repeat(auto-fill,max(100px,_calc(25%-0.25rem)))] items-start justify-between gap-x-0 gap-y-3 px-2"
                    >
                      {animeList.map((anime, i) => (
                        <RadioGroupItem
                          key={i}
                          value={anime.id!.toString()}
                          radioItemType="tab"
                          className={cn(
                            "relative block cursor-pointer whitespace-normal text-left transition-none",
                            anime.id === field.value &&
                              "outline outline-primary"
                          )}
                        >
                          <SimpleAnimeCard
                            anime={anime}
                            key={i}
                            as="div"
                            collisionBox={collisionBox.current}
                            className="h-auto w-full scale-95 md:hover:scale-100"
                          />
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </ScrollArea>

          <div className="flex h-fit justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button disabled={Number.isNaN(form.getValues().animeId)}>
              Dodaj
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
