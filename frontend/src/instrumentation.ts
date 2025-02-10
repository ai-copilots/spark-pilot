/**
 * Next.js 监控和日志配置文件
 * 该文件用于设置应用程序的监控、追踪和性能测量
 * 
 * 注意事项:
 * 1. 此文件必须位于项目根目录或 src/ 目录下
 * 2. 必须导出一个名为 register 的异步函数
 * 3. 仅在生产环境构建时执行
 */

export async function register() {
    // 在 Node.js 运行时环境下的监控配置
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // 这里可以添加:
        // - Node.js 特定的性能监控
        // - APM (应用性能监控) 工具配置
        // - 服务器端日志记录
        // - 数据库查询监控等
    }
   
    // 在 Edge 运行时环境下的监控配置
    if (process.env.NEXT_RUNTIME === 'edge') {
        // 这里可以添加:
        // - Edge 特定的性能监控
        // - CDN 相关的监控
        // - Edge 函数的执行追踪
        // - Edge 环境下的错误追踪等
    }
  }