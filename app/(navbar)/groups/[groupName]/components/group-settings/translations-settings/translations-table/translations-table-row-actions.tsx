"use client"

import Link from "next/link"
import { Row, Table } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"

import { Translation } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TranslationsTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function TranslationsTableRowActions({
  row,
  table,
}: TranslationsTableRowActionsProps<Translation>) {
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
        <DropdownMenuItem
          onClick={() =>
            table.options.meta?.setEditForm?.(row.original.animeNode.id!)
          }
        >
          Edytuj
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/anime/${row.original.animeNode.id}/${row.original.animeNode.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}`}
          >
            Przejdź do serii
          </Link>
        </DropdownMenuItem>

        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>Usuń</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
