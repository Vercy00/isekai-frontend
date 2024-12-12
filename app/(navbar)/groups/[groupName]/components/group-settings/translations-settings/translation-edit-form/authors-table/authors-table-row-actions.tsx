"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { FANSUB } from "@/const/fansub"
import { FansubService } from "@/services/client/fansub.service"
import { TRANSLATION } from "@/translations/pl-pl"
import { Row, Table } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"
import { toast } from "sonner"

import { TranslationAuthor } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fansubService = new FansubService()

interface AuthorsTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function AuthorsTableRowActions({
  row,
  table,
}: AuthorsTableRowActionsProps<TranslationAuthor>) {
  const groupName = (useParams().groupName as string).replaceAll("_", " ")
  const userId = row.original.member.id

  const switchRole = (role: string, shouldDelete: boolean) => {
    const animeId = table.options.meta?.authorsTable?.translation?.animeNode.id!
    toast.promise(
      shouldDelete
        ? fansubService.removeTranslationAuthorRole(
            groupName,
            animeId,
            userId,
            role
          )
        : fansubService.addTranslationAuthorRole(
            groupName,
            animeId,
            userId,
            role
          ),
      {
        loading: shouldDelete ? "Usuwanie roli..." : "Dodawanie roli...",
        success: (res) => {
          table.options.meta?.authorsTable?.setTranslation?.(res.data)
          return shouldDelete ? "Usunięto rolę" : "Dodano rolę"
        },
        error: (err) => {
          return "Nieznany błąd"
        },
      }
    )
  }

  const deleteAuthor = () => {
    const animeId = table.options.meta?.authorsTable?.translation?.animeNode.id!
    toast.promise(
      fansubService.removeTranslationAuthor(groupName, animeId, userId),
      {
        loading: "Usuwanie autora...",
        success: (res) => {
          table.options.meta?.authorsTable?.setTranslation?.(res.data)
          return "Usunięto autora"
        },
        error: (err) => {
          return "Nieznany błąd"
        },
      }
    )
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
            {FANSUB.AUTHOR_ROLES.map((role) => {
              const checked = row.original.roles.some(
                (mRole) => mRole === role.value
              )

              return (
                <DropdownMenuCheckboxItem
                  key={role.value}
                  checked={checked}
                  onCheckedChange={() => switchRole(role.value, checked)}
                >
                  {TRANSLATION.FANSUB_ROLES_TRANSLATION[role.value]}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <Link href={`/profile/${row.original.member.username}`}>
          <DropdownMenuItem>Profil</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteAuthor}>Usuń</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
