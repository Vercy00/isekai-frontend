"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { Client, StompSubscription } from "@stomp/stompjs"
import { v4 as uuidv4 } from "uuid"

type onMessageType<T = any> = (mess: T) => any

function useSubtitleSocket(): [string, (fn: onMessageType) => void] {
  const [simpName, setSimpName] = useState("")
  const [onMessage, setOnMessage] = useState<onMessageType[]>([])
  const [lastMessage, setLastMessage] = useState<any>(null)

  const addOnMessage = (fn: onMessageType) => {
    setOnMessage((fns) => fns.concat(fn))
  }

  useEffect(() => {
    if (!lastMessage) return

    onMessage.forEach((on) => on(lastMessage))
  }, [lastMessage])

  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://api.isekai.pl/v1/ws/fansub",
      reconnectDelay: 500000,
      heartbeatIncoming: 60000,
      heartbeatOutgoing: 60000,
      connectHeaders: {
        simpSessionId: uuidv4(),
      },
    })

    var subscription: StompSubscription | null = null

    client.onConnect = (frame) => {
      setSimpName(frame.headers["user-name"])

      subscription = client.subscribe("/user/queue/subtitles", (message) => {
        const mess = JSON.parse(message.body)

        setLastMessage(mess)
      })
    }

    client.onWebSocketError = (error) => {
      console.error("Error with websocket", error)
    }

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"])
      console.error("Additional details: " + frame.body)
    }

    client.activate()

    return () => {
      subscription?.unsubscribe()
      client.deactivate()
    }
  }, [])

  return [simpName, addOnMessage]
}

interface SubtitleSocketProviderProps {
  children: ReactNode
}

const SubtitleSocketContext = createContext<
  [string, (fn: onMessageType) => void] | null
>(null)

function SubtitleSocketProvider({ children }: SubtitleSocketProviderProps) {
  const [simpName, addOnMessage] = useSubtitleSocket()

  return (
    <SubtitleSocketContext.Provider value={[simpName, addOnMessage]}>
      {children}
    </SubtitleSocketContext.Provider>
  )
}

function useSocketContext() {
  return useContext(SubtitleSocketContext)!
}

export { SubtitleSocketProvider, useSocketContext }
