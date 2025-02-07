"use client"

import { Dispatch, SetStateAction } from "react"
import { AnimeService } from "@/services/client/anime.service"
import { toast } from "sonner"
import { z } from "zod"

import { Anime } from "@/types/anime"

import { AnimeForm, AnimeFormSchema } from "../../components/anime-form"

const animeService = new AnimeService()

interface AnimeEditFormProps {
  initAnime: Anime
}

export function AnimeEditForm({ initAnime }: AnimeEditFormProps) {
  function onSubmit(
    data: z.infer<typeof AnimeFormSchema>,
    setSubmitDisabled: Dispatch<SetStateAction<boolean>>
  ) {
    setSubmitDisabled(true)
    const promises = [animeService.patchAnime(initAnime.id!, data.anime)]

    if (data.thumbnail && data.anime.id) {
      const formData = new FormData()
      formData.append("file", new Blob([data.thumbnail]), data.thumbnail.name)

      promises.push(animeService.updateThumbnail(data.anime.id, formData))
    }

    if (data.banner && data.anime.id) {
      const formData = new FormData()
      formData.append("file", new Blob([data.banner]), data.banner.name)

      promises.push(animeService.updateBanner(data.anime.id, formData))
    }

    toast.promise(Promise.all(promises), {
      loading: "Aktualizowanie anime...",
      success: () => {
        setSubmitDisabled(false)

        return `Anime "${initAnime.title}" zostało zaktualizowane`
      },
      error: () => {
        setSubmitDisabled(false)

        return "Nieznany błąd"
      },
    })
  }

  return (
    <AnimeForm
      onSubmit={onSubmit}
      initAnime={initAnime}
      buttonSubmitText="Edytuj"
    />
  )
}
