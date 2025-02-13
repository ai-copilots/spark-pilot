// 数据接口
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface TodoRelation {
  source: string;
  target: string;
  type: 'DEPENDS_ON' | 'BLOCKS';
}

// API 请求函数
export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos');
  if (!response.ok) {
    throw new Error('获取 Todo 列表失败');
  }
  return response.json();
}

export async function fetchTodoRelations(): Promise<TodoRelation[]> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos?action=relations');
  if (!response.ok) {
    throw new Error('获取关系数据失败');
  }
  return response.json();
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      ...todo,
    }),
  });

  if (!response.ok) {
    throw new Error('创建 Todo 失败');
  }
  return response.json();
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update',
      id,
      updates,
    }),
  });

  if (!response.ok) {
    throw new Error('更新 Todo 失败');
  }
  return response.json();
}

export async function addDependency(sourceId: string, targetId: string): Promise<void> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'add-dependency',
      sourceId,
      targetId,
    }),
  });

  if (!response.ok) {
    throw new Error('添加依赖关系失败');
  }
}

export async function removeDependency(sourceId: string, targetId: string): Promise<void> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'remove-dependency',
      sourceId,
      targetId,
    }),
  });

  if (!response.ok) {
    throw new Error('移除依赖关系失败');
  }
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch('/api/showcases/neo4j-react-query/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      id,
    }),
  });

  if (!response.ok) {
    throw new Error('删除 Todo 失败');
  }
}

export async function fetchTodoDependencyChain(id: string): Promise<Todo[]> {
  const response = await fetch(`/api/showcases/neo4j-react-query/todos?action=dependency-chain&id=${id}`);
  if (!response.ok) {
    throw new Error('获取依赖链失败');
  }
  return response.json();
}

export async function fetchBlockedTasks(id: string): Promise<Todo[]> {
  const response = await fetch(`/api/showcases/neo4j-react-query/todos?action=blocked-tasks&id=${id}`);
  if (!response.ok) {
    throw new Error('获取被阻塞任务失败');
  }
  return response.json();
} 