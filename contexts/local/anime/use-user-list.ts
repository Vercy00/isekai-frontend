"use client"

import { useContext } from "react"

import { AnimeContext } from "./anime-context"

function useUserList() {
  const context = useContext(AnimeContext)

  if (!context) {
    throw new Error("useUserList must be used within UserListProvider")
  }

  return context.userList
}

export { useUserList }
