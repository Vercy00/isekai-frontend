"use client"

import { useMemo, useState } from "react"
import { ANIME } from "@/constants/anime"
import { useUserList } from "@/contexts/local/anime"
import { useAnime } from "@/contexts/local/anime/use-anime"
import {
  deleteMyListStatusScoreClient,
  patchMyListStatusClient,
  patchMyListStatusMutationRequestSchema,
  ScoreReq,
} from "@/gen/anime"
import { TRANSLATION } from "@/translations/pl-pl"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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

// const FormSchema = z.object({
//   score: z.object({
//     animation: z
//       .number()
//       .min(1, { message: "Ocena musi wynosić conajmniej 1" })
//       .max(10),
//     music: z
//       .number()
//       .min(1, { message: "Ocena musi wynosić conajmniej 1" })
//       .max(10),
//     plot: z
//       .number()
//       .min(1, { message: "Ocena musi wynosić conajmniej 1" })
//       .max(10),
//     characters: z
//       .number()
//       .min(1, { message: "Ocena musi wynosić conajmniej 1" })
//       .max(10),
//   }),
// })

const formSchema = patchMyListStatusMutationRequestSchema

export function ScoreForm() {
  const { id: animeId } = useAnime()
  const { userList, setUserList } = useUserList()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: {
        ...(userList.score || {
          animation: 0,
          characters: 0,
          music: 0,
          plot: 0,
        }),
      },
    },
    mode: "onChange",
  })
  const score = form.watch("score")!
  const mean = useMemo(() => {
    return (
      Object.entries(score)
        .filter(([key]) => key !== "mean")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, value]) => value)
        .reduce((p, n) => p + n, 0) / 4
    )
  }, [score])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await new Promise((resolve) =>
      toast.promise(patchMyListStatusClient({ animeId }, data), {
        loading: userList.score
          ? "Dodawanie oceny..."
          : "Aktualizowanie oceny...",
        success: (res) => {
          resolve(false)
          setUserList(res.data!)
          setOpen(false)

          return userList.score
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
      toast.promise(deleteMyListStatusScoreClient({ animeId }), {
        loading: "Usuwanie oceny...",
        success: (res) => {
          resolve(false)
          setUserList(res.data!)
          setOpen(false)
          return "Ocena została usunięta"
        },
        error: (err: AxiosError) => {
          resolve(false)
          return "Nieznany błąd"
        },
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{!userList.score ? "Dodaj ocenę" : "Zmień ocenę"}</Button>
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
                name={`score.${score.name as keyof ScoreReq}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      {TRANSLATION.ANIME_SCORE[score.name]}
                      <span className="text-muted-foreground w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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
              {!!userList.score && (
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
                {!userList.score ? "Dodaj" : "Edytuj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
