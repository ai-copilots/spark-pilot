/**
 * Firecrawl Extract API 路由
 * 用于从网页提取结构化数据
 */

import { NextRequest } from 'next/server';
import { createProxyAgent } from '@/lib/proxy';

// 从环境变量获取 API key
const API_KEY = process.env.FIRECRAWL_API_KEY!;

// Firecrawl API 基础 URL
const FIRECRAWL_API_BASE_URL = 'https://api.firecrawl.dev/v1/extract';

/**
 * 处理 POST 请求
 * @param request - Next.js 请求对象
 * @returns 提取结果响应
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const { urls, prompt, enableWebSearch = false } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return Response.json(
        { error: '缺少有效的 URL 列表' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return Response.json(
        { error: '缺少提取提示词' },
        { status: 400 }
      );
    }

    // 创建代理配置
    const agent = await createProxyAgent(
      undefined,
      FIRECRAWL_API_BASE_URL
    );

    // 调用 Firecrawl Extract API
    const response = await fetch(FIRECRAWL_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        urls,
        prompt,
        enableWebSearch,
      }),
      ...(agent ? { agent } : {}), // 条件添加代理配置
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API 调用失败: ${response.statusText}`);
    }

    const data = await response.json();
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('数据提取失败:', error);
    return Response.json(
      { error: '数据提取失败' },
      { status: 500 }
    );
  }
} 