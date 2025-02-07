import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { Navbar } from "./components/navbar"

interface PanelLayoutProps {
  children: React.ReactNode
}

export default async function PanelLayout({ children }: PanelLayoutProps) {
  return (
    <div className="flex h-[100dvh] w-full">
      <Navbar />
      <Separator orientation="vertical" />
      <ScrollArea className="max-h-[100dvh] w-full overflow-y-hidden">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </div>
  )
}
