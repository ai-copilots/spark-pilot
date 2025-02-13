import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { createProxyAgent } from '@/lib/proxy';

// 确保 URL 包含协议
function ensureProtocol(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

interface FirecrawlError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

// 设置超时
const TIMEOUT = 30000; // 30 seconds

// 带超时的 Promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('请求超时，请稍后重试'));
    }, timeoutMs);
  });

  return Promise.race([
    promise,
    timeoutPromise,
  ]).finally(() => {
    clearTimeout(timeoutHandle);
  });
}

// 提取处理程序
export async function POST(req: NextRequest) {
  try {
    // 创建代理配置，专门用于访问 Firecrawl API
    const agent = await createProxyAgent(undefined, 'https://api.firecrawl.dev');

    // 初始化 Firecrawl 客户端
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
      apiUrl: 'https://api.firecrawl.dev',
      agent, // 添加代理配置用于访问 Firecrawl API
    });

    const { url, prompt, systemPrompt } = await req.json();
    const targetUrl = ensureProtocol(url);

    try {
      // 执行提取
      const result = await withTimeout(
        firecrawl.scrapeUrl(targetUrl, {
          formats: ['markdown', 'html'],
          extract: {
            prompt,
            systemPrompt,
          },
          timeout: TIMEOUT,
        }),
        TIMEOUT
      );

      return new NextResponse(
        JSON.stringify(result),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // 处理 Firecrawl API 的错误响应
      const firecrawlError = error as FirecrawlError;
      if (firecrawlError.response?.data?.error) {
        throw new Error(firecrawlError.response.data.error);
      }
      throw error;
    }
  } catch (error) {
    console.error('提取失败:', error);
    const errorMessage = error instanceof Error ? error.message : '提取失败，请稍后重试';
    
    // 根据错误类型设置状态码
    let status = 500;
    if (errorMessage.includes('Payment required')) {
      status = 402;
    } else if (errorMessage.includes('Too many requests')) {
      status = 429;
    } else if (errorMessage.includes('请求超时')) {
      status = 408;
    }

    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: errorMessage
      }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 