import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

import { Subtitle } from "@/types/fansub"

export const columns: ColumnDef<Subtitle>[] = [
  {
    id: "episode",
    size: -1,
    header: () => <span>Odcinek</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {row.original.episodeNum}
          </span>
        </div>
      )
    },
  },
  {
    size: 250,
    accessorKey: "name",
    header: ({ column }) => <span>Dodał</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {row.original.uploadedBy.displayName}
          </span>
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "createdAt",
    header: ({ column }) => <span>Dodano</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {format(row.original.createdAt, "PPpp", { locale: pl })}
          </span>
        </div>
      )
    },
  },
  {
    size: -1,
    accessorKey: "createdAt",
    header: ({ column }) => <span>Edytowano</span>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="line-clamp-2 max-w-[500px] truncate whitespace-normal font-medium">
            {format(row.original.updatedAt, "PPpp", { locale: pl })}
          </span>
        </div>
      )
    },
  },
  {
    size: 10,
    id: "actions",
    cell: ({ row, table }) => (
      <div className="flex justify-end">
        {/* <AuthorsTableRowActions row={row} table={table} /> */}
      </div>
    ),
  },
]