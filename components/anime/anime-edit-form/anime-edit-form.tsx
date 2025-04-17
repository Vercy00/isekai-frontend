"use client"

import Image from "next/image"
import Link from "next/link"
import { getMalIdFromUrl } from "@/helpers/anime-site"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { format } from "react-string-format"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { animeEditSchema } from "./anime-edit-schema"

interface AnimeEditFormProps {
  request?: boolean
}

function AnimeEditForm({ request }: AnimeEditFormProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof animeEditSchema>>({
    resolver: zodResolver(animeEditSchema),
    defaultValues: {
      title: "",
      alternativeTitles: {
        en: null,
        jp: null,
        synonyms: [],
      },
      startDate: null,
      endDate: null,
      synopsis: null,
      nsfw: false,
      malId: null,
      hide: false,
      numEpisodes: null,
      thumbnail: null,
      banner: null,
    },
  })
  const { fields, append, remove } = useFieldArray({
    name: "alternativeTitles.synonyms",
    control: form.control,
  })

  function onSubmit(values: z.infer<typeof animeEditSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("anime_edit.title")} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.title_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternativeTitles.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.alternative_titles_en")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("anime_edit.alternative_titles_en")}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternativeTitles.jp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.alternative_titles_jp")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("anime_edit.alternative_titles_jp")}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.alternative_titles_jp_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        {fields.map((field, i) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`alternativeTitles.synonyms.${i}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(i !== 0 && "sr-only")}>
                  {t("anime_edit.alternative_titles_synonyms")}
                </FormLabel>
                <FormDescription className={cn(i !== 0 && "sr-only")}>
                  {t("anime_edit.alternative_titles_synonyms_description")}
                </FormDescription>
                <FormControl>
                  <div className="flex gap-3">
                    <Input
                      placeholder={t(
                        "anime_edit.alternative_titles_synonyms_field"
                      )}
                      {...field}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => remove(i)}
                      className="aspect-square overflow-hidden"
                    >
                      <X />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div>
          <Button type="button" onClick={() => append({ value: "" })}>
            {t("anime_edit.alternative_titles_synonyms_add")}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="synopsis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.synopsis")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("anime_edit.synopsis")}
                  {...field}
                  value={field.value ? field.value : undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.start_date")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  {...field}
                  value={field.value ? field.value : undefined}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.start_date_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.end_date")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  {...field}
                  value={field.value ? field.value : undefined}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.end_date_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numEpisodes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.num_episodes")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("anime_edit.num_episodes")}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.num_episodes_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="malId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAL Id</FormLabel>
              <FormControl>
                <Input
                  placeholder="MAL Id"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    let value: string | number = e.currentTarget.value

                    if (value.includes("myanimelist")) {
                      value = getMalIdFromUrl(value)
                    }

                    if (!isNaN(+value)) {
                      value = +value
                    }

                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormDescription>
                {format(
                  t("anime_import.id_input_description"),
                  <Link
                    href="https://myanimelist.net"
                    target="_blank"
                    className="text-foreground hover:text-inherit"
                  >
                    MyAnimeList
                  </Link>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nsfw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.nsfw")}</FormLabel>
              <FormControl>
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hide"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_edit.hide")}</FormLabel>
              <FormControl>
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("anime_edit.hide_description")}
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="grid">
                <div>{t("anime_edit.thumbnail")}</div>
                <div
                  className={cn(
                    "border-primary after:bg-background/60 aspect-anime-thumbnail relative block w-46 cursor-pointer overflow-hidden rounded-md border-4 after:absolute after:top-0 after:left-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:text-center after:opacity-0 after:transition-opacity hover:after:opacity-100",
                    `after:content-['${t("anime_edit.change_thumbnail").replaceAll(" ", "_")}']`
                  )}
                >
                  <Image
                    src={
                      field.value
                        ? URL.createObjectURL(new Blob([field.value]))
                        : "/not-----" // TODO: Current Anime Thumbnail
                    }
                    fill
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
                  accept="image/png, image/apng, image/gif, image/jpg, image/jpeg"
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
            <FormItem>
              <FormLabel className="grid">
                <div>{t("anime_edit.banner")}</div>
                <div
                  className={cn(
                    "border-primary after:bg-background/60 relative block aspect-video h-[clamp(1_rem,calc(var(--spacing)_*_96),calc(var(--spacing)_*_96))] max-h-96 max-w-lvw cursor-pointer overflow-hidden rounded-md border-4 after:absolute after:top-0 after:left-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:text-center after:opacity-0 after:transition-opacity hover:after:opacity-100",
                    `after:content-['${t("anime_edit.change_banner").replaceAll(" ", "_")}']`
                  )}
                >
                  <Image
                    src={
                      field.value
                        ? URL.createObjectURL(new Blob([field.value]))
                        : "/not-----" // TODO: Current Anime Thumbnail
                    }
                    fill
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
                  accept="image/png, image/apng, image/gif, image/jpg, image/jpeg"
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

        <Button type="submit">
          {t(request ? "anime_edit.req_submit_text" : "anime_edit.submit_text")}
        </Button>
      </form>
    </Form>
  )
}

export { AnimeEditForm }
