"use client"

import { useEffect, useRef } from "react"
import { AppStore, makeStore } from "@/store/root-store"
import { IUserState, userActions } from "@/store/user-slice"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"

export default function StoreProvider({
  children,
  initState,
}: {
  children: React.ReactNode
  initState?: IUserState
}) {
  const storeRef = useRef<AppStore>(undefined)

  if (!storeRef.current) {
    storeRef.current = makeStore()

    if (initState) {
      typeof window !== "undefined" &&
        localStorage.removeItem("persist:userStore")
      storeRef.current.dispatch(userActions.initialize(initState))
    } else if (typeof window !== "undefined") {
      localStorage.clear()
    }
  }

  useEffect(() => {
    if (!storeRef.current) return

    const p = persistStore(storeRef.current, {
      manualPersist: true,
    } as any)

    p.persist()
  }, [storeRef.current])

  return <Provider store={storeRef.current}>{children}</Provider>
}
