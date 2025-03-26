import { Api } from "./api.service"

export class SecurityService extends Api {
  constructor() {
    super("/auth")
  }

  login(login: string, password: string) {
    return this._post("/login", {
      login,
      password,
    })
  }

  logout() {
    return this._post("/logout")
  }
}
