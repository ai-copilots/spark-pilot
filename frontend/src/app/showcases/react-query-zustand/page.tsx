'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoControls } from './components/todo-controls';
import { TodoStats } from './components/todo-stats';
import { TodoList } from './components/todo-list';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1分钟后数据过期
      gcTime: 1000 * 60 * 5, // 5分钟后清除缓存
    },
  },
});

export default function ReactQueryZustandShowcase() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4 min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 标题区域 */}
          <div className="space-y-2 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              React Query + Zustand 示例
            </h1>
            <p className="text-xl text-muted-foreground">
              展示 React Query 和 Zustand 的强大组合
            </p>
          </div>

          {/* 统计信息 */}
          <TodoStats />

          {/* 控制面板 */}
          <TodoControls />

          {/* Todo 列表 */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <TodoList />
          </div>

          {/* 说明文档区域 */}
          <div className="space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              功能说明
            </h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>使用 React Query 处理服务器状态（数据获取、缓存、同步）</li>
              <li>使用 Zustand 管理客户端状态（筛选、排序、视图选项）</li>
              <li>展示了状态管理的关注点分离</li>
              <li>实现了高性能的数据处理和UI更新</li>
            </ul>
          </div>

          {/* 技术细节 */}
          <div className="space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              技术亮点
            </h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>使用 React Query 进行数据获取和缓存</li>
              <li>使用 Zustand 管理 UI 状态</li>
              <li>使用 useMemo 优化数据处理</li>
              <li>实现了响应式设计</li>
              <li>遵循了最佳实践和设计模式</li>
            </ul>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
} 