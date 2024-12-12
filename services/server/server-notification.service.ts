"use sever"

import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import axios from "axios"

import { Notification } from "@/types/notification"

export class ServerNotificationService {
  async getNotifications() {
    const cookie = (cookies() as unknown as UnsafeUnwrappedCookies)

    try {
      return (
        await axios.get<Notification[]>(
          "https://api.isekai.pl/v1/notifications",
          {
            headers: {
              Cookie: cookie.toString(),
            },
          }
        )
      ).data
    } catch (e) {
      return []
    }
  }
}
