'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, fetchTodos, addTodo, toggleTodo } from '../stores/todo-store';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  // 获取 Todo 列表的查询
  const { data: todos, isLoading, error, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 添加 Todo 的变更（使用乐观更新）
  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTitle) => {
      // 取消任何传出的重新获取
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 获取当前数据的快照
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // 乐观更新
      const optimisticTodo: Todo = {
        id: Date.now(), // 临时 ID
        title: newTitle,
        completed: false,
      };

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [...old, optimisticTodo]);

      // 返回上下文对象
      return { previousTodos };
    },
    onError: (err, newTitle, context) => {
      // 发生错误时回滚到之前的数据
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },
    onSettled: () => {
      // 无论成功或失败，都重新获取数据
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
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-3 rounded-md border border-border bg-card 
              hover:bg-accent/50 transition-colors"
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
      {todos?.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          暂无待办事项，请添加新的 Todo
        </p>
      )}
    </div>
  );
} 