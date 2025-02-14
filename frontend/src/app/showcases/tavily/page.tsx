'use client';

/**
 * Tavily 搜索展示页面
 * 展示 AI 优化的搜索结果
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// 搜索结果类型定义
interface SearchResult {
  answer: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
  }>;
}

// 获取搜索结果的函数
const fetchSearchResults = async (query: string, depth: string): Promise<SearchResult> => {
  const response = await fetch(`/api/showcases/tavily?q=${encodeURIComponent(query)}&depth=${depth}`);
  if (!response.ok) {
    throw new Error('搜索请求失败');
  }
  return response.json();
};

export default function TavilyPage() {
  // 状态管理
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState('basic');

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['search', query, depth],
    queryFn: () => fetchSearchResults(query, depth),
    enabled: false, // 默认不自动请求
  });

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tavily AI 搜索展示</h1>
      
      {/* 搜索表单 */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="search">搜索查询</Label>
          <Input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入搜索内容..."
          />
        </div>
        
        <div>
          <Label>搜索深度</Label>
          <RadioGroup value={depth} onValueChange={setDepth} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic">基础</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">高级</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" disabled={!query.trim()}>
          搜索
        </Button>
      </form>

      {/* 加载状态 */}
      {isLoading && (
        <div className="text-center">
          <p>搜索中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="text-red-500">
          <p>错误: {(error as Error).message}</p>
        </div>
      )}

      {/* 搜索结果展示 */}
      {data && (
        <div className="space-y-4">
          {/* AI 生成的答案 */}
          <Card>
            <CardHeader>
              <CardTitle>AI 总结</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.answer}</p>
            </CardContent>
          </Card>

          {/* 搜索结果列表 */}
          <Card>
            <CardHeader>
              <CardTitle>搜索结果</CardTitle>
              <CardDescription>找到 {data.results.length} 个相关结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.results.map((result, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <a 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-medium"
                    >
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{result.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 