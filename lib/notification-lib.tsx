"use client"

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react"
import { Client, StompSubscription } from "@stomp/stompjs"

import { Notification } from "@/types/notification"

function useNotificationSocket() {
  useEffect(() => {
    var client = new Client({
      brokerURL: "ws://localhost:8085/v1/ws/notifications",
      reconnectDelay: 500000,
      heartbeatIncoming: 60000,
      heartbeatOutgoing: 60000,
      connectHeaders: {
        aa: "ffff",
      },
    })
    // var subscription: StompSubscription | null = null
    // client.onConnect = (frame) => {
    //   console.log("CONNECTED---------")
    //   subscription = client.subscribe(
    //     "/user/queue/live-feed-gps-stream",
    //     function (message) {
    //       console.log("Received", message.body)
    //     },
    //     { "auto-delete": "true" }
    //   )
    // }

    // client.onStompError = function (frame) {
    //   console.log("Broker reported error: ")
    //   console.log(frame.headers["message"])
    //   console.log("Additional details: ", frame.body)
    //   client.deactivate()
    // }

    // client.activate()

    // return () => subscription?.unsubscribe()

    var subscription: StompSubscription | null = null

    client.onConnect = (frame) => {
      console.log("Connected: " + frame)
      subscription = client.subscribe(
        "/user/queue/notifications",
        (greeting) => {
          console.log(JSON.parse(greeting.body).content)
        }
        // { "auto-delete": "true" }
      )
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

  return <></>
}

type ContextType = [
  Notification[],
  Dispatch<{
    type: string
    payload: any
  }>,
]

const NotificationContext = createContext<ContextType>([[], () => {}])

interface NotificationProviderProps {
  initNotifications: Notification[]
  children?: ReactNode
}

function NotificationProvider({
  initNotifications,
  children,
}: NotificationProviderProps) {
  const [notifications, dispatch] = useReducer(
    (state: Notification[], action: { type: string; payload: any }) => {
      switch (action.type) {
        case "delete":
          return state.filter(({ id }) => id !== action.payload)
      }
      return state
    },
    initNotifications
  )

  return (
    <NotificationContext.Provider value={[notifications, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

function useNotification() {
  return useContext(NotificationContext)
}

export { useNotificationSocket, NotificationProvider, useNotification }
