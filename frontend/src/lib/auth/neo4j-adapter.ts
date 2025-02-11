import neo4j, { Session } from "neo4j-driver"
import { Neo4jAdapter } from "@auth/neo4j-adapter"
import { getDriver } from '@/lib/neo4j'

/**
 * Neo4j Auth.js 适配器
 * 为 Auth.js 提供 Neo4j 数据库支持
 * 
 * 功能：
 * 1. 用户会话管理
 * 2. 账户关联
 * 3. 验证令牌存储
 * 4. OAuth 账户链接
 * 
 * 数据模型：
 * - User: 用户基本信息
 * - Account: OAuth 提供商账户
 * - Session: 用户会话数据
 * - VerificationToken: 邮箱验证令牌
 */

// 创建会话代理以管理会话生命周期
const driver = await getDriver()
const sessionProxy = new Proxy<Session>(
  driver.session({
    database: process.env.NEO4J_DATABASE || "neo4j",
    defaultAccessMode: neo4j.session.WRITE
  }),
  {
    get(target, prop: keyof Session) {
      // 为每个事务创建新会话
      if (prop === "readTransaction" || prop === "writeTransaction") {
        const session = driver.session({
          database: process.env.NEO4J_DATABASE || "neo4j",
          defaultAccessMode: neo4j.session.WRITE
        })
        return session[prop].bind(session)
      }
      return target[prop]
    }
  }
)

/**
 * 导出 Neo4j 适配器实例
 * 使用会话代理确保正确的会话管理
 */
export const neo4jAdapter = Neo4jAdapter(sessionProxy) 