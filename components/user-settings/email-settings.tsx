"use client"

import { useState } from "react"
import { UserService } from "@/services/client/user.service"
import { useAppSelector } from "@/store/root-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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

const userService = new UserService()

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export function EmailSettings() {
  const user = useAppSelector((state) => state.userStore.user)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email ?? "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise((resolve) =>
      toast.promise(
        userService.changeEmail(data, user!.id.replaceAll("-", "")),
        {
          loading: "Aktualizowanie danych...",
          success: () => {
            resolve(false)
            return `Email został zmieniony`
          },
          error: (err) => {
            resolve(false)
            return "Nieznany błąd"
          },
        }
      )
    )
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-1 basis-0 flex-col justify-between gap-4"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex h-fit justify-end gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Zmień email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
