/**
 * Tavily API 路由
 * 使用 REST API 处理 AI 优化的搜索请求
 */

import { NextRequest } from 'next/server';
import { createProxyAgent } from '@/lib/proxy';

// 从环境变量获取 API key
const API_KEY = process.env.TAVILY_API_KEY!;

// Tavily API 基础 URL
const TAVILY_API_BASE_URL = 'https://api.tavily.com/search';

/**
 * 处理 GET 请求
 * @param request - Next.js 请求对象
 * @returns 搜索结果响应
 */
export async function GET(request: NextRequest) {
  try {
    // 获取搜索参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const searchDepth = searchParams.get('depth') || 'basic'; // basic 或 advanced

    if (!query) {
      return Response.json(
        { error: '缺少搜索查询参数' },
        { status: 400 }
      );
    }

    // 创建代理配置
    const agent = await createProxyAgent(
      undefined,
      TAVILY_API_BASE_URL
    );

    // 调用 Tavily REST API
    const response = await fetch(TAVILY_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: searchDepth,
        include_answer: true,
        include_images: false,
        max_results: 5,
      }),
      next: {
        revalidate: 300, // 5分钟后重新验证
      },
      ...(agent ? { agent } : {}), // 条件添加代理配置
    });

    if (!response.ok) {
      throw new Error(`Tavily API 调用失败: ${response.statusText}`);
    }

    const data = await response.json();
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('搜索请求失败:', error);
    return Response.json(
      { error: '搜索请求失败' },
      { status: 500 }
    );
  }
} 