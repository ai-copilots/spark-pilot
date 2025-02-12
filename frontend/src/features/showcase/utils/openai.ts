import OpenAI from 'openai';
import type { Agent } from 'http';
import { createProxyAgent } from '@/lib/proxy';

// 配置 OpenAI 客户端，包括代理设置
export async function createOpenAIClient() {
  const configuration: {
    apiKey?: string;
    baseURL: string;
    httpAgent?: Agent;
  } = {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
  };

  // 添加代理配置
  configuration.httpAgent = await createProxyAgent('openai', 'https://api.openai.com');

  return new OpenAI(configuration);
}

// 默认的 OpenAI 配置
export const defaultConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1000,
}; 