"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { FANSUB } from "@/const/fansub"
import { FansubService } from "@/services/client/fansub.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { Row, Table } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"
import { toast } from "sonner"

import { Member } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fansubService = new FansubService()

interface MembersTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function MembersTableRowActions({
  row,
  table,
}: MembersTableRowActionsProps<Member>) {
  const groupName = (useParams().groupName as string).replaceAll("_", " ")
  const userId = row.original.id

  const switchRole = (role: string, shouldDelete: boolean) => {
    toast.promise(
      shouldDelete
        ? fansubService.removeMemberRole(groupName, userId, role)
        : fansubService.addMemberRole(groupName, userId, role),
      {
        loading: shouldDelete ? "Usuwanie roli..." : "Dodawanie roli...",
        success: (res) => {
          table.options.meta?.updateMemberData?.(res.data as Member)
          return shouldDelete ? "Usunięto rolę" : "Dodano rolę"
        },
        error: (err) => {
          return "Nieznany błąd"
        },
      }
    )
  }

  const kickMember = () => {
    toast.promise(fansubService.kickMember(groupName, userId), {
      loading: "Usuwanie członka grupy...",
      success: (res) => {
        table.options.meta?.deleteMemberRow?.(row.original)
        return "Członek grupy został usunięty"
      },
      error: (res) => {
        return "Nieznany błąd"
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {FANSUB.ROLES.filter((role) => role.name !== "OWNER").map(
              (role) => {
                const checked = row.original.roles.some(
                  (mRole) => mRole.name === role.name
                )

                return (
                  <DropdownMenuCheckboxItem
                    key={role.name}
                    checked={checked}
                    onCheckedChange={() => switchRole(role.name, checked)}
                  >
                    {TRANSLATION.FANSUB_ROLES_TRANSLATION[role.name]}
                  </DropdownMenuCheckboxItem>
                )
              }
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <Link href={`/profile/${row.original.username}`}>
          <DropdownMenuItem>Profil</DropdownMenuItem>
        </Link>
        {(row.original.roles.length === 0 ||
          row.original.roles.some(
            (role) => role.name.toLocaleLowerCase() !== "owner"
          )) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={kickMember}>
              Wyrzuć
              {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
