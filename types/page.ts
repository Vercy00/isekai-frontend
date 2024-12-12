export type ItemPage<T> = {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  member: number
  numberOfElements: number
  pageable: {
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    sort: Sort
    unpaged: boolean
  }
  size: number
  sort: Sort
  totalElements: number
  totalPages: number
}

type Sort = {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}
