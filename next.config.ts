import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "isekai.pl",
      },
      {
        protocol: "https",
        hostname: "api.isekai.pl",
      },
    ],
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/:path*",
      //   destination: "https://api.isekai.pl/:path*",
      // },
      // {
      //   source: "/auth/:path*",
      //   destination: "https://api.isekai.pl/v1/auth/:path*",
      // },
      {
        source: "/:lang/anime/:id/:title/:path*",
        destination: "/:lang/anime/:id/:path*",
      },
      {
        source: "/:lang/groups/:groupName",
        destination: "/:lang/groups/:groupName/posts",
      },
    ]
  },
}

export default nextConfig
