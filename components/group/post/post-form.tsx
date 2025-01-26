"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FansubService } from "@/services/client/fansub.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Post } from "@/types/fansub"
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
import { ScrollAreaEditable } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

const fansubService = new FansubService()

const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
  pinned: z.boolean(),
})

export function PostForm() {
  const { groupName } = useParams()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      pinned: false,
    },
    mode: "onChange",
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise((resolve) =>
      toast.promise(
        fansubService.addPost(
          (groupName as string).replaceAll("_", " "),
          data as Partial<Post>
        ),
        {
          loading: "Dodawanie wpisu...",
          success: (res) => {
            resolve(false)
            setOpen(false)

            return "Dodano wpis"
          },
          error: (err: AxiosError) => {
            resolve(false)

            return "Nieznany błąd"
          },
        }
      )
    )

    // toast.promise(
    //   addPost(
    //     (groupName as string).replaceAll("_", " "),
    //     data as Partial<Post>
    //   ),
    //   {
    //     loading: "Dodawanie wpisu...",
    //     success: (res) => {
    //       console.log(res)
    //       setSubmitDisabled(false)
    //       setOpen(false)

    //       return "Dodano wpis"
    //     },
    //     error: (err: AxiosError) => {
    //       setSubmitDisabled(false)

    //       return "Nieznany błąd"
    //     },
    //   }
    // )
  }

  return (
    <Dialog open={open} /*onOpenChange={setOpen}*/>
      <DialogTrigger asChild>
        <div className="p-2">
          <Button variant="outline" className="w-full" disabled>
            Dodaj wpis
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>{true ? "Dodaj wpis" : "Edytuj wpis"}</DialogTitle>
            </DialogHeader>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wpis</FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      <ScrollAreaEditable
                        className="max-h-40"
                        field={{
                          ...field,
                          onChange: (e: string) => field.onChange(e),
                        }}
                        limit={4096}
                      />
                      <span className="text-right text-sm">
                        {field.value.length}/4096
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel>Przypięte</FormLabel>
                    <FormControl>
                      <Switch
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {true ? "Dodaj" : "Edytuj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
