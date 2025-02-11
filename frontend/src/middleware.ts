import { auth } from "@/lib/auth"

/**
 * 导出认证中间件
 * 用于路由保护和认证状态管理
 */
export { auth as middleware } from "@/lib/auth"

/**
 * 中间件配置
 * 处理认证和重定向逻辑
 * 
 * @param req - 请求对象
 * @returns Response | undefined
 * - Response: 需要重定向时返回重定向响应
 * - undefined: 允许请求继续处理
 */
export default auth((req) => {
  // 检查认证状态和访问路径
  // 如果用户未认证且不是访问登录页面，则重定向到登录页
  if (!req.auth && req.nextUrl.pathname !== "/auth/login") {
    const newUrl = new URL("/auth/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

/**
 * 中间件配置对象
 * 定义中间件的匹配规则
 * 
 * matcher 数组定义了需要应用中间件的路由模式:
 * 
 * 包含的路径:
 * - /(protected)/* : 所有受保护路由，需要认证才能访问
 * 
 * 自动排除的路径:
 * - /(public)/* : 公开路由，无需认证
 * - /api/* : API 路由
 * - /_next/* : Next.js 内部路由
 * - /static/* : 静态资源
 * - /auth/* : 认证相关路由
 * - /favicon.ico 等静态文件
 * 
 * 工作流程:
 * 1. 请求进入
 * 2. 检查 URL 是否匹配 matcher 模式
 * 3. 匹配则执行中间件逻辑
 * 4. 不匹配则直接放行
 */
export const config = {
  matcher: [
    /*
     * 只匹配需要保护的路由:
     * - /(protected)/* - 所有protected路由组下的页面
     * 
     * 自动排除:
     * - /(public)/* - 所有public路由组下的页面
     * - /api/* - API路由
     * - /_next/* - Next.js系统文件
     * - /favicon.ico等静态文件
     */
    '/(protected)/:path*'
  ]
}