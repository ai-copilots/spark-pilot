import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { weatherTool } from './tools';
import { createProxyAgent } from '@/lib/proxy';

// LLM 提供商类型
type LLMProvider = 'openai' | 'anthropic';

// 创建天气查询助手
export async function createWeatherAssistant(provider: LLMProvider = 'openai') {
  let llm;

  if (provider === 'openai') {
    // 初始化 OpenAI 客户端
    const httpAgent = await createProxyAgent('openai', 'https://api.openai.com');
    llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      configuration: {
        baseURL: 'https://api.openai.com/v1',
        httpAgent,
      },
    });
  } else {
    // 初始化 Anthropic 客户端
    const httpAgent = await createProxyAgent('anthropic', 'https://api.anthropic.com');
    llm = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      // @ts-expect-error - Anthropic 客户端支持代理配置，但类型定义不完整
      httpAgent,
    });
  }

  // 设置工具列表
  const tools = [weatherTool];

  // 初始化内存以在图运行之间保持状态
  const checkpointer = new MemorySaver();

  // 创建 ReAct 代理
  const app = createReactAgent({
    llm,
    tools,
    checkpointSaver: checkpointer,
  });

  return app;
}

// 使用示例：
/*
const assistant = await createWeatherAssistant('openai'); // 或 'anthropic'
const result = await assistant.invoke(
  {
    messages: [{
      role: 'user',
      content: '旧金山现在天气怎么样？'
    }]
  },
  { configurable: { thread_id: 'weather-123' } }
);
console.log(result.messages.at(-1)?.content);
*/ 