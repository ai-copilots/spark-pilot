'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

/**
 * OpenAI 文本生成展示页面
 * 展示了不同场景下的文本生成应用
 */
export default function TextGenerationShowcase() {
  // 状态管理
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);

  // 处理文本生成请求
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(''); // 清空之前的响应

    try {
      const res = await fetch('/api/showcases/openai/text-generation/prose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      if (data.text) {
        setResponse(data.text);
      } else {
        throw new Error('返回的数据格式不正确');
      }
    } catch (error) {
      console.error('生成错误:', error);
      setResponse(
        `生成失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">OpenAI 文本生成展示</h1>
      
      {/* 配置区域 */}
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>模型选择</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4O（完整版）</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4O Mini（轻量版）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>温度 (Temperature): {temperature}</Label>
          <Slider
            value={[temperature]}
            onValueChange={([value]) => setTemperature(value)}
            min={0}
            max={2}
            step={0.1}
          />
          <p className="text-sm text-gray-500">
            控制输出的随机性：0 表示非常确定，2 表示非常创造性
          </p>
        </div>

        <div className="space-y-2">
          <Label>最大令牌数: {maxTokens}</Label>
          <Slider
            value={[maxTokens]}
            onValueChange={([value]) => setMaxTokens(value)}
            min={100}
            max={2000}
            step={100}
          />
          <p className="text-sm text-gray-500">
            控制生成文本的最大长度
          </p>
        </div>
      </Card>

      {/* 输入区域 */}
      <Card className="p-4">
        <Label htmlFor="prompt">输入提示词</Label>
        <Textarea
          id="prompt"
          placeholder="输入你的提示词..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] mt-2"
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-4"
        >
          {loading ? '生成中...' : '生成文本'}
        </Button>
      </Card>

      {/* 输出区域 */}
      <Card className="p-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold">生成结果</Label>
          <div 
            className="relative rounded-md border bg-muted/50 p-6 min-h-[200px] font-mono text-sm leading-relaxed overflow-auto"
          >
            {response ? (
              <div className="prose prose-zinc dark:prose-invert max-w-none break-words">
                {response}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                生成的文本将显示在这里...
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 示例提示词 */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">示例提示词</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setPrompt('写一个关于春天的短诗。')}
          >
            生成诗歌
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setPrompt('解释量子计算的基本原理，使用通俗易懂的语言。')}
          >
            科普解释
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setPrompt('为一个新的智能手机应用写一个产品描述。')}
          >
            产品文案
          </Button>
        </div>
      </Card>
    </div>
  );
}

