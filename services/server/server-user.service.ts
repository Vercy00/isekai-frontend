"use sever"

import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import axios from "axios"

import { User } from "@/types/user"

export class ServerUserService {
  async getCurrentUser() {
    const cookie = (cookies() as unknown as UnsafeUnwrappedCookies)

    try {
      return (
        await axios.get<User>("https://api.isekai.pl/v1/users/@me", {
          headers: {
            Cookie: cookie.toString(),
          },
        })
      ).data
    } catch (e) {
      return null
    }
  }

  async getUser(username: string) {
    return (await axios.get<User>(`https://api.isekai.pl/v1/users/${username}`))
      .data
  }
}
