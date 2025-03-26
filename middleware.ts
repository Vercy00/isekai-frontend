import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken, JWT } from "next-auth/jwt"
import { i18nRouter } from "next-i18n-router"

import { i18nConfig } from "./i18n-config"
import { languages } from "./lib/i18n/settings"

enum HttpStatus {
  OK,
  UNATHORIZED,
  FORBIDDEN,
}

function validatePanelAccess(token: JWT | null) {
  if (!token) {
    return HttpStatus.UNATHORIZED
  }

  return HttpStatus.OK
}

function createResponse(request: NextRequest, status: HttpStatus) {
  switch (status) {
    case HttpStatus.UNATHORIZED:
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    case HttpStatus.FORBIDDEN:
      return NextResponse.redirect(new URL("/forbidden", request.url))
    default:
      return i18nRouter(request, i18nConfig)
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  let status = HttpStatus.OK

  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (request.nextUrl.pathname === "/panel") {
    status = validatePanelAccess(token)
  }

  const locale =
    languages.find((lang) => request.nextUrl.pathname.startsWith(`/${lang}`)) ||
    "en"

  request.headers.set("x-locale", locale)

  return createResponse(request, status)
  // return i18nRouter(request, i18nConfig)
}

export const config = {
  matcher: [
    "/((?!auth/|api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
}
