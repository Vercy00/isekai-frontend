import { NextRequest } from "next/server"
import { Redis } from "ioredis"

const redis = new Redis("localhost:6379")

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("JSESSIONID")?.value
  const { searchParams } = new URL(request.url)
  const store = searchParams.get("store")
  const storeName = `${sessionId}${store}`

  if (!sessionId || !store) {
    await redis.del(storeName)
    return new Response(null, { status: 204 })
  }

  try {
    const res = await fetch("http://localhost:8080/v1/auth/checkSession", {
      headers: {
        Cookie: `JSESSIONID=${sessionId}`,
      },
    })

    if (res.status != 200) {
      await redis.del(storeName)
      return new Response(null, { status: 204 })
    }

    return Response.json(await redis.get(`${sessionId}${store}`))
  } catch (e) {
    return new Response(null, { status: 204 })
  }
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("JSESSIONID")?.value
  const { searchParams } = new URL(request.url)
  const store = searchParams.get("store")
  const storeName = `${sessionId}${store}`

  if (!sessionId) {
    await redis.del(storeName)
    return new Response(null, { status: 204 })
  }

  try {
    const res = await fetch("http://localhost:8080/v1/auth/checkSession", {
      headers: {
        Cookie: `JSESSIONID=${sessionId}`,
      },
    })

    if (res.status != 200) {
      await redis.del(storeName)
      return new Response(null, { status: 204 })
    }

    await redis.set(storeName, await request.text(), "EX", 60 * 60 * 24 * 30)

    return new Response(null, { status: 204 })
  } catch (e) {
    new Response(null, { status: 204 })
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.cookies.get("JSESSIONID")?.value
  const { searchParams } = new URL(request.url)
  const store = searchParams.get("store")
  const storeName = `${sessionId}${store}`

  await redis.del(storeName)

  return new Response(null, { status: 204 })
}
