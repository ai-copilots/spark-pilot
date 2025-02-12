import { NextRequest } from 'next/server';
import { createWeatherAssistant } from '@/features/showcase/utils/graph';

interface APIError {
  message: string;
  status?: number;
  error?: {
    type: string;
    message: string;
  };
  request_id?: string;
}

// 处理天气查询的 API 路由
export async function POST(request: NextRequest) {
  try {
    const { query, thread_id, provider = 'openai' } = await request.json();

    if (!query) {
      return Response.json(
        { error: '请提供查询内容' },
        { status: 400 }
      );
    }

    if (provider !== 'openai' && provider !== 'anthropic') {
      return Response.json(
        { error: '不支持的 LLM 提供商' },
        { status: 400 }
      );
    }

    console.log('开始处理天气查询:', { query, thread_id, provider });

    const assistant = await createWeatherAssistant(provider);
    console.log('助手创建成功，开始查询...');

    const result = await assistant.invoke(
      {
        messages: [{
          role: 'user',
          content: query
        }]
      },
      { configurable: { thread_id: thread_id || 'default' } }
    );

    const response = result.messages.at(-1)?.content || '抱歉，无法获取回答';
    console.log('查询完成:', { response });

    return Response.json({ response });
  } catch (error) {
    const apiError = error as APIError;
    console.error('Weather API Error:', {
      message: apiError.message,
      status: apiError.status,
      type: apiError.error?.type,
      details: apiError.error?.message,
      request_id: apiError.request_id,
    });

    // 根据错误类型返回不同的状态码和消息
    if (apiError.status === 403) {
      return Response.json(
        { error: '访问被拒绝，请检查 API 密钥和代理设置' },
        { status: 403 }
      );
    }

    if (apiError.error?.type === 'rate_limit_error') {
      return Response.json(
        { error: '请求频率过高，请稍后重试' },
        { status: 429 }
      );
    }

    return Response.json(
      { error: '处理请求时发生错误，请稍后重试' },
      { status: 500 }
    );
  }
} 