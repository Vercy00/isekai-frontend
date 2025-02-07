import { cookies } from "next/headers"

import { Notification } from "@/types/notification"

import { ServerApi } from "./server-api.service"

class ServerNotificationService extends ServerApi {
  async getNotifications() {
    const cookie = await cookies()

    try {
      return await this._get<Notification[]>(
        "https://api.isekai.pl/v1/notifications",
        {
          headers: {
            Cookie: cookie.toString(),
          },
        }
      )
    } catch (e) {
      return []
    }
  }
}

export { ServerNotificationService }
