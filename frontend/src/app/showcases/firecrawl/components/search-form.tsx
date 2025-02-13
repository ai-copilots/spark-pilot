'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// 表单验证模式
const formSchema = z.object({
  query: z.string().min(1, '请输入搜索关键词'),
  limit: z.number().min(1).max(50).default(10),
  lang: z.string().default('zh'),
  country: z.string().default('cn'),
});

interface SearchDocument {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
  html?: string;
}

interface SearchResponse {
  success: boolean;
  data: SearchDocument[];
  error?: string;
}

// 搜索表单组件
export function SearchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchDocument[]>([]);

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      limit: 10,
      lang: 'zh',
      country: 'cn',
    },
  });

  // 提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/showcases/firecrawl/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json() as SearchResponse;
      setResult(data.data || []);
    } catch (error) {
      console.error('搜索失败:', error);
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
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>搜索关键词</FormLabel>
                <FormControl>
                  <Input placeholder="输入搜索关键词..." {...field} />
                </FormControl>
                <FormDescription>
                  输入要搜索的关键词或短语
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>结果数量</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={field.value || ''}
                    onChange={e => {
                      const value = e.target.value === '' ? '' : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  设置返回的搜索结果数量（1-50）
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>语言</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="en">英文</SelectItem>
                    <SelectItem value="ja">日文</SelectItem>
                    <SelectItem value="ko">韩文</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  选择搜索结果的语言
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>地区</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择地区" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cn">中国</SelectItem>
                    <SelectItem value="hk">香港</SelectItem>
                    <SelectItem value="tw">台湾</SelectItem>
                    <SelectItem value="us">美国</SelectItem>
                    <SelectItem value="jp">日本</SelectItem>
                    <SelectItem value="kr">韩国</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  选择搜索结果的地区
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            开始搜索
          </Button>
        </form>
      </Form>

      {result.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {result.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium mb-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 