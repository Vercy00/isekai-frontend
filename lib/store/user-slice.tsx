"use client"

import { UserDto } from "@/gen/users"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface IUserState {
  isAuthorized: boolean
  user: UserDto | null
}

const initialState: IUserState = {
  isAuthorized: false,
  user: null,
}

export const userSlice = createSlice({
  name: "userStore",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload
      state.isAuthorized = true
    },
    setUserDisplayName: (state, action: PayloadAction<string>) => {
      state.user!.displayName = action.payload
    },
    initialize(state, action: PayloadAction<IUserState>) {
      return action.payload
    },
    logout() {
      return initialState
    },
  },
})

export const userActions = userSlice.actions

export const userReducer = userSlice.reducer
