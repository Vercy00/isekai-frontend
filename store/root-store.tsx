"use client"

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import logger from "redux-logger"
import { persistReducer } from "redux-persist"

import { userReducer } from "./user-slice"
import { userStore } from "./user-store"

const authPersistConfig = {
  key: "userStore",
  storage: userStore,
  whitelist: ["isAuthorized", "user"],
}

const rootReducer = combineReducers({
  userStore: persistReducer(authPersistConfig, userReducer),
})

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
