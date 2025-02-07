"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { FANSUB } from "@/constants/fansub"
import { TRANSLATION } from "@/translations/pl-pl"
import { BadgeCheck } from "lucide-react"

import { Group, GroupStats } from "@/types/fansub"
import { useAppSelector } from "@/lib/store/root-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

import { GroupSettings } from "./group-settings"

interface GroupsContentProps {
  group: Group
  children?: ReactNode
}

export function GroupsContent({ group, children }: GroupsContentProps) {
  const user = useAppSelector((state) => state.userStore.user)

  return (
    <div>
      <div className="relative -mt-2 aspect-[4/1] w-full">
        <div className="absolute -z-10 aspect-[4/1] w-full overflow-x-clip">
          <Image
            src={group.bannerUrl}
            alt=""
            fill
            className="rounded-sm object-cover px-6"
          />

          <div className="absolute top-1/2 left-0 box-content h-full w-full -translate-y-1/2 py-10 backdrop-blur-lg" />
        </div>
        <div className="relative mx-6 my-8 h-full">
          <Image
            src={group.bannerUrl}
            alt=""
            fill
            className="rounded-sm object-cover"
          />

          {group.members.some(
            ({ username, roles }) =>
              username === user?.username &&
              roles.some((role) =>
                ["owner", "admin"].includes(role.name.toLocaleLowerCase())
              )
          ) && <GroupSettings group={group} />}

          <div className="bg-background/50 absolute bottom-12 left-12 flex h-20 items-center rounded-sm">
            <div className="outline-primary relative aspect-square h-full rounded-sm outline-4">
              <Image
                src={group.avatarUrl}
                alt=""
                fill
                className="rounded-sm object-cover"
              />
            </div>

            <div className="px-8">
              <h1 className="text-center text-2xl font-semibold">
                {group.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full gap-4 px-6">
        <div className="relative flex w-1/4 max-w-[450px] flex-shrink-0 flex-col gap-4">
          <div>
            <h2 className="mx-2 mb-1">Odznaki</h2>
            <div className="rounded-lg border p-4">
              <BadgeCheck className="text-primary" />
            </div>
          </div>

          <div>
            <h2 className="mx-2 mb-1">O grupie</h2>
            <p className="rounded-lg border p-4 text-sm whitespace-pre-wrap">
              {group.description || "Brak opisu"}
            </p>
          </div>

          <div>
            <h2 className="mx-2 mb-1">Statystyki</h2>
            <div className="grid gap-3 rounded-lg border p-4 text-sm">
              {FANSUB.TRANSLATION_STATUS.map((status) => {
                const value = group.stats[status.type as keyof GroupStats]

                return (
                  <div key={status.value} className="grid gap-1">
                    <div className="flex justify-between">
                      <span>
                        {TRANSLATION.FANSUB_TRANSLATION_STATUS[status.value]}
                      </span>
                      <span>{value}</span>
                    </div>
                    <Progress value={(value / group.stats.sum) * 100} />
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="mx-2 mb-1">Członkowie</h2>
            <div className="grid gap-3 rounded-lg border p-4 text-sm">
              {group.members.map((member, i) => (
                <div className="flex items-center gap-3" key={i}>
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.displayName.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
