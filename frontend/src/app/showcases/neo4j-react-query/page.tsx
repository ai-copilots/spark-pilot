'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoGraph } from './components/todo-graph';
import { TodoList } from './components/todo-list';
import { TodoForm } from './components/todo-form';
import { TodoControls } from './components/todo-controls';
import { useUIStore } from './stores/ui-store';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1分钟后数据过期
      gcTime: 1000 * 60 * 5, // 5分钟后清除缓存
    },
  },
});

function ShowcaseContent() {
  const { viewMode } = useUIStore();

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题区域 */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Neo4j + React Query + Zustand 示例
          </h1>
          <p className="text-xl text-muted-foreground">
            展示图数据库、服务器状态和客户端状态管理的完美结合
          </p>
        </div>

        {/* 控制面板 */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <TodoControls />
        </div>

        {/* 添加待办事项表单 */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <TodoForm />
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 gap-8">
          {viewMode === 'graph' && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <TodoGraph />
            </div>
          )}
          {viewMode === 'list' && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <TodoList />
            </div>
          )}
          {viewMode === 'timeline' && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="text-center text-muted-foreground">时间线视图开发中...</div>
            </div>
          )}
        </div>

        {/* 说明文档区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
              功能说明
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                使用 Neo4j 存储任务和依赖关系
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                使用 React Query 处理服务器状态
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                使用 Zustand 管理客户端状态
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                使用 D3.js 实现任务依赖关系的可视化
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                支持任务的 CRUD 操作和依赖关系管理
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
              技术亮点
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Neo4j 图数据库的高效查询和关系管理
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                React Query 的数据获取和缓存策略
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Zustand 的简洁状态管理
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                D3.js 的力导向图布局
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                TypeScript 的类型安全
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Neo4jReactQueryShowcase() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowcaseContent />
    </QueryClientProvider>
  );
} 