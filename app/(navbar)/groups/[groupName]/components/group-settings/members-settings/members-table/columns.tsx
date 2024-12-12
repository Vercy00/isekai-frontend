"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FansubService } from "@/services/client/fansub.service"
import { UserService } from "@/services/client/user.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { ColumnDef } from "@tanstack/react-table"
import { useDebounce } from "@uidotdev/usehooks"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Group, Member } from "@/types/fansub"
import { User } from "@/types/user"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import { MembersTableRowActions } from "./members-table-row-actions"

const userService = new UserService()

const getItem = (user: User) => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src={user.avatarUrl} />
      <AvatarFallback>{user.displayName.substring(0, 1)}</AvatarFallback>
    </Avatar>
    <span>{user.displayName}</span>
  </div>
)

export const columns: ColumnDef<Member>[] = [
  {
    id: "profilePicture",
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square w-full overflow-hidden rounded-sm">
          <Image
            src={row.original.avatarUrl}
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
    size: -1,
    accessorKey: "roles",
    header: ({ column }) => <span>Role</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 w-full max-w-[500px] truncate text-pretty font-medium">
            {row.original.roles
              .map((role) => TRANSLATION.FANSUB_ROLES_TRANSLATION[role.name])
              .join(", ")}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    header: ({ table }) => {
      const group = table.options.meta?.group!
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [users, setUsers] = useState<User[]>([])
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [search, setSearch] = useState("")
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const debouncedFilters = useDebounce(search, 200)

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        userService
          .findUsers(debouncedFilters)
          .then((res) => setUsers(res.data))
      }, [debouncedFilters])

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
          <PopoverContent className="w-[200px] p-0" align="end" side="bottom">
            <Command>
              <CommandInput
                onValueChange={setSearch}
                placeholder="Wyszukaj..."
              />
              <CommandList>
                <CommandEmpty>Brak wyników.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea maxHeight="max-h-40">
                    {users
                      .filter((user) =>
                        table
                          .getRowModel()
                          .rows.every(
                            (row) => row.original.username !== user.username
                          )
                      )
                      .map((user, i) => (
                        <UserItem user={user} group={group} key={i} />
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
        <MembersTableRowActions row={row} table={table} />
      </div>
    ),
  },
]

interface UserItemProps {
  user: User
  group: Group
}

const fansubService = new FansubService()

function UserItem({ user, group }: UserItemProps) {
  const [open, setOpen] = useState(false)

  const inviteMember = () => {
    toast.promise(fansubService.inviteMember(group.name, user.id), {
      loading: "Wysyłanie zaproszenia...",
      success: (res) => {
        setOpen(false)
        return "Zaproszenie zostało wysłane"
      },
      error: (err) => {
        return "Nieznany błąd"
      },
    })
  }

  return (
    <Dialog key={user.displayName} open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full" asChild>
        <div>
          <CommandItem value={user.displayName}>
            <span>{getItem(user)}</span>
          </CommandItem>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaproszenie</DialogTitle>
        </DialogHeader>

        <div>
          Czy chcesz zaprosić użytkownika{" "}
          <span className="font-semibold text-primary">
            {user.displayName} ({user.username})
          </span>{" "}
          do grupy{" "}
          <span className="font-semibold text-primary">{group.name}</span>?
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={inviteMember}>Wyślij zaproszenie</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
