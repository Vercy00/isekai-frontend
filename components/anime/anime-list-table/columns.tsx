import Link from "next/link"
import { AnimeListStatusNodeDto } from "@/gen/anime"
import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/advanced-table"
import { AnimeThumbnail } from "@/components/anime/anime-thumbnail"

import { DataTableRowActions } from "./anime-table-row-actions"

export const columns: ColumnDef<AnimeListStatusNodeDto>[] = [
  {
    id: "thumbnail",
    size: 100,
    cell: ({ row }) => {
      return (
        <Link
          href={`/anime/${row.original.animeNode!.id}/${row.original.animeNode!.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}`}
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
        <Link
          href={`/anime/${row.original.animeNode!.id}/${row.original.animeNode!.title.replaceAll(" ", "_").replaceAll(/[^a-zA-Z0-9_ ]/gm, "_")}`}
        >
          <div className="flex space-x-2">
            <span className="line-clamp-2 max-w-[500px] truncate font-medium whitespace-normal">
              {row.original.animeNode!.title}
            </span>
          </div>
        </Link>
      )
    },
  },
  {
    size: 10,
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Śrenia ocena" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 w-full max-w-[500px] truncate text-center font-medium">
            {row.original.score?.mean ?? "N/A"}
          </span>
        </div>
      )
    },
  },
  {
    size: 158,
    id: "episodes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Obejrzane odcinki" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 w-full max-w-[500px] truncate text-center font-medium">
            {`${row.original.watchedEpisodes} / ${row.original.animeNode?.numEpisodes ?? "?"}`}
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
