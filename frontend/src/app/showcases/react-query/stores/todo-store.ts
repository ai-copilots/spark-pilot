// Todo 数据接口
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// API 请求函数
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos?_limit=5`);
  if (!response.ok) {
    throw new Error('获取 Todo 列表失败');
  }
  return response.json();
};

export const addTodo = async (title: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      completed: false,
      userId: 1, // 示例用户 ID
    }),
  });

  if (!response.ok) {
    throw new Error('添加 Todo 失败');
  }
  return response.json();
};

export const toggleTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed: !todo.completed,
    }),
  });

  if (!response.ok) {
    throw new Error('更新 Todo 状态失败');
  }
  return response.json();
}; 