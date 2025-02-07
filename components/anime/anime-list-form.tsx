"use client"

import { useEffect, useState } from "react"
import { ANIME_LIST_STATUS } from "@/constants/anime-list-status"
import { useAnime, useUserList } from "@/contexts/local/anime"
import { AnimeService } from "@/services/client/anime.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { Heart, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UserList, UserListReq } from "@/types/anime"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const animeService = new AnimeService()

const FormSchema = z.object({
  watchedEpisodes: z.number(),
  status: z.string(),
})

export function AnimeListForm() {
  const { id: animeId, numEpisodes } = useAnime()
  const { userList, setUserList } = useUserList()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      watchedEpisodes: userList.watchedEpisodes,
      status: userList.status ?? "WATCHING",
    },
  })

  useEffect(() => {
    form.setValue("watchedEpisodes", userList.watchedEpisodes)
    form.setValue("status", userList.status ?? "WATCHING")
  }, [userList])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise((resolve) =>
      toast.promise(
        animeService.patchUserStatus(animeId, data as Partial<UserList>),
        {
          loading: !userList.status
            ? "Dodawanie do listy..."
            : "Aktualizowanie listy...",
          success: (res) => {
            resolve(false)
            setUserList(res.data!)
            setOpen(false)

            return !userList.status
              ? "Dodano do listy"
              : "Lista została zaktualizowana"
          },
          error: (err: AxiosError) => {
            resolve(false)

            return "Nieznany błąd"
          },
        }
      )
    )
  }

  function addToFavorite() {
    new Promise((resolve) =>
      toast.promise(animeService.addToFavorite(animeId, !userList.favorite), {
        loading: userList.favorite
          ? "Usuwanie z ulubionych..."
          : "Dodawanie do ulubionych...",
        success: (res) => {
          resolve(false)
          setUserList(res.data!)

          return userList.favorite
            ? "Usunięto z ulubionych"
            : "Dodano do ulubionych"
        },
        error: (err: AxiosError) => {
          resolve(false)

          return "Nieznany błąd"
        },
      })
    )
  }

  function deleteUserList() {
    new Promise((resolve) =>
      toast.promise(animeService.deleteUserListStatus(animeId), {
        loading: "Usuwanie z listy...",
        success: (res) => {
          resolve(false)
          setUserList(res.data!)
          setOpen(false)

          return "Usunięto z listy"
        },
        error: (err: AxiosError) => {
          resolve(false)

          return "Nieznany błąd"
        },
      })
    )
  }

  return (
    <div className="flex gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            {!userList.status ? "Dodaj do listy" : "Edytuj listę"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit">
          <Form {...form}>
            <DialogHeader>
              <DialogHeader>
                <DialogTitle>
                  {!userList.status ? "Dodaj do listy" : "Edytuj listę"}
                </DialogTitle>
              </DialogHeader>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}
                        className="bg-muted text-muted-foreground flex h-10 items-center justify-center rounded-md p-1"
                      >
                        {ANIME_LIST_STATUS.STATUS.map((status) => (
                          <div
                            className="flex w-full items-center space-x-2"
                            key={status.name}
                          >
                            <RadioGroupItem
                              key={status.name}
                              value={status.name}
                              id={status.name}
                              radioItemType="tab"
                              className="w-full"
                            >
                              {TRANSLATION.ANIME_LIST_STATUS[status.name]}
                            </RadioGroupItem>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="watchedEpisodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obejrzane odcinki</FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        <div className="relative w-fit">
                          <Input
                            type="text"
                            {...field}
                            onChange={(e) => {
                              const val = e.currentTarget.value

                              if (val === "") field.onChange(0)

                              if (!isNaN(parseInt(val)))
                                field.onChange(
                                  numEpisodes
                                    ? Math.min(parseInt(val), numEpisodes)
                                    : parseInt(val)
                                )
                            }}
                            className="w-48 pr-[6.75rem] pl-3 text-center"
                          />
                          <span className="pointer-events-none absolute top-0 right-0 flex h-full w-24 items-center justify-center border-l p-3 text-sm">
                            {numEpisodes || "N/A"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          className="aspect-square overflow-hidden p-2"
                          onClick={() =>
                            field.onChange(
                              numEpisodes
                                ? Math.min(field.value + 1, numEpisodes)
                                : field.value
                            )
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                {!!userList.status && (
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={form.formState.isSubmitting}
                    onClick={deleteUserList}
                  >
                    Usuń
                  </Button>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {!userList.status ? "Dodaj" : "Edytuj"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Button className="aspect-square p-2" onClick={addToFavorite}>
        <Heart
          className={cn(
            "transition-all",
            userList.favorite && "fill-red-500 text-red-500"
          )}
        />
      </Button>
    </div>
  )
}
