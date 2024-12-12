import { FansubRole, TranslationStatus } from "@/types/fansub"

const ROLES: FansubRole[] = [
  {
    name: "OWNER",
    order: 9,
  },
  {
    name: "ADMIN",
    order: 8,
  },
  {
    name: "TRANSLATOR",
    order: 0,
  },
  {
    name: "PROOFREADER",
    order: 0,
  },
  {
    name: "TYPESETTER",
    order: 0,
  },
  {
    name: "RETIRED",
    order: 0,
  },
]

const AUTHOR_ROLES: { value: FansubRole["name"] }[] = [
  {
    value: "TRANSLATOR",
  },
  {
    value: "PROOFREADER",
  },
  {
    value: "TYPESETTER",
  },
]

const TRANSLATION_STATUS: { value: TranslationStatus; type: string }[] = [
  {
    value: "PLANNED",
    type: "planned",
  },
  {
    value: "TRANSLATING",
    type: "translating",
  },
  {
    value: "TRANSLATED",
    type: "translated",
  },
  {
    value: "SUSPENDED",
    type: "suspended",
  },
  {
    value: "DROPPED",
    type: "dropped",
  },
]

export const FANSUB = {
  ROLES,
  AUTHOR_ROLES,
  TRANSLATION_STATUS,
}
