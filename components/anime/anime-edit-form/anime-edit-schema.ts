import { z } from "zod"

const ACCEPTED_FILES_TYPES = ["png", "apng", "gif", "jpg", "jpeg", "webp"]

const alternativeTitles = z.object({
  jp: z.string().nullable(),
  en: z.string().nullable(),
  synonyms: z.array(
    z.object({ value: z.string().min(1, "validation.not_blank") })
  ),
})

const animeEditSchema = z.object({
  title: z.string().min(1, "validation.not_blank"),
  alternativeTitles,
  synopsis: z.string().min(1, "validation.not_blank").nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  numEpisodes: z.number().nullable(),
  malId: z.number().nullable(),
  nsfw: z.boolean(),
  hide: z.boolean(),
  thumbnail: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, "validation.file_image")
    .nullable()
    .optional(),
  banner: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, "validation.file_image")
    .nullable()
    .optional(),
})

export { animeEditSchema }
