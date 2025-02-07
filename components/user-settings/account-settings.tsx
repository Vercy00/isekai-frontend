"use client"

import Image from "next/image"
import { UserService } from "@/services/client/user.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useAppDispatch, useAppSelector } from "@/lib/store/root-store"
import { userActions } from "@/lib/store/user-slice"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const userService = new UserService()

const ACCEPTED_FILES_TYPES = ["png", "apng", "gif", "jpg", "jpeg", "webp"]

const FormSchema = z.object({
  avatar: (typeof window === "undefined" ? z.any() : z.instanceof(File))
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
  displayName: z
    .string()
    .min(4, { message: "Nazwa użytkownika musi zawierać conajmniej 3 znaki" }),
  description: z
    .string()
    .max(1024, { message: "Maksymalna długość opisu to 1024" })
    .optional()
    .nullable(),
})

export function AccountSettings() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.userStore.user)!
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      banner: null,
      avatar: null,
      displayName: user?.displayName ?? "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.avatar) {
      const formData = new FormData()
      formData.append("file", new Blob([data.avatar]), data.avatar.name)

      await new Promise((resolve) =>
        toast.promise(userService.updateProfilePicture(formData), {
          loading: "Zmienianie zdjęcia profilowego...",
          success: () => {
            resolve(false)
            return `Zdjęcie profilowe zostało zmienione`
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
        toast.promise(userService.updateBanner(formData), {
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

    if (
      (data.displayName && data.displayName !== user.displayName) ||
      data.description !== user.description
    ) {
      await new Promise((resolve) =>
        toast.promise(
          userService.patchProfile({
            description: data.description || "",
            displayName: data.displayName,
          }),
          {
            loading: "Zmienianie profilu...",
            success: () => {
              resolve(false)
              dispatch(userActions.setUserDisplayName(data.displayName))

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
          className="flex h-full flex-1 basis-0 flex-col justify-between gap-4"
        >
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:bg-background/60 relative block aspect-[4/1] w-full cursor-pointer overflow-hidden rounded-sm after:absolute after:top-0 after:left-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:opacity-0 after:transition-opacity after:content-['Zmień_baner'] hover:after:opacity-100">
                  <Image
                    src={
                      !!field.value
                        ? URL.createObjectURL(new Blob([field.value]))
                        : user.bannerUrl
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
            name="avatar"
            render={({ field }) => (
              <FormItem className="-mt-20 ml-4">
                <FormLabel className="after:bg-background/60 relative block aspect-square w-24 cursor-pointer overflow-hidden rounded-sm after:absolute after:top-0 after:left-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:text-center after:opacity-0 after:transition-opacity after:content-['Zmień_avatar'] hover:after:opacity-100">
                  <Image
                    src={
                      !!field.value
                        ? URL.createObjectURL(new Blob([field.value]))
                        : user.avatarUrl
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
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wyświetlana nazwa</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
                    <>
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
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

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
