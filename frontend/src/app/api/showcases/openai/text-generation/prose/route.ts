import { OpenAI } from 'openai';
import { createProxyAgent } from '@/lib/proxy';
import { NextRequest } from 'next/server';

// 创建 OpenAI 客户端实例
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 模型配置
const MODEL_CONFIG = {
  'gpt-4o': {
    model: 'gpt-4o',  // 最新的 GPT-4 Turbo 模型
    max_context_length: 128000,     // 支持更长的上下文
  },
  'gpt-4o-mini': {
    model: 'gpt-4o-mini',        // GPT-3.5 Turbo 模型
    max_context_length: 16385,      // 较短的上下文长度
  },
} as const;

type ModelType = keyof typeof MODEL_CONFIG;

/**
 * 处理文本生成请求
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求参数
    const { prompt, model, temperature, max_tokens } = await request.json();

    // 参数验证
    if (!prompt?.trim()) {
      return Response.json({ error: '提示词不能为空' }, { status: 400 });
    }

    // 验证模型类型
    if (model && !(model in MODEL_CONFIG)) {
      return Response.json({ error: '不支持的模型类型' }, { status: 400 });
    }

    // 设置代理（如果需要）
    const agent = await createProxyAgent(
      { timeout: 60000 }, // 增加超时时间
      'https://api.openai.com'
    );

    if (agent) {
      openai.httpAgent = agent;
    }

    // 获取模型配置
    const modelConfig = MODEL_CONFIG[model as ModelType] || MODEL_CONFIG['gpt-4o'];

    // 调用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文本创作助手，擅长生成高质量的文本内容。请用中文回复。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: temperature || 0.7,
      max_tokens: Math.min(max_tokens || 500, modelConfig.max_context_length / 2),
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    // 提取生成的文本
    const generatedText = completion.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error('未能生成有效的文本响应');
    }

    // 返回响应
    return Response.json({ text: generatedText });

  } catch (error) {
    console.error('OpenAI API 错误:', error);
    
    // 错误处理
    return Response.json({
      error: '生成文本时发生错误',
      details: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
} 