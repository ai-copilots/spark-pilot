/**
 * OpenWeatherMap API 路由
 * 用于获取指定经纬度的天气数据
 */

import { NextRequest } from 'next/server';

// 从环境变量获取 API key
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// API 基础 URL
const API_BASE_URL = 'https://api.openweathermap.org/data/3.0';

/**
 * 自定义错误类
 */
class WeatherAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

/**
 * 创建错误响应
 */
function createErrorResponse(error: Error): Response {
  console.error('天气 API 错误:', error);
  
  if (error instanceof WeatherAPIError) {
    return Response.json(
      { error: error.message },
      { status: error.status }
    );
  }

  return Response.json(
    { error: '内部服务器错误' },
    { status: 500 }
  );
}

/**
 * 验证请求参数
 */
function validateParams(searchParams: URLSearchParams): { lat: string; lon: string } {
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    throw new WeatherAPIError('缺少必要的经纬度参数', 400);
  }

  // 验证经纬度范围
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    throw new WeatherAPIError('纬度必须在 -90 到 90 度之间', 400);
  }

  if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
    throw new WeatherAPIError('经度必须在 -180 到 180 度之间', 400);
  }

  return { lat, lon };
}

/**
 * 处理 GET 请求
 * @param request - Next.js 请求对象
 * @returns 天气数据响应
 */
export async function GET(request: NextRequest) {
  try {
    // 获取请求头信息用于缓存控制
    const userAgent = request.headers.get('user-agent') || 'next.js';
    
    // 验证参数
    const { lat, lon } = validateParams(request.nextUrl.searchParams);

    // 调用 OpenWeatherMap API
    const response = await fetch(
      `${API_BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${API_KEY}&units=metric`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': userAgent,
        },
        // 由于天气数据会频繁变化，使用较短的缓存时间
        next: {
          revalidate: 300, // 5分钟后重新验证
        }
      }
    );

    // 检查响应状态
    if (!response.ok) {
      throw new WeatherAPIError(
        'OpenWeatherMap API 调用失败',
        response.status,
        { statusText: response.statusText }
      );
    }

    // 获取并验证响应数据
    const data = await response.json();
    
    // 返回成功响应，设置缓存控制头
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    return createErrorResponse(error as Error);
  }
} 