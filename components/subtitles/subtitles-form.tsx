"use client"

import { useEffect, useState } from "react"
import { FansubService } from "@/services/client/fansub.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Subtitle, Translation } from "@/types/fansub"
import { useAppSelector } from "@/lib/store/root-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const fansubService = new FansubService()

const ACCEPTED_FILES_TYPES = ["ass"]

const AddFormSchema = z.object({
  episodeNum: z.number({
    required_error: "Wybierz numer odcinka",
  }),
  groupName: z.string({
    required_error: "Wybierz grupę",
  }),
  description: z
    .string({
      required_error: "Dodaj opis",
    })
    .max(1024),
  file: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => file !== undefined, "Dodaj napisy")
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, 'Plik musi posiadać rozszerzenie ".ass".'),
  magnet: z
    .string({
      required_error: "Podaj magnet",
    })
    .refine(
      (magnet) => magnet.startsWith("magnet:?xt=") || magnet == "" || !magnet,
      "Link musi być magnet'em"
    )
    .nullable()
    .optional(),
})

const EditFormSchema = z.object({
  episodeNum: z.number({
    required_error: "Wybierz numer odcinka",
  }),
  groupName: z.string({
    required_error: "Wybierz grupę",
  }),
  description: z
    .string({
      required_error: "Dodaj opis",
    })
    .max(1024)
    .optional(),
  file: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => file !== undefined, "Dodaj napisy")
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, 'Plik musi posiadać rozszerzenie ".ass".')
    .nullable(),
  magnet: z
    .string({
      required_error: "Podaj magnet",
    })
    .refine(
      (magnet) => magnet.startsWith("magnet:?xt=") || magnet == "" || !magnet,
      "Link musi być magnet'em"
    )
    .nullable()
    .optional(),
})

interface AddSubtitlesFormProps {
  animeId: number
  episodesCount: number
  translations: Translation[]
}

export function SubtitlesForm({
  animeId,
  episodesCount,
  translations,
}: AddSubtitlesFormProps) {
  const [open, setOpen] = useState(false)
  const user = useAppSelector((state) => state.userStore.user)
  const [edit, setEdit] = useState(false)
  const [subs, setSubs] = useState<Subtitle[]>([])
  const form = useForm<z.infer<typeof AddFormSchema>>({
    resolver: zodResolver(edit ? EditFormSchema : AddFormSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      magnet: "",
      file: null,
    },
  })
  const episodeNum = form.watch("episodeNum")

  useEffect(() => {
    fansubService
      .getSubtitles(form.getValues().groupName, animeId)
      .then(({ data }) => setSubs(data))
  }, [form.getValues().groupName, setSubs])

  useEffect(() => {
    const sub = subs.filter((sub) => sub.episodeNum === episodeNum)[0]

    if (!sub) {
      form.setValue("description", "")
      form.setValue("magnet", "")
      form.setValue("file", null)
      setEdit(false)
      return
    }

    form.setValue("description", sub.description)
    form.setValue("magnet", sub.magnet)
    form.setValue("file", null)
    setEdit(true)
  }, [form, episodeNum, subs, setEdit])

  async function onSubmit(data: z.infer<typeof AddFormSchema>) {
    const formData = new FormData()
    const subBody: any = {}

    if (data.file)
      formData.append("file", new Blob([data.file]), data.file.name)

    if (data.description) subBody.description = data.description

    if (data.magnet) subBody.magnet = data.magnet

    formData.append("subtitles", JSON.stringify(subBody))

    await new Promise((resolve) => {
      toast.promise(
        edit
          ? fansubService.patchSubtitle(
              data.groupName,
              animeId,
              data.episodeNum,
              formData
            )
          : fansubService.addSubtitle(
              data.groupName,
              animeId,
              data.episodeNum,
              formData
            ),
        {
          loading: edit ? "Edytowanie napisów..." : "Dodawanie napisów...",
          success: () => {
            resolve(false)
            return edit
              ? "Napisy zostały zaktualizowane"
              : "Napisy zostały dodane"
          },
          error: () => {
            resolve(false)
            return "Nieznany błąd"
          },
        }
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="aspect-square p-0">
                  <Settings />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div>Zarządzaj napisami</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zarządzaj napisami</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupa</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz grupę" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Wybierz grupę</SelectLabel>
                            {translations
                              .filter(
                                ({ authors, group }) =>
                                  authors.some(
                                    ({ member }) => member.id === user?.id
                                  ) ||
                                  group.admins.some(({ id }) => id === user?.id)
                              )
                              .map(({ group }) => (
                                <SelectItem value={group.name} key={group.name}>
                                  {group.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="episodeNum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odcinek</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz odcinek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Wybierz odcinek</SelectLabel>
                            {[...new Array(episodesCount)].map((_, i) => (
                              <SelectItem value={(i + 1).toString()} key={i}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  const count = field.value?.length ?? 0

                  return (
                    <FormItem>
                      <FormLabel>Opis</FormLabel>
                      <FormControl>
                        <div>
                          <Textarea
                            {...field}
                            placeholder="Opis..."
                            className="h-40"
                            onChange={(e) =>
                              field.onChange(
                                e.currentTarget.value.substring(0, 1024)
                              )
                            }
                          />
                          <div className="text-right text-sm">{count}/1024</div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Napisy</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        onChange={(event) => {
                          field.onChange(event.target?.files?.[0] ?? undefined)
                        }}
                        accept=".ass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="magnet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Magnet (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Magnet..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button type="submit">{edit ? "Edytuj" : "Dodaj"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
