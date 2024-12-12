"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { FansubService } from "@/services/client/fansub.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Group } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

const fansubService = new FansubService()

const ACCEPTED_FILES_TYPES = ["png", "apng", "gif", "jpg", "jpeg", "webp"]

const FormSchema = z.object({
  profilePicture: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => file !== undefined, "Dodaj napisy")
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, "Plik musi być obrazem.")
    .nullable(),
  banner: (typeof window === "undefined" ? z.any() : z.instanceof(File))
    .refine((file) => file !== undefined, "Dodaj napisy")
    .refine((file) => {
      const fileExtension = file?.name.split(".").pop()
      return fileExtension && ACCEPTED_FILES_TYPES.includes(fileExtension)
    }, "Plik musi być obrazem.")
    .nullable(),
  description: z
    .string()
    .max(1024, { message: "Maksymalna długość opisu to 1024" })
    .optional()
    .nullable(),
})

interface ProfileSettingsProps {
  group: Group
}

export function ProfileSettings({ group }: ProfileSettingsProps) {
  const groupName = group.name
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      banner: null,
      profilePicture: null,
      description: group.description,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.profilePicture) {
      const formData = new FormData()
      formData.append(
        "file",
        new Blob([data.profilePicture]),
        data.profilePicture.name
      )

      await new Promise((resolve) =>
        toast.promise(fansubService.updateProfilePicture(groupName, formData), {
          loading: "Zmienianie zdjęcia profilowego...",
          success: () => {
            resolve(false)
            return `Zdjęcie profilowege zostało zmienione`
          },
          error: (err: AxiosError) => {
            resolve(false)
            return "Nieznany błąd"
          },
        })
      )
    }

    if (data.banner) {
      const formData = new FormData()
      formData.append("file", new Blob([data.banner]), data.banner.name)

      await new Promise((resolve) =>
        toast.promise(fansubService.updateBanner(groupName, formData), {
          loading: "Zmienianie baneru...",
          success: () => {
            resolve(false)
            return `Baner został zmieniony`
          },
          error: (err: AxiosError) => {
            resolve(false)
            return "Nieznany błąd"
          },
        })
      )
    }

    if (data.description !== group.description) {
      await new Promise((resolve) =>
        toast.promise(
          fansubService.patchGroup(groupName, {
            description: data.description || "",
          }),
          {
            loading: "Zmienianie profilu...",
            success: () => {
              resolve(false)
              return `Profil został zmieniony`
            },
            error: (err: AxiosError) => {
              resolve(false)
              return "Nieznany błąd"
            },
          }
        )
      )
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-1 basis-0 flex-col justify-between gap-4 overflow-hidden"
        >
          <ScrollArea>
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative block aspect-[4/1] w-full cursor-pointer overflow-hidden rounded-sm after:absolute after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-background/60 after:opacity-0 after:transition-opacity after:content-['Zmień_baner'] hover:after:opacity-100">
                    <Image
                      src={
                        !!field.value
                          ? URL.createObjectURL(new Blob([field.value]))
                          : group.bannerUrl
                      }
                      fill
                      alt=""
                      className="h-full w-full object-cover"
                    />
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
              name="profilePicture"
              render={({ field }) => (
                <FormItem className="-mt-20 ml-4">
                  <FormLabel className="relative block aspect-square w-24 cursor-pointer overflow-hidden rounded-sm after:absolute after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-background/60 after:text-center after:opacity-0 after:transition-opacity after:content-['Zmień_avatar'] hover:after:opacity-100">
                    <Image
                      src={
                        !!field.value
                          ? URL.createObjectURL(new Blob([field.value]))
                          : group.avatarUrl
                      }
                      alt=""
                      fill
                      className="h-full w-full object-cover"
                    />
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
              name="description"
              render={({ field }) => {
                const count = field.value?.length ?? 0

                return (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <div className="px-2">
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
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
          </ScrollArea>

          <div className="flex h-fit justify-end gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Zaktualizuj profil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
