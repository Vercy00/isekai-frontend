import { Api } from "./api.service"

export class CacheService extends Api {
  constructor() {
    super()
  }

  setItem(_key: any, value: any) {
    return this._post(`/cache?store=${_key}`, value)
  }

  getItem(_key: any) {
    return this._get("/cache", {
      params: new URLSearchParams({ store: _key }),
    })
  }

  removeItem(_key: any) {
    return this._delete(`/cache?store=${_key}`)
  }
}
