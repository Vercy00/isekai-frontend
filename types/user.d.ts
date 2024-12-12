export type User = {
  createdAt: Date
  id: string
  sex: "MALE" | "FEMALE" | "OTHER"
  displayName: string
  username: string
  description: string
  email: string | null
  role: string
  avatarUrl: string
  bannerUrl: string
  badges: Badge[]
}

export type Badge = {
  id: number
  name: string
  imageUrl: string
}

export type UserStats = {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
  sum: number
}

export type ChangePassword = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangeEmail = {
  password: string
  email: string
}
