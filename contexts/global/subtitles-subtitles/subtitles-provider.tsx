"use client"

import { ReactNode } from "react"

import { SubtitleSocketContext } from "./subtitles-context"
import { useSubtitlesSocket } from "./use-subtitles-socket"

interface SubtitleSocketProviderProps {
  children: ReactNode
}

function SubtitleSocketProvider({ children }: SubtitleSocketProviderProps) {
  const [simpName, addOnMessage] = useSubtitlesSocket()

  return (
    <SubtitleSocketContext.Provider value={[simpName, addOnMessage]}>
      {children}
    </SubtitleSocketContext.Provider>
  )
}

export { SubtitleSocketProvider }
