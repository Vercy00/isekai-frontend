"use client"

import { ReactNode, useState } from "react"
import {
  getNotificationContent,
  getNotificationTitle,
  NOTIFIACTION_TRANSLATION,
} from "@/constants/notification"
import axios, { AxiosError } from "axios"
import { Bell } from "lucide-react"
import { toast } from "sonner"

import { Notification } from "@/types/notification"
import { useNotification } from "@/lib/notification-lib"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea } from "../ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const NOTIFICATION_TYPE = {
  all: "Wszystko" /*series: "Serie", admin: "Admin"*/,
}

export function Notifications() {
  const [notifications, dispatch] = useNotification()
  const [notType, setNotType] = useState<keyof typeof NOTIFICATION_TYPE>("all")

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="relative aspect-square p-2">
          <Bell />
          {notifications.length > 0 && (
            <div className="absolute top-0 right-0 size-3 -translate-y-1/3 translate-x-1/3 rounded-full bg-red-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="grid gap-3">
        <h4 className="leading-none font-medium">Powiadomienia</h4>

        <Select
          value={notType}
          onValueChange={(val) =>
            setNotType(val as keyof typeof NOTIFICATION_TYPE)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Powiadomienia" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {Object.entries(NOTIFICATION_TYPE).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <ScrollArea className="h-44 rounded-sm border">
          {notifications.map((notification, i) => (
            <NotificationCard
              key={i}
              {...notification}
              deleteNotification={() =>
                dispatch({
                  type: "delete",
                  payload: notification.id,
                })
              }
            />
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationCardProps extends Notification {
  deleteNotification: () => void
}

function NotificationCard(props: NotificationCardProps) {
  const {
    actions,
    cosumerId,
    createdAt,
    id,
    producerName,
    relatedObject,
    subtype,
    type,
  } = props

  return (
    <NotificationDialog
      notification={props}
      deleteNotification={props.deleteNotification}
    >
      <button
        type="button"
        className="hover:bg-muted w-full rounded-sm p-3 text-left"
      >
        <h5 className="leading-none font-medium">
          {getNotificationTitle(props)}
        </h5>
        <p className="line-clamp-2 text-sm font-light">
          Naciśnij po więcej akcji...
        </p>
      </button>
    </NotificationDialog>
  )
}

interface GenerateNotificationDialogProps {
  children: ReactNode
  notification: Notification
  deleteNotification: () => void
}

function NotificationDialog({
  children,
  notification,
  deleteNotification,
}: GenerateNotificationDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getNotificationTitle(notification)}</DialogTitle>
        </DialogHeader>

        {getNotificationContent(notification)}

        <DialogFooter>
          <div className="flex justify-end gap-3">
            {notification.actions.map((action, i) => (
              <NotificationActionButton
                action={action}
                key={i}
                closeDialog={() => setOpen(false)}
                deleteNotification={deleteNotification}
              />
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface NotificationActionButtonsProps {
  action: Notification["actions"][0]
  closeDialog: () => void
  deleteNotification: () => void
}

function NotificationActionButton({
  action,
  closeDialog,
  deleteNotification,
}: NotificationActionButtonsProps) {
  const submit = async () => {
    await new Promise((resolve) =>
      toast.promise(
        axios[
          action.method.toLocaleLowerCase() as "get" | "post" | "patch" | "put"
        ]("/api" + action.url),
        {
          loading: "Wykonywanie akcji...",
          success: (res) => {
            resolve(true)
            closeDialog()
            deleteNotification()
            return "Akcja została wykonana"
          },
          error: (err: AxiosError) => {
            resolve(false)
            return "Nieznany błąd"
          },
        }
      )
    )
  }

  return (
    <Button
      onClick={submit}
      variant={action.method === "DELETE" ? "destructive" : "default"}
    >
      {
        NOTIFIACTION_TRANSLATION[
          action.name as keyof typeof NOTIFIACTION_TRANSLATION
        ]
      }
    </Button>
  )
}
