"use client"

import { useState } from "react"

import { GroupNode } from "@/types/fansub"

import { GroupCard } from "./group-card"

interface GroupPageContentProps {
  initGroups: GroupNode[]
}

export function GroupPageContent({ initGroups }: GroupPageContentProps) {
  const [groups, setGroups] = useState(initGroups)

  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,max(200px,_calc(25%_-_1rem)))] justify-center gap-3">
      {groups.map((group, i) => (
        <GroupCard key={i} group={group} />
      ))}
    </div>
  )
}
