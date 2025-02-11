import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

import { neo4jAdapter } from "./neo4j-adapter"

/**
 * Auth.js 配置
 * 
 * 主要配置包括:
 * 1. 认证提供商(providers) - 支持多种登录方式
 * 2. 数据库适配器(adapter) - 用于存储用户、会话等数据
 * 3. 页面配置(pages) - 自定义认证相关页面
 * 4. 回调函数(callbacks) - 处理认证流程中的各个环节
 * 5. 会话配置(session) - 设置会话管理策略
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  /**
   * 配置认证提供商
   * 这里使用GitHub OAuth进行身份验证
   */
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

  /**
   * 数据库适配器配置
   * 使用Neo4j存储用户数据、会话信息等
   * 支持以下数据模型:
   * - User: 用户信息
   * - Account: OAuth账号关联
   * - Session: 会话数据
   * - VerificationToken: 验证令牌
   */
  adapter: neo4jAdapter,

  /**
   * 自定义认证页面路由
   * signIn: 登录页面
   * error: 错误页面
   */
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  /**
   * 回调函数配置
   */
  callbacks: {
    /**
     * 授权回调
     * 用于检查用户是否有权限访问
     * @param auth - 包含用户会话信息
     * @returns boolean - true表示已授权
     */
    authorized: async ({ auth }) => {
      // 已登录用户已认证，否则重定向到登录页
      return !!auth
    },

    /**
     * 会话回调
     * 用于自定义会话对象
     * @param session - 当前会话信息
     * @param user - 数据库中的用户信息
     * @returns 修改后的会话对象
     */
    async session({ session, user }) {
      // if (session.user) {
      //   session.user.id = user.id
      // }
      // return session
      session.user.id = user.id
      return session
    },
  },

  /**
   * 调试模式
   * 开发环境下输出详细日志
   */
  debug: process.env.NODE_ENV === "development",

  /**
   * 信任主机配置
   * 用于确保请求来自可信来源
   */
  trustHost: true,

  /**
   * 会话配置
   * strategy: 会话存储策略
   * - jwt: 使用JWT存储会话(默认)
   * - database: 使用数据库存储会话
   * maxAge: 会话最大有效期(30天)
   */
  session: { 
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
}) 