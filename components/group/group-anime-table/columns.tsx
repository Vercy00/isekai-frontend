import Link from "next/link"
import { TRANSLATION } from "@/translations/pl-pl"
import { ColumnDef } from "@tanstack/react-table"

import { Translation } from "@/types/fansub"
import { DataTableColumnHeader } from "@/components/ui/advanced-table"
import { AnimeThumbnail } from "@/components/anime/anime-thumbnail"

import { DataTableRowActions } from "./anime-table-row-actions"

export const columns: ColumnDef<Translation>[] = [
  {
    id: "thumbnail",
    size: 100,
    cell: ({ row }) => {
      return (
        <Link
          href={`/anime/${row.original.animeNode.id}/${row.original.animeNode.title
            .replaceAll(" ", "_")
            .replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")
            .replaceAll(
              /[^a-zA-Z0-9_ ]/gm,
              "_"
            )}?group=${row.original.group.name}`}
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
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
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
    size: 10,
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Średnia ocena" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 w-full max-w-[500px] truncate text-center font-medium">
            {row.original.animeNode.score.mean ?? "N/A"}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DataTableRowActions row={row} />
      </div>
    ),
  },
]
