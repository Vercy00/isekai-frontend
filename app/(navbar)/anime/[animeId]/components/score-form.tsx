"use client"

import { useMemo, useState } from "react"
import { ANIME } from "@/const/anime"
import { AnimeService } from "@/services/client/anime.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UserList } from "@/types/anime"
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
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const animeService = new AnimeService()

const FormSchema = z.object({
  score: z.object({
    animation: z
      .number()
      .min(1, { message: "Ocena musi wynosić conajmniej 1" })
      .max(10),
    music: z
      .number()
      .min(1, { message: "Ocena musi wynosić conajmniej 1" })
      .max(10),
    plot: z
      .number()
      .min(1, { message: "Ocena musi wynosić conajmniej 1" })
      .max(10),
    characters: z
      .number()
      .min(1, { message: "Ocena musi wynosić conajmniej 1" })
      .max(10),
  }),
})

interface ScoreFormProps {
  animeId: number
  userList?: UserList
  setUserList: React.Dispatch<React.SetStateAction<UserList | undefined>>
}

const defaultScore = {
  animation: 0,
  characters: 0,
  music: 0,
  plot: 0,
}

const defaultUserList: UserList = {
  watchedEpisodes: 0,
  score: null,
  status: null,
  favorite: false,
}

export function ScoreForm({
  animeId,
  userList = defaultUserList,
  setUserList,
}: ScoreFormProps) {
  const [open, setOpen] = useState(false)
  const [userListState, setUserListState] = useState(userList)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      score: {
        ...(userListState.score || defaultScore),
      },
    },
    mode: "onChange",
  })
  const score = form.watch("score")
  const mean = useMemo(() => {
    return (
      Object.entries(score)
        .filter(([key, _]) => key !== "mean")
        .map(([_, value]) => value)
        .reduce((p, n) => p + n, 0) / 4
    )
  }, [score.animation, score.characters, score.music, score.plot])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise((resolve) =>
      toast.promise(animeService.patchUserStatus(animeId, data), {
        loading: userListState.score
          ? "Dodawanie oceny..."
          : "Aktualizowanie oceny...",
        success: (res) => {
          resolve(false)
          setUserListState(res.data!)
          setUserList(res.data!)
          setOpen(false)

          return userListState.score
            ? "Ocena została dodana"
            : "Ocena została zaktualizowana"
        },
        error: (err: AxiosError) => {
          resolve(false)

          return "Nieznany błąd"
        },
      })
    )
  }

  function deleteScore() {
    new Promise((resolve) =>
      toast.promise(
        animeService.patchUserStatus(animeId, {
          score: { animation: 0, characters: 0, music: 0, plot: 0 },
        }),
        {
          loading: "Usuwanie oceny...",
          success: (res) => {
            resolve(false)
            setUserList((list) => (list ? { ...list, score: null } : undefined))
            setOpen(false)
            return "Ocena została usunięta"
          },
          error: (err: AxiosError) => {
            resolve(false)
            return "Nieznany błąd"
          },
        }
      )
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{!userListState.score ? "Dodaj ocenę" : "Zmień ocenę"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ocena</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {ANIME.SCORE.map((score) => (
              <FormField
                key={score.name}
                control={form.control}
                name={`score.${score.name as keyof z.infer<typeof FormSchema>["score"]}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      {TRANSLATION.ANIME_SCORE[score.name]}
                      <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground">
                        {field.value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        max={10}
                        step={1}
                        {...field}
                        value={[field.value]}
                        onChange={() => {}}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mean">Średnia</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {mean}
                </span>
              </div>
              <Slider
                id="mean"
                max={10}
                value={[mean]}
                step={0.01}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="mean"
              />
            </div>

            <DialogFooter>
              {!!userListState.score && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={form.formState.isSubmitting}
                  onClick={deleteScore}
                >
                  Usuń
                </Button>
              )}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {!userListState.score ? "Dodaj" : "Edytuj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
