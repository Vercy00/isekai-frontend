import { NextResponse, userAgent } from "next/server"
import type { NextRequest } from "next/server"

import { ServerUserService } from "./services/server/server-user.service"

const userService = new ServerUserService()

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  const viewport = device.type === "mobile" ? "mobile" : "desktop"

  request.nextUrl.searchParams.set("viewport", viewport)

  if (!request.nextUrl.pathname.startsWith("/panel"))
    return NextResponse.rewrite(request.nextUrl)

  const user = await userService.getCurrentUser()

  if (
    !user?.role ||
    !["JR_MOD", "MOD", "JR_ADMIN", "ADMIN", "OWNER"].includes(user.role)
  )
    return NextResponse.redirect(new URL("/", request.url))

  return NextResponse.rewrite(request.nextUrl)
}
