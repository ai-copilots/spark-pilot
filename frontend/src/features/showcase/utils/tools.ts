import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// 定义一个简单的天气搜索工具
export const weatherTool = tool(
  async ({ query }) => {
    // 这是一个模拟的实现
    if (query.toLowerCase().includes('sf') || query.toLowerCase().includes('san francisco')) {
      return '旧金山现在是 15 度，多云。';
    }
    if (query.toLowerCase().includes('ny') || query.toLowerCase().includes('new york')) {
      return '纽约现在是 25 度，晴天。';
    }
    return '抱歉，无法获取该地区的天气信息。';
  },
  {
    name: 'weather',
    description: '查询指定城市的天气信息',
    schema: z.object({
      query: z.string().describe('要查询天气的城市名称'),
    }),
  }
); 