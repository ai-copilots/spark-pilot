'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoList from './components/todo-list';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1分钟后数据过期
      gcTime: 1000 * 60 * 5, // 5分钟后清除缓存
    },
  },
});

export default function ReactQueryShowcase() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4 min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 标题区域 */}
          <div className="space-y-2 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              React Query 示例
            </h1>
            <p className="text-xl text-muted-foreground">
              一个简单的 Todo 应用，展示 React Query 的基本用法和数据管理能力
            </p>
          </div>

          {/* 主要内容区域 */}
          <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <TodoList />
          </div>

          {/* 说明文档区域 */}
          <div className="space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              功能说明
            </h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>支持添加新的 Todo 项目</li>
              <li>可以标记/取消标记 Todo 的完成状态</li>
              <li>展示数据加载和更新状态</li>
              <li>自动处理数据缓存和重新验证</li>
            </ul>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
} 