import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Translation } from "@/types/fansub"
import { DataTableColumnHeader } from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { AnimeThumbnail } from "@/components/anime-thumbnail"

import { STATUSES } from "../../../group-list-tab"
import { TranslationsTableRowActions } from "./translations-table-row-actions"

export const columns: ColumnDef<Translation>[] = [
  {
    id: "thumbnail",
    size: 100,
    cell: ({ row }) => {
      return (
        <Link
          href={`/anime/${row.original.animeNode.id}/${row.original.animeNode.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}?group=${row.original.group.name}`}
        >
          <AnimeThumbnail
            thumbnailUrl={row.original.animeNode!.thumbnailUrl}
            className="h-24 w-auto rounded-sm"
          />
        </Link>
      )
    },
  },
  {
    size: -1,
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tytuł" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[200px] truncate whitespace-normal font-medium">
            <Link
              href={`/anime/${row.original.animeNode.id}/${row.original.animeNode.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}?group=${row.original.group.name}`}
            >
              {row.original.animeNode!.title}
            </Link>
          </span>
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "authors",
    header: ({ column }) => (
      <span>Autorzy</span>
      // <DataTableColumnHeader column={column} title="Autorzy" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[200px] truncate whitespace-normal font-medium">
            {row.original.authors
              .map((author) => author.member.displayName)
              .join(", ") || "Brak autorów"}
          </span>
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {STATUSES[row.original.status]}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    header: ({ table }) => (
      <Button
        variant="outline"
        onClick={table.options.meta?.openAddForm}
        className="aspect-square w-fit border-none p-3"
      >
        <Plus />
      </Button>
    ),
    cell: ({ row, table }) => (
      <div className="flex justify-end">
        <TranslationsTableRowActions row={row} table={table} />
      </div>
    ),
  },
]
