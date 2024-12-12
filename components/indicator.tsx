"use client"

import { cn } from "@/lib/utils"

interface IndicatorProps {
  current: number
  count: number
  onClick: (index: number) => void
}

export function Indicator({ count, current, onClick }: IndicatorProps) {
  return (
    <div className="absolute bottom-1 left-1/2 flex h-4 -translate-x-1/2 items-center gap-2 rounded-full bg-background/50 px-2 py-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className={cn(
            "h-3 w-3 cursor-pointer rounded-full transition-all",
            current === index + 1 ? "bg-primary" : "scale-[0.7] bg-slate-50"
          )}
          key={index}
          onClick={() => onClick(index)}
        />
      ))}
    </div>
  )
}
