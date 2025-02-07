"use client"

import { Notification } from "@/types/notification"

const title = {
  "fansub.invitation": (notification: Notification) =>
    `Zaproszenie do grupy ${notification.producerName}`,
}

function getNotificationTitle(notification: Notification) {
  return title[
    `${notification.type.toLocaleLowerCase()}.${notification.subtype.toLocaleLowerCase()}` as keyof typeof title
  ]?.(notification)
}

const content = {
  "fansub.invitation": (obj: any) => (
    <p>
      <span className="text-primary font-semibold">
        {obj.invitedBy.displayName} ({obj.invitedBy.username})
      </span>{" "}
      zaprasza Ciebie do grupy{" "}
      <span className="text-primary font-semibold">{obj.group.name}</span>{" "}
    </p>
  ),
}

function getNotificationContent(notification: Notification) {
  return content[
    `${notification.type.toLocaleLowerCase()}.${notification.subtype.toLocaleLowerCase()}` as keyof typeof content
  ]?.(notification.relatedObject)
}

const NOTIFIACTION_TRANSLATION = {
  "action.decline": "Odrzuć",
  "action.accept": "Przyjmij",
}

export {
  getNotificationTitle,
  getNotificationContent,
  NOTIFIACTION_TRANSLATION,
}
