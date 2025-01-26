/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        source: "/api/:path*",
        destination: "https://api.isekai.pl/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "https://api.isekai.pl/v1/auth/:path*",
      },
      {
        source: "/anime/:id/:title/:path*",
        destination: "/anime/:id/:path*",
      },
      {
        source: "/groups/:groupName",
        destination: "/groups/:groupName/posts",
      },
    ]
  },
}

export default nextConfig
