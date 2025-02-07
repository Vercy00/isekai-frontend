import { Api } from "./api.service"

export class SecurityService extends Api {
  constructor() {
    super("/auth")
  }

  async login(login: string, password: string) {
    return await this._post("/login", {
      login,
      password,
    })
  }

  async logout() {
    return await this._post("/logout")
  }
}
