import NextAuth, { NextAuthConfig, Session, User, DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"
import { neo4jAdapter } from "./neo4j-adapter"

/**
 * 扩展默认的会话类型
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

/**
 * Auth.js 配置函数
 */
const authConfig = async () => {
  const adapter = await neo4jAdapter.createAdapter()

  return {
    providers: [
      GitHub({
        authorization: {
          params: {
            prompt: "consent",  // 每次都显示授权页面
            scope: "read:user user:email"  // 请求用户信息和邮箱权限
          }
        }
      })
    ],

    adapter,

    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },

    callbacks: {
      authorized: async ({ auth }) => {
        return !!auth
      },
      session: async ({ session, user }: { session: Session, user: User }) => {
        if (session?.user) {
          session.user.id = user.id || ''
        }
        return session
      },
    },

    debug: process.env.NODE_ENV === "development",
    trustHost: true,

    session: { 
      strategy: "database" as const,
      maxAge: 30 * 24 * 60 * 60 // 30 days
    },
  } satisfies NextAuthConfig
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig) 