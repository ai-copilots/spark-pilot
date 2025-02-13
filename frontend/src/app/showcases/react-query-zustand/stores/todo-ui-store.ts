import { create } from 'zustand';

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'title' | 'status';
export type SortDirection = 'asc' | 'desc';

interface TodoUIState {
  // 筛选状态
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  
  // 排序状态
  sortBy: TodoSort;
  sortDirection: SortDirection;
  setSorting: (sortBy: TodoSort, direction: SortDirection) => void;
  
  // 搜索状态
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 视图状态
  isCompactView: boolean;
  toggleViewMode: () => void;
}

export const useTodoUIStore = create<TodoUIState>((set) => ({
  // 默认筛选：显示所有
  filter: 'all',
  setFilter: (filter) => set({ filter }),
  
  // 默认排序：按标题升序
  sortBy: 'title',
  sortDirection: 'asc',
  setSorting: (sortBy, sortDirection) => set({ sortBy, sortDirection }),
  
  // 搜索查询
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  // 视图模式
  isCompactView: false,
  toggleViewMode: () => set((state) => ({ isCompactView: !state.isCompactView })),
})); 