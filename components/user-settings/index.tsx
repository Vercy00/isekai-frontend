import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AccountSettings } from "./account-settings"
import { EmailSettings } from "./email-settings"
import { PasswordSettings } from "./password-settings"

const tabs = {
  profile: { component: <AccountSettings />, name: "Profil" },
  password: { component: <PasswordSettings />, name: "Hasło" },
  email: { component: <EmailSettings />, name: "Email" },
}

export function UserSettings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Ustawienia</Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] w-[900px] max-w-none flex-col">
        <DialogHeader>
          <DialogTitle>Ustawienia</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="account"
          orientation="vertical"
          className="grid h-full grid-cols-[150px_1fr] items-start gap-4"
        >
          <TabsList className="flex h-auto w-full flex-col gap-3 bg-transparent">
            {Object.entries(tabs).map(([key, value]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="w-full justify-start capitalize hover:bg-muted data-[state=active]:bg-muted"
              >
                {value.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="m-0 h-full pt-2">
              {value.component}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
