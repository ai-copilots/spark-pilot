'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addTodo, toggleTodo } from '../stores/todo-store';
import { useTodos } from '../hooks/use-todos';
import type { Todo } from '../stores/todo-store';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();
  const { todos, isLoading, error, isError, isCompactView } = useTodos();

  // 添加 Todo 的变更（使用乐观更新）
  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTitle) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [
        ...old,
        {
          id: Date.now(),
          title: newTitle,
          completed: false,
        },
      ]);

      return { previousTodos };
    },
    onError: (err, newTitle, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodo('');
    },
  });

  // 切换 Todo 状态的变更（使用乐观更新）
  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (targetTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map((todo) =>
          todo.id === targetTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <p className="text-lg text-muted-foreground">加载中...</p>
    </div>
  );

  if (isError) return (
    <div className="p-4 rounded-md bg-destructive/10 text-destructive">
      <p>错误: {error.message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 添加新 Todo 的表单 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTodo.trim()) {
            addMutation.mutate(newTodo);
          }
        }}
        className="space-y-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="输入新的 Todo"
            className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background 
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground 
              hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
              focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {addMutation.isPending ? '添加中...' : '添加'}
          </button>
        </div>
      </form>

      {/* Todo 列表 */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-3 rounded-md border border-border
              transition-colors ${
                isCompactView
                  ? 'p-2 hover:bg-accent/30'
                  : 'p-4 bg-card hover:bg-accent/50'
              }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleMutation.mutate(todo)}
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
            />
            <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.title}
            </span>
            {toggleMutation.isPending && toggleMutation.variables?.id === todo.id && (
              <span className="text-xs text-muted-foreground">更新中...</span>
            )}
          </li>
        ))}
      </ul>

      {/* 列表为空时的提示 */}
      {todos.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          暂无待办事项，请添加新的 Todo
        </p>
      )}
    </div>
  );
} 