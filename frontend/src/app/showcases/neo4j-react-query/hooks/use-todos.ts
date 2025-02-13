import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Todo,
  fetchTodos,
  fetchTodoRelations,
  createTodo,
  updateTodo,
  deleteTodo,
  addDependency,
  removeDependency,
  fetchTodoDependencyChain,
  fetchBlockedTasks,
} from '../stores/todo-neo4j';
import { useUIStore } from '../stores/ui-store';

export function useTodos() {
  const queryClient = useQueryClient();
  const {
    filter,
    sortBy,
    sortDirection,
    searchQuery,
    viewMode,
    selectedTodoId,
  } = useUIStore();

  // 获取所有任务
  const { data: todos = [], ...todosQuery } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 获取任务关系
  const { data: relations = [] } = useQuery({
    queryKey: ['todo-relations'],
    queryFn: fetchTodoRelations,
    enabled: viewMode === 'graph',
  });

  // 获取选中任务的依赖链
  const { data: dependencyChain = [] } = useQuery({
    queryKey: ['todo-dependency-chain', selectedTodoId],
    queryFn: () => fetchTodoDependencyChain(selectedTodoId!),
    enabled: !!selectedTodoId,
  });

  // 获取被阻塞的任务
  const { data: blockedTasks = [] } = useQuery({
    queryKey: ['blocked-tasks', selectedTodoId],
    queryFn: () => fetchBlockedTasks(selectedTodoId!),
    enabled: !!selectedTodoId,
  });

  // 创建任务
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 更新任务
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Todo> }) =>
      updateTodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 删除任务
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 添加依赖关系
  const addDependencyMutation = useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      addDependency(sourceId, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-relations'] });
      queryClient.invalidateQueries({ queryKey: ['todo-dependency-chain'] });
      queryClient.invalidateQueries({ queryKey: ['blocked-tasks'] });
    },
  });

  // 移除依赖关系
  const removeDependencyMutation = useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      removeDependency(sourceId, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-relations'] });
      queryClient.invalidateQueries({ queryKey: ['todo-dependency-chain'] });
      queryClient.invalidateQueries({ queryKey: ['blocked-tasks'] });
    },
  });

  // 处理数据过滤、排序和搜索
  const processedTodos = useMemo(() => {
    let result = [...todos];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 状态过滤
    if (filter !== 'all') {
      result = result.filter((todo) =>
        filter === 'completed' ? todo.completed : !todo.completed
      );
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'createdAt') {
        // 确保日期字符串可以正确比较
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 0, medium: 1, high: 2 };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return sortDirection === 'asc' ? -diff : diff;
      } else {
        // 按依赖数量排序
        const aDeps = a.dependencies?.length || 0;
        const bDeps = b.dependencies?.length || 0;
        return sortDirection === 'asc' ? aDeps - bDeps : bDeps - aDeps;
      }
    });

    return result;
  }, [todos, filter, sortBy, sortDirection, searchQuery]);

  // 计算统计信息
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const filteredCount = processedTodos.length;
    const dependencyCount = relations.length;

    return {
      total,
      completed,
      active,
      filteredCount,
      dependencyCount,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [todos, processedTodos, relations]);

  return {
    todos: processedTodos,
    relations,
    dependencyChain,
    blockedTasks,
    stats,
    ...todosQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    addDependencyMutation,
    removeDependencyMutation,
  };
} 