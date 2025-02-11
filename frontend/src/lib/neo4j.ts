/**
 * Neo4j 数据库连接和操作工具
 * 
 * 这个模块提供了与 Neo4j 数据库交互的核心功能：
 * - 连接管理（初始化、验证、关闭）
 * - 会话管理
 * - 查询执行（读和写操作）
 * - 错误处理
 * - 性能监控
 * 
 * @module neo4j
 */

import 'server-only'
import neo4j, { Driver, Session, ServerInfo } from 'neo4j-driver'

/**
 * Neo4j 连接配置接口
 * @interface Neo4jConfig
 */
interface Neo4jConfig {
    uri: string        // 数据库连接 URI
    username: string   // 用户名
    password: string   // 密码
}

/**
 * 自定义 Neo4j 连接错误类
 * 用于统一处理 Neo4j 相关的错误，并保留原始错误信息
 */
export class Neo4jConnectionError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message)
        this.name = 'Neo4jConnectionError'
    }
}

/**
 * 全局状态管理
 * 使用 globalThis 确保在 Next.js 服务器端维护单例连接
 */
const globalForNeo4j = globalThis as unknown as {
    neo4j: { 
        driver: Driver | null;        // 数据库驱动实例
        config: Neo4jConfig | null;   // 当前配置
        serverInfo: ServerInfo | null;// 服务器信息
    }
}

// 初始化全局状态
if (!globalForNeo4j.neo4j) {
    globalForNeo4j.neo4j = { 
        driver: null,
        config: null,
        serverInfo: null
    }
}

/**
 * 获取数据库连接配置
 * @throws {Neo4jConnectionError} 当缺少必要的环境变量配置时
 * @returns {Neo4jConfig} 数据库连接配置对象
 */
const getConfig = (): Neo4jConfig => {
    if (!process.env.NEO4J_URI || !process.env.NEO4J_USERNAME || !process.env.NEO4J_PASSWORD) {
        throw new Neo4jConnectionError('缺少必要的 Neo4j 环境配置')
    }
    
    return {
        uri: process.env.NEO4J_URI,
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD
    }
}

/**
 * 获取或初始化数据库驱动实例
 * 使用单例模式确保只创建一个连接
 * 
 * @throws {Neo4jConnectionError} 连接初始化失败时
 * @returns {Promise<Driver>} Neo4j 驱动实例
 */
export const getDriver = async (): Promise<Driver> => {
    if (globalForNeo4j.neo4j.driver) {
        return globalForNeo4j.neo4j.driver
    }

    try {
        const config = getConfig()
        const driver = neo4j.driver(
            config.uri,
            neo4j.auth.basic(config.username, config.password),
            {
                maxConnectionPoolSize: 50,               // 连接池最大连接数
                connectionAcquisitionTimeout: 5000,      // 连接获取超时时间（毫秒）
                connectionTimeout: 5000,                  // 连接超时时间（毫秒）
                logging: {
                    level: 'warn',                      // 日志级别
                    logger: (level, message) => {
                        console.log(`[Neo4j ${level}] ${message}`)
                    }
                }
            }
        )

        // 验证连接并获取服务器信息
        globalForNeo4j.neo4j.serverInfo = await driver.getServerInfo()
        globalForNeo4j.neo4j.driver = driver
        globalForNeo4j.neo4j.config = config
        
        return driver
    } catch (error) {
        throw new Neo4jConnectionError('Neo4j 连接初始化失败', error)
    }
}

/**
 * 创建新的数据库会话
 * @returns {Promise<Session>} 数据库会话实例
 */
export const getSession = async (): Promise<Session> => {
    const driver = await getDriver()
    return driver.session()
}

/**
 * 执行只读查询
 * 
 * @template T 返回数据的类型
 * @param {string} cypher Cypher 查询语句
 * @param {Record<string, unknown>} params 查询参数
 * @returns {Promise<T[]>} 查询结果数组
 * @throws {Neo4jConnectionError} 查询执行失败时
 */
export async function executeRead<T>(
    cypher: string,
    params: Record<string, unknown> = {}
): Promise<T[]> {
    const session = await getSession()
    const startTime = performance.now()
    
    try {
        const result = await session.executeRead(
            (tx) => tx.run(cypher, params)
        )
        return result.records.map(record => record.toObject() as T)
    } catch (error) {
        throw new Neo4jConnectionError('执行只读查询失败', error)
    } finally {
        const duration = performance.now() - startTime
        console.log(`[Neo4j Query] Read operation took ${duration.toFixed(2)}ms`)
        await session.close()
    }
}

/**
 * 执行写入查询
 * 
 * @template T 返回数据的类型
 * @param {string} cypher Cypher 查询语句
 * @param {Record<string, unknown>} params 查询参数
 * @returns {Promise<T[]>} 查询结果数组
 * @throws {Neo4jConnectionError} 查询执行失败时
 */
export async function executeWrite<T>(
    cypher: string,
    params: Record<string, unknown> = {}
): Promise<T[]> {
    const session = await getSession()
    const startTime = performance.now()
    
    try {
        const result = await session.executeWrite(
            (tx) => tx.run(cypher, params)
        )
        return result.records.map(record => record.toObject() as T)
    } catch (error) {
        throw new Neo4jConnectionError('执行写入查询失败', error)
    } finally {
        const duration = performance.now() - startTime
        console.log(`[Neo4j Query] Write operation took ${duration.toFixed(2)}ms`)
        await session.close()
    }
}

/**
 * 关闭数据库连接
 * 清理所有全局状态
 */
export async function closeConnection(): Promise<void> {
    if (globalForNeo4j.neo4j.driver) {
        await globalForNeo4j.neo4j.driver.close()
        globalForNeo4j.neo4j.driver = null
        globalForNeo4j.neo4j.config = null
        globalForNeo4j.neo4j.serverInfo = null
    }
}

/**
 * 获取 Neo4j 服务器信息
 * @returns {ServerInfo | null} 服务器信息对象，如果未连接则返回 null
 */
export function getServerInfo(): ServerInfo | null {
    return globalForNeo4j.neo4j.serverInfo
}

/**
 * 验证数据库连接状态
 * @returns {Promise<boolean>} 连接是否有效
 */
export async function verifyConnectivity(): Promise<boolean> {
    try {
        const driver = await getDriver()
        await driver.getServerInfo()
        return true
    } catch (error) {
        console.error('Neo4j 连接验证失败:', error)
        return false
    }
}
