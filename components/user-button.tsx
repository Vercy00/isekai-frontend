"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppSelector } from "@/store/root-store"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

import { useNotification } from "@/lib/notification-lib"
import { cn } from "@/lib/utils"

import { Notifications } from "./notifications"
import { Button, buttonVariants } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { UserSettings } from "./user-settings"

export function UserButton() {
  const [notifications] = useNotification()
  const [openSheet, setOpenSheet] = useState(false)
  const [canHoverOpen, setCanHoverOpen] = useState(false)
  const [openHover, setOpenHover] = useState(false)
  const user = useAppSelector((state) => state.userStore.user)

  if (user)
    return (
      <Sheet
        onOpenChange={(open) => {
          setOpenSheet(open)
          setCanHoverOpen(false)
          setOpenHover(false)

          open &&
            setTimeout(() => {
              setCanHoverOpen(true)
              setOpenHover(false)
            }, 300)
        }}
        open={openSheet}
        modal
      >
        <SheetTrigger asChild>
          <Button variant="secondary" className="relative">
            <div className="absolute left-0 aspect-square h-full overflow-hidden rounded-l-md">
              <Image
                src={user.avatarUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <span className="ml-10">{user.displayName}</span>
            {notifications.length > 0 && (
              <div className="absolute right-0 top-0 size-3 -translate-y-1/3 translate-x-1/3 rounded-full bg-red-600" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          withClose={false}
          className="flex flex-col justify-between"
        >
          <SheetHeader>
            <SheetTitle>
              <VisuallyHidden.Root>User Menu</VisuallyHidden.Root>
            </SheetTitle>
            <div className="flex justify-between">
              <Link
                href={`/profile/${user.username}`}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "relative max-w-36 overflow-hidden pl-14"
                )}
                onClick={() => setOpenSheet(false)}
              >
                <div className="absolute left-0 aspect-square h-full">
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="overflow-hidden text-ellipsis">
                  {user.displayName}
                </span>
              </Link>

              <HoverCard
                openDelay={200}
                open={openHover}
                onOpenChange={(open) => setOpenHover(canHoverOpen && open)}
              >
                <HoverCardTrigger>
                  <RadioGroup
                    defaultValue="option-one"
                    disabled
                    className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-one"
                        id="option-one"
                        radioItemType="tab"
                      >
                        JP
                      </RadioGroupItem>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-two"
                        id="option-two"
                        radioItemType="tab"
                      >
                        EN
                      </RadioGroupItem>
                    </div>
                  </RadioGroup>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit text-sm">
                  <p>Wybierz format tytułów</p>
                </HoverCardContent>
              </HoverCard>

              <Notifications />
            </div>
          </SheetHeader>

          <div className="grid gap-3">
            <UserSettings />
            <form method="post" action="https://api.isekai.pl/logout">
              <Button className="w-full" variant="destructive">
                Wyloguj
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    )

  return (
    <Link
      className={buttonVariants({ variant: "secondary" })}
      href={"https://api.isekai.pl/oauth2/authorization/isekai-gateway"}
    >
      Zaloguj się
    </Link>
  )
}