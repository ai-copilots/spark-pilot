import Anthropic from '@anthropic-ai/sdk';
import type { Agent } from 'http';
import { createProxyAgent } from '@/lib/proxy';

// 配置 Anthropic 客户端，包括代理设置
export async function createAnthropicClient() {
  const configuration: {
    apiKey?: string;
    baseURL: string;
    httpAgent?: Agent;
  } = {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com',
  };

  // 添加代理配置
  configuration.httpAgent = await createProxyAgent('anthropic', 'https://api.anthropic.com');

  return new Anthropic(configuration);
}

// 默认的 Anthropic 配置
export const defaultConfig = {
  model: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  max_tokens: 1000,
  // Claude 特有的配置
  system: '你是一个专业、友好的 AI 助手，擅长用中文交流。',
}; 