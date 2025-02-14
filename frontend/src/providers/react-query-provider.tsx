'use client';

/**
 * React Query Provider
 * 为应用提供 React Query 功能
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // 在组件内部创建 QueryClient 实例以避免在服务器端和客户端之间共享状态
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 全局默认配置
            staleTime: 60 * 1000, // 数据在 60 秒内被认为是新鲜的
            retry: 1, // 失败重试次数
            refetchOnWindowFocus: false, // 窗口获得焦点时不重新获取数据
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 