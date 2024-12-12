"use client"

import Image from "next/image"
import { FansubService } from "@/services/client/fansub.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { FakeMember } from "@/types/fansub"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { FakeMembersTableRowActions } from "./fake-members-table-row-actions"

const fansubService = new FansubService()

const FormSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: "Wyświelana nazwa musi zawierać co najmniej 3 znaki" })
    .max(32, {
      message: "Wyświelana nazwa może zawierać co najwyżej 32 znaki",
    }),
})

export const columns: ColumnDef<FakeMember>[] = [
  {
    id: "profilePicture",
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square w-full overflow-hidden rounded-sm">
          <Image
            src="https://api.isekai.pl/v1/storage/avatars/1ca962ee-0fc0-409a-9924-20a019a23f41/672cc8a4184d425d16032ced"
            fill
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "name",
    header: ({ column }) => (
      <span>Wyświetlana nazwa</span>
      // <DataTableColumnHeader column={column} title="Wyświetlana nazwa" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {row.original.displayName}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    header: ({ table }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          displayName: "",
        },
        mode: "onChange",
      })

      async function onSubmit(data: z.infer<typeof FormSchema>) {
        const group = table.options.meta?.group!
        toast.promise(fansubService.addFakeMember(group.name, data), {
          loading: "Dodawanie członka widmo grupy...",
          success: (res) => {
            table.options.meta?.addFakeMemberData?.(res.data)
            return "Członek widmo został dodany"
          },
          error: (res) => {
            return "Nieznany błąd"
          },
        })
      }

      return (
        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={false}
              className="aspect-square w-fit border-none p-3"
            >
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] px-3" align="end" side="bottom">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
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

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Dodaj
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      )
    },
    cell: ({ row, table }) => (
      <div className="flex justify-end">
        <FakeMembersTableRowActions row={row} table={table} />
      </div>
    ),
  },
]
