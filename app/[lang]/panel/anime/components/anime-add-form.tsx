"use client"

import { Dispatch, SetStateAction } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { z } from "zod"

import { AnimeForm, AnimeFormSchema } from "./anime-form"

const animeService = new AnimeService()

export function AnimeAddForm() {
  function onSubmit(
    data: z.infer<typeof AnimeFormSchema>,
    setSubmitDisabled: Dispatch<SetStateAction<boolean>>
  ) {
    setSubmitDisabled(true)
    toast.promise(animeService.addAnime(data.anime), {
      loading: "Dodawanie anime...",
      success: (res) => {
        setSubmitDisabled(false)

        return `Anime zostało dodane pod url: ${res.headers.location}`
      },
      error: (err: AxiosError) => {
        setSubmitDisabled(false)

        if (err.response?.status === 409)
          return "Anime z tym tytułem już istnieje"

        return "Nieznany błąd"
      },
    })
  }

  return <AnimeForm onSubmit={onSubmit} buttonSubmitText="Dodaj" />
}
