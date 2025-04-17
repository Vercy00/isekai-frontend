import { Captions, Database, Lock, UserRoundCog } from "lucide-react"

import { PanelItem } from "@/components/panel/panel-sidebar"

const panelSite: { [key: string]: PanelItem[] } = {
  adminAnime: [
    {
      title: "anime",
      url: "/panel/admin/anime",
      icon: <Database />,
      items: [
        {
          title: "add",
          url: "/panel/admin/anime/add",
        },
        {
          title: "edit",
          url: "/panel/admin/anime/edit",
        },
        {
          title: "import",
          url: "/panel/admin/anime/import",
        },
      ],
    },
  ],
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
          title: "edit",
          url: "/panel/request/anime/edit",
        },
        {
          title: "import",
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
