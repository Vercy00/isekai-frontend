import NextAuth, { AuthOptions, TokenSet } from "next-auth"
import { JWT } from "next-auth/jwt"
import KeycloakProvider, { KeycloakProfile } from "next-auth/providers/keycloak"
import { OAuthConfig } from "next-auth/providers/oauth"

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    idToken?: string
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
    }
    accessToken?: string
  }
}

function requestRefreshOfAccessToken(token: JWT) {
  return fetch(
    `https://sso.isekai.pl/realms/isekai/protocol/openid-connect/token`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "isekai-gateway",
        client_secret: "nZNFWEYgsArHrq9W2kPAwrtqR0OqfmIN",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
      method: "POST",
      cache: "no-store",
    }
  )
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: "isekai-gateway",
      clientSecret: "nZNFWEYgsArHrq9W2kPAwrtqR0OqfmIN",
      issuer: "https://sso.isekai.pl/realms/isekai",
    }),
  ],
  session: {
    maxAge: 60 * 30,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at

        return token
      }
      // we take a buffer of one minute(60 * 1000 ms)
      if (Date.now() < (token.expiresAt as number) * 1000 - 60 * 1000) {
        return token
      } else {
        try {
          const response = await requestRefreshOfAccessToken(token)

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          const updatedToken: JWT = {
            ...token, // Keep the previous token properties
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(
              Date.now() / 1000 + (tokens.expires_in as number)
            ),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          }
          return updatedToken
        } catch (error) {
          console.error("Error refreshing access token", error)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub

      return session
    },
  },
  events: {
    async signOut({ token }: { token: JWT }) {
      if (!token) return

      const issuerUrl = (
        authOptions.providers.find(
          (p) => p.id === "keycloak"
        ) as OAuthConfig<KeycloakProfile>
      ).options!.issuer!
      const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`)

      logOutUrl.searchParams.set("id_token_hint", token.idToken!)

      await fetch(logOutUrl)
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
