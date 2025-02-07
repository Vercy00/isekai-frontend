"use client"

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { User } from "@/types/user"

export interface IUserState {
  isAuthorized: boolean
  user: User | null
}

const initialState: IUserState = {
  isAuthorized: false,
  user: null as unknown as User,
}

export const userSlice = createSlice({
  name: "userStore",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthorized = true
    },
    setUserDisplayName: (state, action: PayloadAction<string>) => {
      state.user!.displayName = action.payload
    },
    initialize(state, action: PayloadAction<IUserState>) {
      return action.payload
    },
    logout(state) {
      return initialState
    },
  },
})

export const userActions = userSlice.actions

export const userReducer = userSlice.reducer
