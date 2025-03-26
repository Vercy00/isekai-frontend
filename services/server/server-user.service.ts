import { User } from "@/types/user"

import { ServerApi } from "./server-api.service"

class ServerUserService extends ServerApi {
  getUser(username: string) {
    return this._get<User>(`/users/${username}`)
  }
}

export { ServerUserService }
