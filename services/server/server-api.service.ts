"use sever"

import { cache } from "react"
import axios, { AxiosInstance } from "axios"

import "server-only"

const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

export class ServerApi {
  clientId = process.env.CLIENT_ID as string
  clientSecret = process.env.CLIENT_SECRET as string
  authUrl = "https://sso.isekai.pl/realms/isekai/protocol/openid-connect/token"
  baseUrl = "https://api.isekai.pl/v1"
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
      transformResponse: (data) =>
        data &&
        JSON.parse(data, (_, value) =>
          ISODateFormat.test(value) ? new Date(value) : value
        ),
    })

    this.instance.interceptors.request.use(
      async (config) => {
        config.headers.Authorization = `Bearer ${await this._getToken()}`
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  _get = cache(async <T>(url = "", params: URLSearchParams | string = "") => {
    return (await this.instance.get<T>(this.baseUrl + url, { params: params }))
      .data
  })
}
