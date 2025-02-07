"use client"

import { createContext } from "react"

type onMessageType<T = any> = (mess: T) => any

const SubtitleSocketContext = createContext<
  [string, (fn: onMessageType) => void] | null
>(null)

export type { onMessageType }
export { SubtitleSocketContext }
