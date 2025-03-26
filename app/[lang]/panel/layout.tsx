import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PanelPath } from "@/components/panel/panel-path"
import { PanelSidebar } from "@/components/panel/panel-sidebar"

interface PanelLayoutProps {
  children: React.ReactNode
}

export default async function PanelLayout({ children }: PanelLayoutProps) {
  return (
    <SidebarProvider>
      <PanelSidebar />
      <SidebarInset>
        <main className="w-full p-4">
          <header className="flex h-12 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 pb-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <PanelPath />
            </div>
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
