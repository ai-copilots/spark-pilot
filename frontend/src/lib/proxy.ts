import "server-only";
import type { Agent } from 'http';

/**
 * 全局代理配置工具
 * 
 * 这个模块为整个 Next.js 项目提供统一的代理配置。主要用于：
 * 1. 处理各种环境（开发、测试、生产）的网络访问需求
 * 2. 支持通过代理访问各种外部服务（OpenAI、Anthropic、数据库等）
 * 3. 提供统一的代理错误处理和日志记录机制
 * 4. 支持不同类型的代理配置（HTTP、HTTPS、SOCKS）
 * 
 * 环境变量配置：
 * - HTTPS_PROXY: HTTPS 代理地址 (优先使用)
 * - HTTP_PROXY: HTTP 代理地址 (备选)
 * - ALL_PROXY: SOCKS 代理地址 (备选)
 * - NO_PROXY: 不使用代理的域名列表
 * - USE_PROXY: 是否强制启用代理（即使在非开发环境）
 * 
 * 使用示例：
 * ```typescript
 * // 基本用法
 * const agent = await createProxyAgent();
 * 
 * // 指定服务的代理配置
 * const openaiAgent = await createProxyAgent('openai');
 * const dbAgent = await createProxyAgent('database');
 * 
 * // 指定目标 URL 的代理配置
 * const agent = await createProxyAgent('default', 'https://api.openai.com');
 * ```
 */

// 支持的服务类型
export type ServiceType = 'openai' | 'anthropic' | 'database' | 'default';

// 代理配置接口
interface ProxyConfig {
  proxyUrl?: string;
  noProxy?: string[];
  timeout?: number;
  retries?: number;
}

/**
 * 获取服务特定的代理配置
 * 不同的服务可能需要不同的代理设置
 */
function getServiceConfig(service: ServiceType): ProxyConfig {
  // 基础配置
  const baseConfig: ProxyConfig = {
    proxyUrl: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY || '',
    noProxy: process.env.NO_PROXY?.split(',').filter(Boolean) || [],
    timeout: 5000,
    retries: 3
  };

  // 服务特定配置
  switch (service) {
    case 'openai':
      return {
        ...baseConfig,
        timeout: 10000, // OpenAI 可能需要更长的超时时间
      };
    case 'anthropic':
      return {
        ...baseConfig,
        timeout: 15000, // Anthropic 可能需要更长的超时时间
      };
    case 'database':
      return {
        ...baseConfig,
        retries: 5, // 数据库连接可能需要更多重试次数
        timeout: 3000, // 数据库连接超时时间应该较短
      };
    default:
      return baseConfig;
  }
}

/**
 * 检查是否需要代理
 * @param url 目标 URL
 * @param noProxy 不需要代理的域名列表
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
 * 创建代理配置
 * @param service 服务类型，用于获取特定的代理配置
 * @param targetUrl 可选的目标 URL，用于检查是否需要代理
 */
export async function createProxyAgent(
  service: ServiceType = 'default',
  targetUrl?: string
): Promise<Agent | undefined> {
  // 仅在明确配置了代理的环境中使用代理
  if (process.env.USE_PROXY === 'true') {
    try {
      const config = getServiceConfig(service);
      
      // 如果提供了目标 URL 且在 noProxy 列表中，则不使用代理
      if (targetUrl && !shouldUseProxy(targetUrl, config.noProxy)) {
        return undefined;
      }

      // 如果没有配置代理 URL，返回 undefined
      if (!config.proxyUrl) {
        console.warn(`[${service}] 代理环境变量未设置，跳过代理配置`);
        return undefined;
      }

      console.log(`[${service}] 使用代理:`, config.proxyUrl);
      
      // 根据代理 URL 类型选择不同的代理代理
      if (config.proxyUrl.startsWith('socks')) {
        const { SocksProxyAgent } = await import('socks-proxy-agent');
        const agent = new SocksProxyAgent(config.proxyUrl);
        setupAgentErrorHandling(agent, service);
        return agent;
      } else {
        const { HttpsProxyAgent } = await import('https-proxy-agent');
        const agent = new HttpsProxyAgent(config.proxyUrl);
        setupAgentErrorHandling(agent, service);
        return agent;
      }
    } catch (error) {
      console.error(`[${service}] 创建代理时出错:`, error);
      return undefined;
    }
  }
  
  return undefined;
}

/**
 * 配置代理错误处理
 */
function setupAgentErrorHandling(agent: Agent, service: ServiceType) {
  agent.on('error', (err) => {
    console.error(`[${service}] 代理连接错误:`, err);
  });

  // 添加其他事件处理
  if ('on' in agent) {
    agent.on('timeout', () => {
      console.warn(`[${service}] 代理连接超时`);
    });
  }
} 