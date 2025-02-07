import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import "server-only"

const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

class ServerApi {
  clientId = process.env.CLIENT_ID!
  clientSecret = process.env.CLIENT_SECRET!
  authUrl = process.env.AUTH_TOKEN_URL!
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  token = { expiresIn: new Date(), accessToken: "" }
  instance: AxiosInstance

  async _getToken(): Promise<string> {
    if (this.token.expiresIn > new Date()) return this.token.accessToken

    const res = await (
      await fetch(this.authUrl, {
        next: { revalidate: 0 },
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        }),
      })
    ).json()

    const expiresIn = new Date()
    expiresIn.setSeconds(expiresIn.getSeconds() + res.expires_in)

    this.token = {
      expiresIn,
      accessToken: res.access_token,
    }

    return this.token.accessToken
  }

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
      transformResponse: (data: string) =>
        data &&
        !data.startsWith("<html>") &&
        JSON.parse(data, (_, value) =>
          ISODateFormat.test(value) ? new Date(value) : value
        ),
      paramsSerializer: {
        indexes: null,
      },
    })

    this.instance.interceptors.request.use(
      async (config) => {
        if (config.headers.Authorization) return config

        config.headers.Authorization = `Bearer ${await this._getToken()}`

        return config
      },
      (error) => Promise.reject(error)
    )
  }

  async _get<T>(url: string, config?: AxiosRequestConfig<any>) {
    return (await this.instance.get<T>(url, config)).data
  }
}

export { ServerApi }
