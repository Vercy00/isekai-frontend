"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Pin } from "lucide-react"

import { Post } from "@/types/fansub"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface GroupPostProps {
  post: Post
}

export function GroupPost({ post }: GroupPostProps) {
  const params = useParams()

  return (
    <Link
      href={`/groups/${params.groupName}/posts/${post.id}`}
      scroll={false}
      className="inline-block h-fit w-full scale-95 rounded-md border p-3 transition-transform md:hover:scale-100"
    >
      <div className="relative flex gap-3">
        <div className="relative aspect-square h-16 overflow-hidden rounded-sm">
          <Image
            src={`http://localhost:3000/api/v1/users/vercy/profilePicture`}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex h-fit items-center gap-2">
            <span>{post.author.displayName}</span>
            <span className="text-sm text-foreground/60">
              5 min temu
              {post.createdAt?.toISOString() !== post.updatedAt?.toISOString()
                ? " (edytowane)"
                : ""}
            </span>
          </div>
          <span className="text-sm">uploader, typesetter</span>
        </div>

        {post.pinned && (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <div className="absolute right-0">
                <Pin />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit" align="end">
              Przypięty wpis
            </HoverCardContent>
          </HoverCard>
        )}
      </div>

      <div className="mt-1">
        <h3 className="line-clamp-1 text-lg">{post.title}</h3>
        <p className="line-clamp-4 text-sm">{post.content}</p>
      </div>
    </Link>
  )
}
