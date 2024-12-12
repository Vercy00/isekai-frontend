// import {
//   getItemAction,
//   removeItemAction,
//   setItemAction,
// } from "@/actions/cache.action"

import createWebStorage from "redux-persist/lib/storage/createWebStorage"

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null)
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: any) {
      return Promise.resolve()
    },
  }
}

// const createRedisStorage = () => {
//   return {
//     async getItem(_key: any) {
//       return await getItemAction(_key)
//     },
//     async setItem(_key: any, value: any) {
//       return await setItemAction(_key, value)
//     },
//     async removeItem(_key: any) {
//       return await removeItemAction(_key)
//     },
//   }
// }

export const userStore =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage()
