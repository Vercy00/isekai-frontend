"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { Post } from "@/types/fansub"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  const params = useParams()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => setOpen(true), [])

  return (
    <Dialog
      open={open}
      onOpenChange={() =>
        router.push(`/groups/${params.groupName}`, { scroll: false })
      }
    >
      <DialogContent forceMount>
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
              {/* <span>{post.author.user.displayName}</span> */}
              <span className="text-sm text-foreground/60">
                5 min temu
                {post.createdAt?.toISOString() !== post.updatedAt?.toISOString()
                  ? " (edytowane)"
                  : ""}
              </span>
            </div>
            <span className="text-sm">uploader, typesetter</span>
          </div>
        </div>

        <div className="mt-1">
          <h3 className="line-clamp-1 text-lg">{post.title}</h3>
          <p className="text-sm">{post.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
