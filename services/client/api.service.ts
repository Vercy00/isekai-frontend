import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

import { authOptions } from "@/app/auth/[...nextauth]/route"

const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

export class Api {
  instance: AxiosInstance

  constructor(basePath = "") {
    const baseUrl = URL.parse(
      process.env.NEXT_PUBLIC_BASE_URL + basePath
    )?.toString()

    this.instance = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
      },
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

    this.instance.interceptors.request.use(async (req) => {
      const session =
        typeof window === "undefined"
          ? await getServerSession(authOptions)
          : await getSession()

      if (!session) return req

      req.headers.Authorization = `Bearer ${session.accessToken}`

      return req
    })

    // this.instance.interceptors.response.use(
    //   (response) => response,
    //   (error) => error.response
    // )
  }

  _get<T>(url: string, options?: AxiosRequestConfig<any> | undefined) {
    return this.instance.get<T>(`${url}`, { ...options })
  }

  _post<T>(url: string, body?: any, config?: AxiosRequestConfig<any>) {
    return this.instance.post<T>(url, body, config)
  }

  _delete(url: string, config?: AxiosRequestConfig<any>) {
    return this.instance.delete(url, config)
  }

  _patch<T>(url: string, body?: any, config?: AxiosRequestConfig<any>) {
    return this.instance.patch<T>(url, body, config)
  }

  _put<T>(url: string, body?: any, config?: AxiosRequestConfig<any>) {
    return this.instance.put<T>(url, body, config)
  }
}
