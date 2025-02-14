'use client';

/**
 * Firecrawl Extract 展示页面
 * 展示从网页提取结构化数据的功能
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// 提取结果类型定义
interface ExtractResult {
  success: boolean;
  data: {
    [key: string]: {
      name?: string;
      price?: string;
      features?: string[];
      pros?: string[];
      cons?: string[];
      [key: string]: unknown;
    }[];
  };
}

// 提取数据的函数
const extractData = async (urls: string[], prompt: string, enableWebSearch: boolean): Promise<ExtractResult> => {
  // 注意：我们不需要在客户端添加代理配置，因为代理是在服务器端处理的
  const response = await fetch('/api/showcases/firecrawl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      prompt,
      enableWebSearch,
    }),
    // 添加缓存配置
    cache: 'no-store', // 每次都获取新数据，因为提取结果可能会变化
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '数据提取失败');
  }

  return response.json();
};

export default function FirecrawlPage() {
  // 状态管理
  const [urls, setUrls] = useState<string[]>(['']);
  const [prompt, setPrompt] = useState('');
  const [enableWebSearch, setEnableWebSearch] = useState(false);

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['extract', urls, prompt, enableWebSearch],
    queryFn: () => extractData(urls.filter(Boolean), prompt, enableWebSearch),
    enabled: false, // 默认不自动请求
  });

  // 处理 URL 输入变化
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // 添加新的 URL 输入框
  const addUrlInput = () => {
    setUrls([...urls, '']);
  };

  // 移除 URL 输入框
  const removeUrlInput = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urls.some(Boolean) && prompt.trim()) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firecrawl Extract API 展示</h1>
      
      {/* 提取表单 */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div className="space-y-2">
          <Label>目标 URL</Label>
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="输入网页 URL..."
              />
              {urls.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeUrlInput(index)}
                >
                  删除
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addUrlInput}
          >
            添加 URL
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">提取提示词</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述需要提取的信息..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="web-search"
            checked={enableWebSearch}
            onCheckedChange={setEnableWebSearch}
          />
          <Label htmlFor="web-search">启用网络搜索补充信息</Label>
        </div>

        <Button
          type="submit"
          disabled={!urls.some(Boolean) || !prompt.trim() || isLoading}
        >
          {isLoading ? '提取中...' : '提取数据'}
        </Button>
      </form>

      {/* 错误状态 */}
      {isError && (
        <div className="text-red-500 mb-4">
          <p>错误: {(error as Error).message}</p>
        </div>
      )}

      {/* 提取结果展示 */}
      {data?.success && (
        <Card>
          <CardHeader>
            <CardTitle>提取结果</CardTitle>
            <CardDescription>从目标网页提取的结构化数据</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 