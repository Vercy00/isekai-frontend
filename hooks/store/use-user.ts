"use client"

import { useAppSelector } from "@/lib/store/root-store"

function useUser() {
  return useAppSelector((state) => state.userStore.user)
}

export { useUser }
