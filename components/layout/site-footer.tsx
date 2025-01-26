import * as React from "react"
import { Dot } from "lucide-react"

import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={className}>
      <div className="container flex max-w-full flex-col items-center justify-between gap-4 px-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center px-8 md:flex-row md:gap-8 md:px-0">
          <span>&#169; Isekai</span>
          {/* <Icons.logo /> */}
          <span className="flex text-center text-sm leading-loose md:text-left">
            <a
              href="https://discord.gg/mTbw7yugQz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
            >
              Discord
            </a>
            <Dot />
            <a
              href="https://ko-fi.com/isekai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
            >
              Wesprzyj nas
            </a>
          </span>
          {/* <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn
            </a>
            . Hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </a>
            . Illustrations by{" "}
            <a
              href="https://popsy.co"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Popsy
            </a>
            . The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p> */}
        </div>
      </div>
    </footer>
  )
}
