export type Action = {
  name: string
  url: string
  method: string
}

export type Notification<T = any> = {
  id: string
  relatedObject: T
  cosumerId: string
  producerName: string
  type: string
  subtype: string
  createdAt: Date
  actions: Action[]
}
