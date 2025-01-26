import Image from "next/image"
import { FansubService } from "@/services/client/fansub.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { FakeMember, FakeTranslationAuthor } from "@/types/fansub"
import { DataTableColumnHeader } from "@/components/ui/advanced-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import { AuthorsTableRowActions } from "./fake-authors-table-row-actions"

const fansubService = new FansubService()

const getItem = (member: FakeMember) => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src="https://api.isekai.pl/v1/storage/avatars/1ca962ee-0fc0-409a-9924-20a019a23f41/672cc8a4184d425d16032ced" />
      <AvatarFallback>{member.displayName.substring(0, 1)}</AvatarFallback>
    </Avatar>
    <span>{member.displayName}</span>
  </div>
)

export const columns: ColumnDef<FakeTranslationAuthor>[] = [
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
    size: 250,
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wyświetlana nazwa" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {row.original.member.displayName}
          </span>
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "roles",
    header: ({ column }) => <span>Role</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 w-full max-w-[500px] truncate text-pretty font-medium">
            {row.original.roles
              .map((role) => TRANSLATION.FANSUB_ROLES_TRANSLATION[role])
              .join(", ") || "Brak"}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    header: ({ table }) => {
      const { translation, group } = table.options.meta?.authorsTable!

      const updateAuthors = (member: FakeMember) => {
        toast.promise(
          fansubService.addFakeTranslationAuthor(
            group!.name,
            translation!.animeNode!.id!,
            member.id
          ),
          {
            loading: "Dodawanie autora...",
            success: (res) => {
              table.options.meta?.authorsTable?.setTranslation?.(res.data)
              return "Dodano autora"
            },
            error: (err) => {
              return "Nieznany błąd"
            },
          }
        )
      }

      return (
        <Popover>
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
          <PopoverContent className="w-[200px] p-0" align="end" side="bottom">
            <Command>
              <CommandInput placeholder="Wyszukaj..." />
              <CommandList>
                <CommandEmpty>Brak wyników.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea maxHeight="max-h-40">
                    {group!.fakeMembers
                      .filter(
                        (m) =>
                          !translation?.fakeAuthors
                            .map((a) => a.member.id)
                            .includes(m.id)
                      )
                      .map((member) => (
                        <CommandItem
                          key={member.id}
                          onSelect={() => updateAuthors(member)}
                        >
                          <span>{getItem(member)}</span>
                        </CommandItem>
                      ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    },
    cell: ({ row, table }) => (
      <div className="flex justify-end">
        <AuthorsTableRowActions row={row} table={table} />
      </div>
    ),
  },
]
