"use client"

import { ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface AnimeThumbnailProps {
  className?: string
  thumbnailUrl: string
  children?: ReactNode
}

export function AnimeThumbnail({
  className,
  thumbnailUrl,
  children,
}: AnimeThumbnailProps) {
  return (
    <div
      className={cn(
        "relative aspect-[146/212] w-full overflow-hidden",
        className
      )}
    >
      <Image
        src={thumbnailUrl}
        alt=""
        fill
        className="object-cover"
      />
      {children}
    </div>
  )
}
