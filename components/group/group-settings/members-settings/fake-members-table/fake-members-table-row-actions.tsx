"use client"

import { useParams } from "next/navigation"
import { FansubService } from "@/services/client/fansub.service"
import { Row, Table } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"
import { toast } from "sonner"

import { FakeMember } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fansubService = new FansubService()

interface FakeMembersTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function FakeMembersTableRowActions({
  row,
  table,
}: FakeMembersTableRowActionsProps<FakeMember>) {
  const groupName = (useParams().groupName as string).replaceAll("_", " ")
  const userId = row.original.id

  const deleteFakeMember = () => {
    toast.promise(fansubService.deleteFakeMember(groupName, userId), {
      loading: "Usuwanie członka widmo z grupy...",
      success: (res) => {
        table.options.meta?.deleteFakeMemberRow?.(row.original)
        return "Członek widmo został usunięty z grupy"
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
        <DropdownMenuItem onClick={deleteFakeMember}>Usuń</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
