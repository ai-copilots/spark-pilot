'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// LLM 提供商配置
const LLM_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: '使用 GPT-4 Omega Mini 模型',
    model: 'gpt-4o-mini',
    envKey: 'OPENAI_API_KEY'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: '使用 Claude 3.5 Sonnet 模型',
    model: 'claude-3-5-sonnet-20241022',
    envKey: 'ANTHROPIC_API_KEY'
  }
] as const;

type LLMProvider = typeof LLM_PROVIDERS[number]['id'];

export default function WeatherPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<LLMProvider>('openai');
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<Record<LLMProvider, boolean>>({
    openai: true,
    anthropic: true
  });

  const selectedProvider = LLM_PROVIDERS.find(p => p.id === provider);

  // 检查 API 可用性
  const checkApiStatus = async (provider: LLMProvider) => {
    try {
      const res = await fetch('/api/showcase/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'test',
          thread_id: `status-check-${Date.now()}`,
          provider,
        }),
      });
      
      setApiStatus(prev => ({
        ...prev,
        [provider]: res.status !== 403
      }));
    } catch {
      setApiStatus(prev => ({
        ...prev,
        [provider]: false
      }));
    }
  };

  // 初始检查当前选择的提供商
  useEffect(() => {
    checkApiStatus(provider);
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/showcase/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          thread_id: `weather-${Date.now()}`,
          provider,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : '查询出错，请稍后重试';
      setError(errorMessage);
      
      // 如果是 403 错误，更新 API 状态
      if (errorMessage.includes('访问被拒绝') || errorMessage.includes('403')) {
        setApiStatus(prev => ({
          ...prev,
          [provider]: false
        }));
      }
      
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>天气查询助手</CardTitle>
          <CardDescription>
            使用 AI 助手查询天气信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">选择 AI 模型</label>
                <Select
                  value={provider}
                  onValueChange={(value: LLMProvider) => setProvider(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择 AI 模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {provider.name}
                            {!apiStatus[provider.id] && (
                              <span className="ml-2 text-destructive">⚠️</span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {provider.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!apiStatus[provider] && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {`${selectedProvider?.name} API 访问受限。请检查 ${selectedProvider?.envKey} 环境变量配置是否正确。`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入城市名称，例如：旧金山现在天气怎么样？"
                  disabled={loading || !apiStatus[provider]}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !apiStatus[provider]}
                  title={!apiStatus[provider] ? 'API 访问受限' : undefined}
                >
                  {loading ? '查询中...' : '查询'}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              {response && !error && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">
                    使用 {selectedProvider?.name} ({selectedProvider?.model})
                  </div>
                  {response}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 