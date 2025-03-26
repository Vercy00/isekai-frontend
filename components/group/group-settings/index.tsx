"use client"

import { useEffect, useMemo } from "react"
import { Settings } from "lucide-react"

import { Group } from "@/types/fansub"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MembersSettings } from "./members-settings"
import { ProfileSettings } from "./profile-settings"
import { TranslationsSettings } from "./translations-settings"

interface GroupSettingsProps {
  group: Group
}

export function GroupSettings({ group }: GroupSettingsProps) {
  const tabs = useMemo(
    () => ({
      profile: { component: <ProfileSettings group={group} />, name: "Profil" },
      members: {
        component: <MembersSettings group={group} />,
        name: "Członkowie",
      },
      series: {
        component: <TranslationsSettings group={group} />,
        name: "Serie",
      },
    }),
    []
  )

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="bg-background/50 hover:bg-background/80 absolute top-3 right-3 aspect-square p-2"
        >
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(600px,_100lvh)] min-h-[min(600px,_100lvh)] w-[min(900px,_100vw)] min-w-[min(900px,_100vw)] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Ustawienia</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="account"
          orientation="vertical"
          className="grid h-full grid-cols-[150px_1fr] items-start gap-4 overflow-hidden"
        >
          <TabsList className="flex h-auto w-full flex-col gap-3 bg-transparent">
            {Object.entries(tabs).map(([key, value]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="hover:bg-muted data-[state=active]:bg-muted w-full justify-start capitalize"
              >
                {value.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent
              key={key}
              value={key}
              className="m-0 h-full overflow-hidden p-2"
            >
              {value.component}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export * from "./members-settings"
export * from "./translations-settings"
