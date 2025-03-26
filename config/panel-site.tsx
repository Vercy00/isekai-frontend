import { Captions, Database, Lock, UserRoundCog } from "lucide-react"

import { PanelItem } from "@/components/panel/panel-sidebar"

const panelSite: { [key: string]: PanelItem[] } = {
  navMain: [
    {
      title: "user",
      url: "/panel/user",
      icon: <UserRoundCog />,
      items: [
        {
          title: "profile",
          url: "/panel/user/profile",
        },
        {
          title: "password",
          url: "/panel/user/password",
        },
        {
          title: "email",
          url: "/panel/user/email",
        },
      ],
    },
  ],
  navAnime: [
    {
      title: "anime",
      url: "/panel/request/anime",
      icon: <Database />,
      items: [
        {
          title: "request_edit_anime",
          url: "/panel/request/anime/edit",
        },
        {
          title: "request_import_anime",
          url: "/panel/request/anime/import",
        },
      ],
    },
  ],
  navLink: [
    {
      title: "fansub",
      url: "/panel/fansub",
      icon: <Captions />,
    },
    {
      title: "admin",
      url: "/panel/admin",
      icon: <Lock />,
    },
  ],
  navHide: [
    {
      title: "main",
      url: "/panel",
    },
  ],
}

export { panelSite }
