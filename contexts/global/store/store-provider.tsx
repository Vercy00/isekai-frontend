"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"

import { AppStore, makeStore } from "@/lib/store/root-store"
import { IUserState, userActions } from "@/lib/store/user-slice"

function StoreProvider({
  children,
  initUser,
}: {
  children: React.ReactNode
  initUser?: IUserState
}) {
  const storeRef = useRef<AppStore>(undefined)

  if (!storeRef.current) {
    storeRef.current = makeStore()

    if (initUser) {
      typeof window !== "undefined" &&
        localStorage.removeItem("persist:userStore")
      storeRef.current.dispatch(userActions.initialize(initUser))
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

export { StoreProvider }
