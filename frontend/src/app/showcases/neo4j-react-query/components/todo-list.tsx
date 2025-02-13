'use client';

import { useMemo } from 'react';
import { useTodos } from '../hooks/use-todos';
import { useUIStore } from '../stores/ui-store';
import type { Todo } from '../stores/todo-neo4j';

export function TodoList() {
  const { todos, isLoading, error } = useTodos();
  const { filters, sort } = useUIStore();

  // 处理过的 todos
  const processedTodos = useMemo(() => {
    if (!todos) return [];

    // 筛选
    const filtered = todos.filter((todo) => {
      // 优先级筛选
      if (!filters.priority.includes(todo.priority)) {
        return false;
      }
      // 完成状态筛选
      if (filters.completed !== null && todo.completed !== filters.completed) {
        return false;
      }
      // 搜索筛选
      if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'title':
          return direction * a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          return direction * (priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'createdAt':
        default:
          return direction * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    });

    return filtered;
  }, [todos, filters, sort]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">加载失败: {error.message}</div>
      </div>
    );
  }

  if (!processedTodos.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>暂无待办事项</p>
        {(filters.priority.length < 3 || filters.completed !== null || filters.search) && (
          <p className="mt-2 text-sm">
            提示：尝试调整筛选条件以查看更多待办事项
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {processedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className={`p-4 rounded-lg border bg-card ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium truncate ${todo.completed ? 'line-through' : ''}`}>
              {todo.title}
            </h3>
            <PriorityBadge priority={todo.priority} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            创建于 {new Date(todo.createdAt).toLocaleString('zh-CN')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={() => {/* TODO: 实现编辑功能 */}}
          >
            编辑
          </button>
          <button
            className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {/* TODO: 实现删除功能 */}}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Todo['priority'] }) {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const labels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[priority]}`}>
      {labels[priority]}优先级
    </span>
  );
} 