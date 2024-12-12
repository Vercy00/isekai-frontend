import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

export class Api {
  instance: AxiosInstance

  constructor(baseUrl = "/api/v1") {
    if (typeof window === "undefined")
      baseUrl = "https://api.isekai.pl/v1" + baseUrl.replaceAll("/api/v1", "")

    this.instance = axios.create({
      baseURL: baseUrl,
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

    // this.instance.interceptors.response.use(
    //   (response) => response,
    //   (error) => error.response
    // )
  }

  async _get<T>(
    url = "",
    params: URLSearchParams | string = "",
    options?: AxiosRequestConfig<any> | undefined
  ) {
    return await this.instance.get<T>(`${url}?${params}`, { ...options })
  }

  async _post<T>(url = "", body?: any, config?: AxiosRequestConfig<any>) {
    return await this.instance.post<T>(url, body, config)
  }

  async _delete(url = "") {
    return await this.instance.delete(url)
  }

  async _patch<T>(url = "", body?: any, config?: AxiosRequestConfig<any>) {
    return await this.instance.patch<T>(url, body, config)
  }

  async _put<T>(url = "", body?: any, config?: AxiosRequestConfig<any>) {
    return await this.instance.put<T>(url, body, config)
  }
}
