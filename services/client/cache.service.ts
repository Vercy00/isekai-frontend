import { Api } from "./api.service"

export class CacheService extends Api {
  constructor() {
    super()
  }

  async setItem(_key: any, value: any) {
    return await this._post(`/cache?store=${_key}`, value)
  }

  async getItem(_key: any) {
    return await this._get("/cache", {
      params: new URLSearchParams({ store: _key }),
    })
  }

  async removeItem(_key: any) {
    return await this._delete(`/cache?store=${_key}`)
  }
}
