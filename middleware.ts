import { NextResponse, userAgent } from "next/server"
import type { NextRequest } from "next/server"
import { i18nRouter } from "next-i18n-router"

import { i18nConfig } from "./i18n-config"
import { cookieName, fallbackLng, languages } from "./lib/i18n/settings"
import { ServerUserService } from "./services/server/server-user.service"

const userService = new ServerUserService()

// export async function middleware(request: NextRequest) {
// const { device } = userAgent(request)
// const viewport = device.type === "mobile" ? "mobile" : "desktop"

// request.nextUrl.searchParams.set("viewport", viewport)

// if (!request.nextUrl.pathname.startsWith("/panel"))
//   return NextResponse.rewrite(request.nextUrl)

// const user = await userService.getCurrentUser()

// if (
//   !user?.role ||
//   !["JR_MOD", "MOD", "JR_ADMIN", "ADMIN", "OWNER"].includes(user.role)
// )
//   return NextResponse.redirect(new URL("/", request.url))

// return NextResponse.rewrite(request.nextUrl)
// }

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!auth/|api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const locale =
    languages.find((lang) => request.nextUrl.pathname.startsWith(`/${lang}`)) ||
    "pl"

  request.headers.set("x-locale", locale)

  return i18nRouter(request, i18nConfig)
}
