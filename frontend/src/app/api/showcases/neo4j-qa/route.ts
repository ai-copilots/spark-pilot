import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from 'next/server';
import { createProxyAgent } from '@/lib/proxy';

// 删除未使用的 OpenAI 实例
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

/**
 * 处理图数据库问答请求
 */
export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question?.trim()) {
      return Response.json({ error: '问题不能为空' }, { status: 400 });
    }

    // 初始化 Neo4j 图数据库连接
    const graph = await Neo4jGraph.initialize({ 
      url: process.env.NEO4J_URI!,
      username: process.env.NEO4J_USERNAME!,
      password: process.env.NEO4J_PASSWORD!,
    });

    // 设置代理（如果需要）
    const agent = await createProxyAgent(
      { timeout: 60000 }, // 增加超时时间
      'https://api.openai.com'
    );

    // 创建 LLM 实例，添加代理配置
    const llm = new ChatOpenAI({ 
      modelName: "gpt-4o",
      temperature: 0,
      configuration: {
        httpAgent: agent || undefined,
        baseURL: process.env.OPENAI_API_BASE_URL,
      },
    });

    // 创建问答链
    const chain = GraphCypherQAChain.fromLLM({
      llm,
      graph,
      returnDirect: false,
      returnIntermediateSteps: true,
    });

    // 执行问答
    const response = await chain.invoke({
      query: question,
    });

    // 关闭数据库连接
    await graph.close();

    return Response.json({
      answer: response.result,
      intermediateSteps: response.intermediateSteps,
    });

  } catch (error) {
    console.error('Neo4j QA 错误:', error);
    return Response.json({
      error: '处理问题时发生错误',
      details: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
} 