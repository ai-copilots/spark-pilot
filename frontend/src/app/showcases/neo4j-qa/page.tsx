'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/**
 * Neo4j 图数据库问答展示页面
 */
export default function Neo4jQAShowcase() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cypherQuery, setCypherQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 处理问答请求
  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    setCypherQuery('');

    try {
      const res = await fetch('/api/showcases/neo4j-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '查询失败');
      }

      setAnswer(data.answer);
      if (data.intermediateSteps?.cypher) {
        setCypherQuery(data.intermediateSteps.cypher);
      }
    } catch (error) {
      console.error('问答错误:', error);
      setAnswer(`查询失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Neo4j 图数据库智能问答</h1>
      
      {/* 输入区域 */}
      <Card className="p-4">
        <Label htmlFor="question">输入问题</Label>
        <Textarea
          id="question"
          placeholder="例如：'谁出演了电影《Casino》？' 或 '查找由 Martin Scorsese 导演的所有电影...'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px] mt-2"
        />
        <Button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="mt-4"
        >
          {loading ? '查询中...' : '提问'}
        </Button>
      </Card>

      {/* 生成的 Cypher 查询 */}
      {cypherQuery && (
        <Card className="p-4">
          <Label className="text-base font-semibold">生成的 Cypher 查询</Label>
          <pre className="bg-muted/50 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{cypherQuery}</code>
          </pre>
        </Card>
      )}

      {/* 答案区域 */}
      <Card className="p-4">
        <Label className="text-base font-semibold">回答</Label>
        <div className="relative rounded-md border bg-muted/50 p-6 mt-2 min-h-[100px]">
          {answer ? (
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {answer}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              答案将显示在这里...
            </p>
          )}
        </div>
      </Card>

      {/* 示例问题 */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">示例问题</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setQuestion('谁出演了电影《Casino》？')}
          >
            电影演员
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setQuestion('Martin Scorsese 导演了哪些电影？')}
          >
            导演作品
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setQuestion('找出评分最高的5部动作片。')}
          >
            高分电影
          </Button>
        </div>
      </Card>
    </div>
  );
} 