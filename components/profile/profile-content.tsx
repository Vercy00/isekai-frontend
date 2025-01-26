"use client"

import { cloneElement, ReactElement, ReactNode } from "react"
import Image from "next/image"
import { ANIME_LIST_STATUS } from "@/const/animeListStatus"
import { TRANSLATION } from "@/translations/pl-pl"
import { BadgeCheck } from "lucide-react"

import { User, UserStats } from "@/types/user"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"

interface ProfileContentProps {
  children?: ReactNode
  user: User
  userStats: UserStats
}

export function ProfileContent({
  user,
  userStats,
  children,
}: ProfileContentProps) {
  return (
    <div>
      <div className="relative -mt-2 aspect-[4/1] w-full">
        <div className="absolute -z-10 aspect-[4/1] w-full overflow-x-clip">
          <Image
            src={user.bannerUrl}
            alt=""
            fill
            className="rounded-sm object-cover px-6"
          />

          <div className="absolute left-0 top-1/2 box-content h-full w-full -translate-y-1/2 py-10 backdrop-blur-lg" />
        </div>
        <div className="relative mx-6 my-8 h-full">
          <Image
            src={user.bannerUrl}
            alt=""
            fill
            className="rounded-sm object-cover"
          />

          <div className="absolute bottom-12 left-12 flex h-20 items-center rounded-sm bg-background/50">
            <div className="relative aspect-square h-full rounded-sm outline outline-4 outline-primary">
              <Image
                src={user.avatarUrl}
                alt=""
                fill
                className="rounded-sm object-cover"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 translate-x-1/2 translate-y-1/2 rounded-full border-4 border-primary bg-green-600" />
            </div>

            <div className="px-8">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <h1 className="text-center text-2xl font-semibold">
                    {user?.displayName}
                  </h1>
                </HoverCardTrigger>
                <HoverCardContent align="start" side="bottom" className="w-fit">
                  <span className="p-2">{user.username}</span>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full gap-4 px-6">
        <div className="relative flex w-1/4 max-w-[450px] flex-shrink-0 flex-col gap-4">
          <div>
            <h2 className="mx-2 mb-1">Odznaki</h2>
            <div className="flex gap-3 rounded-lg border p-4">
              {/* <BadgeCheck className="text-primary" /> */}
              {user.badges.length === 0
                ? "Brak odznak"
                : user.badges.map((badge) => (
                    <HoverCard key={badge.id} openDelay={100}>
                      <HoverCardTrigger>
                        <div className="relative aspect-square h-10 cursor-pointer">
                          <Image
                            src={badge.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-fit text-sm" side="top">
                        <p>
                          {
                            TRANSLATION.BADGE[
                              badge.name as keyof typeof TRANSLATION.BADGE
                            ]
                          }
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
            </div>
          </div>

          <div>
            <h2 className="mx-2 mb-1">O mnie</h2>
            <p className="rounded-lg border p-4 text-sm">
              {user.description || "Brak opisu"}
            </p>
          </div>

          <div>
            <h2 className="mx-2 mb-1">Statystyki</h2>
            <div className="grid gap-3 rounded-lg border p-4 text-sm">
              {ANIME_LIST_STATUS.STATUS.map((status) => {
                const value = userStats[status.type as keyof UserStats]

                return (
                  <div key={status.name} className="grid gap-1">
                    <div className="flex justify-between">
                      <span>{TRANSLATION.ANIME_LIST_STATUS[status.name]}</span>
                      <span>{value}</span>
                    </div>
                    <Progress value={(value / userStats.sum) * 100} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {cloneElement<any>(children as ReactElement, {
          user,
        })}
      </div>
    </div>
  )
}
