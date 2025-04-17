"use client"

import Link from "next/link"
import { ANIDB_EPISODE_TYPES } from "@/constants/anidb"
import {
  importAnimeClient,
  importAnimeMutationRequestSchema,
} from "@/gen/anime"
import { geAniDBIdFromUrl, getMalIdFromUrl } from "@/helpers/anime-site"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleHelp } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { format } from "react-string-format"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnimeReqImportFormProps {
  request?: boolean
}

const formSchema = importAnimeMutationRequestSchema

function AnimeReqImportForm({ request = false }: AnimeReqImportFormProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      malId: "" as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aniDB: { episodeType: "" as any, id: "" as any },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise((resolve) =>
      toast.promise(importAnimeClient(values), {
        loading: "Importowanie Anime...",
        success: (res) => {
          resolve(false)
          return `Anime zostało zaimportowane pod id: ${res.data.id}`
        },
        error: () => {
          resolve(false)
          return "Nieznany błąd"
        },
      })
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="aniDB.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AniDB Id</FormLabel>
              <FormControl>
                <Input
                  placeholder="AniDB Id"
                  {...field}
                  onChange={(e) => {
                    let value: string | number = e.currentTarget.value

                    if (value.includes("anidb")) {
                      value = geAniDBIdFromUrl(value)
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
                    href="https://anidb.net"
                    target="_blank"
                    className="text-foreground hover:text-inherit"
                  >
                    AniDB
                  </Link>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aniDB.episodeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("anime_import.anidb_episode_type")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("anime_import.anidb_episode_type")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ANIDB_EPISODE_TYPES.map((type) => (
                    <SelectItem value={type} key={type}>
                      {t(`anidb.episode_type.${type.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="flex items-center">
                {format(
                  t("anime_import.anidb_episode_type_input_description"),
                  <AniDBEpisodeTypeTooltip />
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {t(
            request
              ? "anime_import.req_submit_text"
              : "anime_import.submit_text"
          )}
        </Button>
      </form>
    </Form>
  )
}

function AniDBEpisodeTypeTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp className="size-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="aspect-[602/150] h-32 overflow-hidden">
            <video
              src="http://localhost:8080/v1/storage/docs/anidb-episode-type"
              muted
              playsInline
              autoPlay
              loop
              className="h-full w-full object-cover"
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { AnimeReqImportForm }
