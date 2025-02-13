import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchTodos } from '../stores/todo-store';
import { useTodoUIStore } from '../stores/todo-ui-store';

export function useTodos() {
  // 从 Zustand 获取 UI 状态
  const { filter, sortBy, sortDirection, searchQuery, isCompactView } = useTodoUIStore();

  // 使用 React Query 获取数据
  const { data: todos = [], ...queryInfo } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 使用 useMemo 处理数据过滤、排序和搜索
  const processedTodos = useMemo(() => {
    let result = [...todos];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 状态过滤
    if (filter !== 'all') {
      result = result.filter(todo =>
        filter === 'completed' ? todo.completed : !todo.completed
      );
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        // 按状态排序
        const statusA = a.completed ? 1 : 0;
        const statusB = b.completed ? 1 : 0;
        return sortDirection === 'asc'
          ? statusA - statusB
          : statusB - statusA;
      }
    });

    return result;
  }, [todos, filter, sortBy, sortDirection, searchQuery]);

  // 计算统计信息
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const filteredCount = processedTodos.length;

    return {
      total,
      completed,
      active,
      filteredCount,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [todos, processedTodos]);

  return {
    todos: processedTodos,
    stats,
    isCompactView,
    ...queryInfo,
  };
} 