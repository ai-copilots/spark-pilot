import "server-only";
import type { Agent } from 'http';

/**
 * 全局代理配置工具 v3
 * 
 * 这个模块为整个 Next.js 项目提供统一的代理配置。主要用于：
 * 1. 处理各种环境（开发、测试、生产）的网络访问需求
 * 2. 支持通过代理访问各种外部服务
 * 3. 提供统一的代理错误处理和日志记录机制
 * 4. 支持不同类型的代理配置（HTTP、HTTPS、SOCKS）
 * 
 * 环境变量配置：
 * - HTTPS_PROXY: HTTPS 代理地址 (优先使用)
 *   示例: http://127.0.0.1:7890 或 https://proxy.example.com:8443
 * 
 * - HTTP_PROXY: HTTP 代理地址 (备选)
 *   示例: http://127.0.0.1:7890
 * 
 * - ALL_PROXY: SOCKS 代理地址 (备选)
 *   示例: socks5://127.0.0.1:7890 或 socks4://proxy.example.com:1080
 * 
 * - NO_PROXY: 不使用代理的域名列表，使用逗号分隔
 *   示例: localhost,127.0.0.1,.internal.example.com
 * 
 * - USE_PROXY: 是否强制启用代理
 *   示例: true 或 false
 * 
 * 使用示例：
 * ```typescript
 * // 基本用法 - 使用环境变量配置
 * const agent = await createProxyAgent();
 * 
 * // 自定义配置
 * const agent = await createProxyAgent({
 *   proxyUrl: 'http://custom-proxy:8080',
 *   timeout: 10000,
 *   retries: 3
 * });
 * ```
 */

/**
 * 代理配置接口
 */
export interface ProxyConfig {
  proxyUrl?: string;        // 代理服务器URL
  noProxy?: string[];       // 不使用代理的域名列表
  timeout?: number;         // 超时时间(ms)
  retries?: number;         // 重试次数
}

/**
 * 获取基础代理配置
 */
function getBaseConfig(): ProxyConfig {
  return {
    proxyUrl: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY || '',
    noProxy: process.env.NO_PROXY?.split(',').filter(Boolean) || [],
    timeout: 5000,
    retries: 3
  };
}

/**
 * 检查是否需要代理
 */
function shouldUseProxy(url: string, noProxy: string[] = []): boolean {
  try {
    const targetHost = new URL(url).hostname;
    return !noProxy.some(domain => 
      targetHost === domain || targetHost.endsWith(`.${domain}`)
    );
  } catch {
    return true;
  }
}

/**
 * 动态加载代理代理
 */
async function loadProxyAgent(proxyUrl: string): Promise<Agent | undefined> {
  try {
    if (proxyUrl.startsWith('socks')) {
      const { SocksProxyAgent } = await import('socks-proxy-agent');
      return new SocksProxyAgent(proxyUrl);
    } else {
      const { HttpsProxyAgent } = await import('https-proxy-agent');
      return new HttpsProxyAgent(proxyUrl);
    }
  } catch (error) {
    console.warn('无法加载代理代理:', error);
    return undefined;
  }
}

/**
 * 创建代理配置
 * 
 * @param config - 可选的自定义代理配置
 * @param targetUrl - 可选的目标URL，用于检查是否需要代理
 * @returns 代理代理实例或undefined
 */
export async function createProxyAgent(
  config?: Partial<ProxyConfig>,
  targetUrl?: string
): Promise<Agent | undefined> {
  // 仅在开发环境或明确配置了代理时使用代理
  if (process.env.NODE_ENV === 'development' || process.env.USE_PROXY === 'true') {
    try {
      const baseConfig = getBaseConfig();
      const finalConfig = {
        ...baseConfig,
        ...config
      };
      
      // 检查是否需要跳过代理
      if (targetUrl && !shouldUseProxy(targetUrl, finalConfig.noProxy)) {
        return undefined;
      }

      // 验证代理URL
      if (!finalConfig.proxyUrl) {
        console.warn('代理环境变量未设置');
        return undefined;
      }

      // 动态加载并创建代理代理
      const agent = await loadProxyAgent(finalConfig.proxyUrl);
      
      if (agent) {
        console.log('使用代理:', finalConfig.proxyUrl);
      }
      
      return agent;
    } catch (error) {
      console.error('创建代理时出错:', error);
      return undefined;
    }
  }
  
  return undefined;
} 