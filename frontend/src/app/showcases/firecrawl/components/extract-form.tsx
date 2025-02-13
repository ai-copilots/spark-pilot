'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// 表单验证模式
const formSchema = z.object({
  url: z.string().url('请输入有效的 URL'),
  prompt: z.string().min(1, '请输入提取提示'),
  systemPrompt: z.string().optional(),
});

interface ExtractResponse {
  success: boolean;
  data: {
    url?: string;
    title?: string;
    description?: string;
    markdown?: string;
    html?: string;
    extract?: Record<string, unknown>;
  };
  error?: string;
}

// 提取表单组件
export function ExtractForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExtractResponse | null>(null);

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      prompt: '',
      systemPrompt: '',
    },
  });

  // 提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/showcases/firecrawl/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('提取失败:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>目标 URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>
                  输入要提取内容的网页 URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>提取提示</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请提取文章的标题和主要内容..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  描述需要从网页中提取的信息
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="systemPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>系统提示（可选）</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="你是一个专业的内容提取助手..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  自定义系统提示以优化提取结果
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            开始提取
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 