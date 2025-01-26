"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { GroupNode } from "@/types/fansub"

interface GroupCardProps {
  group: GroupNode
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link
      href={`/groups/${group.name.replaceAll(" ", "_")}`}
      className="aspect-[5/3] w-full overflow-hidden rounded-md border-2 border-primary"
    >
      <div className="relative h-1/3 w-full overflow-hidden border-b-2 border-primary">
        <Image
          src={group.bannerUrl}
          alt=""
          fill
          className="object-cover blur-sm brightness-75"
        />

        <div className="relative flex h-full gap-3 p-2">
          <div className="relative aspect-square h-full overflow-hidden rounded-sm">
            <Image src={group.avatarUrl} alt="" fill className="object-cover" />
          </div>

          <div>
            <span className="line-clamp-1">{group.name}</span>
            <div className="flex items-center gap-1">
              <Star className="size-4" />
              <span>0.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between">
          <span>Serie: {group.translationsCount}</span>
          <span>Członków: {group.membersCount}</span>
        </div>
        <p className="mt-3 line-clamp-5 whitespace-pre-wrap text-sm">
          {group.description || "Brak opisu"}
        </p>
      </div>
    </Link>
  )
}
