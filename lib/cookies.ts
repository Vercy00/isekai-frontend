"use server"

import "server-only"

import { cookies } from "next/headers"

async function getCookies() {
  return (await cookies()).toString()
}

export { getCookies }
