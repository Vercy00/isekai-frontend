"use client"

import { useState } from "react"

import { Post } from "@/types/fansub"
import { ItemPage } from "@/types/page"

import { GroupPost } from "./group-post"
import { PostForm } from "./post/post-form"

interface GroupPostsProps {
  posts: ItemPage<Post>
}

export function GroupPosts({ posts }: GroupPostsProps) {
  const [postPage, setPostPage] = useState(posts)

  return (
    <>
      <PostForm />
      <div className="columns-[300px] gap-0">
        {postPage.content.map((post, i) => (
          <GroupPost key={i} post={post} />
        ))}
        {/* {[...Array(8)].map((_, i) => (
          <GroupPost
            key={i}
            post={{
              author: {
                displayName: "fsdgsd",
              },
              content: "ggsdgssd",
              createdAt: new Date(),
              title: "gsgsd",
            }}
          />
        ))} */}
      </div>
    </>
  )
}
