"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { isNaN } from "lodash"
import { CalendarIcon, Clock, Dot, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Anime } from "@/types/anime"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const ACCEPTED_FILES_TYPES = ["png", "apng", "gif", "jpg", "jpeg", "webp"]

export const AnimeFormSchema = z.object({
  anime: z.object({
    id: z.number().nullable(),
    title: z.string(),
    alternativeTitles: z.object({
      jp: z.string().nullable(),
      en: z.string().nullable(),
      synonyms: z.array(z.string()),
    }),
    synopsis: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    malId: z.number().nullable(),
    nsfw: z.boolean(),
    hide: z.boolean(),
    numEpisodes: z.number().nullable(),
  }),
  //   broadcast: z.object({
  //     dayOfWeek: z.enum([
  //       "MONDAY",
  //       "TUESDAY",
  //       "WEDNESDAY",
  //       "THURSDAY",
  //       "FRIDAY",
  //       "SATURDAY",
  //       "SUNDAY",
  //     ]),
  //     time: z.date(),
  //   }),
  thumbnail: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, 'Plik musi posiadać rozszerzenie ".ass".')
    .nullable()
    .optional(),
  banner: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, 'Plik musi posiadać rozszerzenie ".ass".')
    .nullable()
    .optional(),
})

const defaultValues: Partial<Anime> = {
  id: null,
  title: "",
  alternativeTitles: {
    jp: null,
    en: null,
    synonyms: [],
  },
  synopsis: null,
  startDate: null,
  endDate: null,
  malId: null,
  nsfw: false,
  hide: true,
  numEpisodes: null,
}

interface AnimeFormProps {
  initAnime?: Partial<Anime>
  buttonSubmitText: string
  onSubmit: (
    data: z.infer<typeof AnimeFormSchema>,
    setSubmitDisabled: Dispatch<SetStateAction<boolean>>
  ) => void
}

export function AnimeForm({
  initAnime = defaultValues,
  buttonSubmitText,
  onSubmit,
}: AnimeFormProps) {
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const form = useForm<z.infer<typeof AnimeFormSchema>>({
    resolver: zodResolver(AnimeFormSchema),
    defaultValues: {
      anime: {
        ...defaultValues,
        ...(initAnime as z.infer<typeof AnimeFormSchema>["anime"]),
      },
      banner: null,
      thumbnail: null,
    },
  })

  const handleSubmit = (data: z.infer<typeof AnimeFormSchema>) =>
    onSubmit(data, setSubmitDisabled)

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="anime.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tytuł (romanji)</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.alternativeTitles.jp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tytuł (kanji)</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.alternativeTitles.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tytuł (angielski)</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.alternativeTitles.synonyms"
            render={({ field }) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [value, setValue] = useState("")

              const handleClick = () => {
                if (value === "") return

                if (!field.value.includes(value))
                  field.onChange([...field.value, value])

                setValue("")
              }

              return (
                <FormItem>
                  <FormLabel>Inne tytuły</FormLabel>
                  <FormControl>
                    <>
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          {...field}
                          onChange={(e) => setValue(e.currentTarget.value)}
                          value={value ?? ""}
                        />
                        <Button
                          type="button"
                          className="aspect-square p-2"
                          onClick={handleClick}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        {field.value?.map((title, i) => (
                          <span key={i} className="flex items-center gap-3">
                            <div className="flex">
                              <Dot />
                              <span>{title}</span>
                            </div>
                            <Button
                              variant="destructive"
                              type="button"
                              className="aspect-square h-8 p-2"
                              onClick={() =>
                                field.onChange([
                                  ...field.value.filter((t) => t !== title),
                                ])
                              }
                            >
                              <Trash2 />
                            </Button>
                          </span>
                        ))}
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="anime.synopsis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Początek transmisji</FormLabel>
                <div className="flex gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? new Date()}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        classNames={{
                          day_hidden: "invisible",
                          dropdown:
                            "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                          caption_dropdowns: "flex gap-3",
                          vhidden: "hidden",
                          caption_label: "hidden",
                        }}
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="relative w-full">
                    <Input
                      type="time"
                      onFocus={(e) => e.currentTarget.showPicker()}
                      value={
                        !!field.value
                          ? `${field.value.getHours().toString().padStart(2, "0")}:${field.value.getMinutes().toString().padStart(2, "0")}`
                          : ""
                      }
                      onChange={(e) => {
                        const time = e.currentTarget.value
                          .split(":")
                          .map((n) => parseInt(n))

                        field.value?.setHours(time[0])
                        field.value?.setMinutes(time[1])

                        field.onChange(field.value)
                      }}
                      className="cursor-pointer transition-colors [color-scheme:_dark] hover:bg-muted [&::-webkit-calendar-picker-indicator]:bg-none"
                    />
                    <Clock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Koniec transmisji</FormLabel>
                <div className="flex gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? new Date()}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        classNames={{
                          day_hidden: "invisible",
                          dropdown:
                            "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                          caption_dropdowns: "flex gap-3",
                          vhidden: "hidden",
                          caption_label: "hidden",
                        }}
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.numEpisodes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ilość odcinków</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      let val = e.currentTarget.value

                      if (!isNaN(parseInt(val))) field.onChange(parseInt(val))
                      if (val === "") field.onChange(null)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.malId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MAL id</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      let val = e.currentTarget.value
                      val = val
                        .replaceAll("https://myanimelist.net/anime/", "")
                        .split("/")[0]

                      if (!isNaN(parseInt(val))) field.onChange(parseInt(val))
                      if (val === "") field.onChange(null)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.nsfw"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>NSFW</FormLabel>
                  <FormControl>
                    <Switch
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anime.hide"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Ukryj</FormLabel>
                  <FormControl>
                    <Switch
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex h-60 w-full gap-3">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel className="flex h-full shrink-0 flex-col gap-2">
                    <span>Miniaturka</span>
                    <div className="relative block aspect-[146/212] h-full cursor-pointer overflow-hidden rounded-sm after:absolute after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-background/60 after:opacity-0 after:transition-opacity after:content-['Zmień_miniaturkę'] hover:after:opacity-100">
                      <img
                        src={
                          !!field.value
                            ? URL.createObjectURL(new Blob([field.value]))
                            : `http://beta.isekai.pl/api/v1/anime/${initAnime.id}/thumbnail`
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      accept="image/png, image/apng, image/gif, image/jpg, image/jpeg, image/webp"
                      onChange={(event) =>
                        field.onChange(event.target?.files?.[0] ?? undefined)
                      }
                      className="hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormLabel className="flex h-full w-full flex-col gap-2">
                    <span>Banner</span>
                    <div className="relative block h-full w-full cursor-pointer overflow-hidden rounded-md after:absolute after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-background/60 after:opacity-0 after:transition-opacity after:content-['Zmień_baner'] hover:after:opacity-100">
                      <img
                        src={
                          !!field.value
                            ? URL.createObjectURL(new Blob([field.value]))
                            : `http://beta.isekai.pl/api/v1/anime/${initAnime.id}/banner`
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      accept="image/png, image/apng, image/gif, image/jpg, image/jpeg, image/webp"
                      onChange={(event) =>
                        field.onChange(event.target?.files?.[0] ?? undefined)
                      }
                      className="hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormRootError />

          <Button type="submit" disabled={submitDisabled}>
            {buttonSubmitText}
          </Button>
        </form>
      </Form>
    </div>
  )
}
