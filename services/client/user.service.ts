import { ChangeEmail, ChangePassword, User } from "@/types/user"
import { encrypt } from "@/lib/crypto"

import { Api } from "./api.service"

export class UserService extends Api {
  constructor() {
    super("/users")
  }

  findUsers(username: string) {
    return this._get<User[]>("", {
      params: { username },
    })
  }

  getCurrentUser() {
    return this._get<User>("/@me")
  }

  updateProfilePicture(formData: FormData) {
    return this._put("/@me/avatar", formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  updateBanner(formData: FormData) {
    return this._put("/@me/banner", formData, {
      timeout: 1_000 * 60 * 5,
    })
  }

  patchProfile(profile: { displayName: string; description: string }) {
    return this._patch("/@me", profile, {
      timeout: 10_000,
    })
  }

  async changePassword(req: ChangePassword, key: string) {
    return await this._post("/@me/password", {
      currentPassword: await encrypt(req.currentPassword, key),
      newPassword: await encrypt(req.newPassword, key),
      confirmPassword: await encrypt(req.confirmPassword, key),
    } satisfies ChangePassword)
  }

  async changeEmail(req: ChangeEmail, key: string) {
    return await this._post("/@me/email", {
      password: await encrypt(req.password, key),
      email: req.email,
    } satisfies ChangeEmail)
  }
}
