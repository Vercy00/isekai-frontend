import { Anime } from "./anime"
import { User } from "./user"

export type Subtitles = {
  description: string
  magnet: string
  episodeNum: number
  updatedAt: Date
  createdAt: Date
  uploadedBy: Member
}

export type TranslationStatus =
  | "PLANNED"
  | "TRANSLATING"
  | "TRANSLATED"
  | "SUSPENDED"
  | "DROPPED"

export type TranslationAuthor = {
  member: Member
  roles: FansubRole["name"][]
}

export type FakeTranslationAuthor = {
  member: FakeMember
  roles: FansubRole["name"][]
}

export type Translation = {
  group: GroupNode
  status: TranslationStatus
  animeNode: Anime
  authors: TranslationAuthor[]
  fakeAuthors: FakeTranslationAuthor[]
}

export type FansubRole = {
  name:
    | "OWNER"
    | "ADMIN"
    | "TRANSLATOR"
    | "PROOFREADER"
    | "TYPESETTER"
    | "RETIRED"
  order: number
}

export type Member = {
  id: string
  username: string
  displayName: string
  roles: FansubRole[]
  avatarUrl: string
  bannerUrl: string
}

export type FakeMember = {
  id: string
  displayName: string
}

export type GroupStats = {
  planned: number
  translating: number
  translated: number
  suspended: number
  dropped: number
  sum: number
}

export type GroupNode = {
  name: string
  description: string
  createdAt: Date
  bannerUrl: string
  avatarUrl: string
  membersCount: number
  translationsCount: number
  admins: Member[]
}

export type Group = {
  owner: User
  members: Member[]
  fakeMembers: FakeMember[]
  updatedAt: Date
  closed: boolean
  stats: GroupStats
} & GroupNode

export type Post = {
  id: string
  title: string
  content: string
  author: Member
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}
