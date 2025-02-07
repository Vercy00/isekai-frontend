type ItemPage<T> = {
  content: T[]
  page: {
    number: number
    size: number
    totalElements: number
    totalPages: number
  }
}

type Sort = {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

type SortDirection = "DESC" | "ASC"

type ItemPageFilters<T> = {
  size?: number
  page?: number
  sort?: `${Extract<keyof T, string>},${SortDirection}`[]
}

export type { ItemPage, ItemPageFilters, SortDirection }
