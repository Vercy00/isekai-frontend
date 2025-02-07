import { User } from "@/types/user"

import { ServerApi } from "./server-api.service"

class ServerUserService extends ServerApi {
  async getUser(username: string) {
    return await this._get<User>(`/users/${username}`)
  }
}

export { ServerUserService }
