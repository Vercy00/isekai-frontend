import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

import { getAuthOptions } from "./auth"
import { getCookies } from "./cookies"

/**
 * Subset of AxiosRequestConfig
 */
type RequestConfig<TData = unknown> = {
  baseURL?: string
  url?: string
  method?: "GET" | "PUT" | "PATCH" | "POST" | "DELETE" | "OPTIONS"
  params?: unknown
  data?: TData | FormData
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream"
  signal?: AbortSignal
  headers?: AxiosRequestConfig["headers"]
}
/**
 * Subset of AxiosResponse
 */
type ResponseConfig<TData = unknown> = {
  data: TData
  status: number
  statusText: string
  headers: AxiosResponse["headers"]
}

type ResponseErrorConfig<TError = unknown> = AxiosError<TError>

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(async (req) => {
  const session =
    typeof window === "undefined"
      ? await getServerSession(await getAuthOptions())
      : await getSession()
  const cookieStore =
    typeof window === "undefined" ? await getCookies() : undefined

  if (cookieStore) {
    req.headers.set("cookie", cookieStore.toString())
  }

  if (session) {
    req.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return req
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function client<TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> {
  return axiosInstance.request({
    ...config,
    headers: { ...config.headers },
    // withCredentials: true,
  })
}

export type { RequestConfig, ResponseConfig, ResponseErrorConfig }

export { client, client as default }
