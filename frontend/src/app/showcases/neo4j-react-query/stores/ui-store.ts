import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 视图模式类型
export type ViewMode = 'list' | 'graph' | 'timeline';
export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'createdAt' | 'priority' | 'dependencies';
export type SortDirection = 'asc' | 'desc';

interface GraphSettings {
  showCompleted: boolean;
  showDependencies: boolean;
  showBlocked: boolean;
  layout: 'force' | 'dagre' | 'circular';
}

interface Filters {
  priority: ('low' | 'medium' | 'high')[];
  completed: boolean | null;
  search: string;
}

interface Sort {
  field: 'title' | 'createdAt' | 'priority';
  direction: 'asc' | 'desc';
}

interface UIState {
  // 视图模式
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

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

  // 选中的任务
  selectedTodoId: string | null;
  setSelectedTodoId: (id: string | null) => void;

  // 依赖管理模式
  isDependencyMode: boolean;
  setDependencyMode: (isActive: boolean) => void;

  // 图形视图设置
  graphSettings: GraphSettings;
  updateGraphSettings: (settings: Partial<GraphSettings>) => void;

  // 筛选器
  filters: Filters;
  updateFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;

  // 排序
  sort: Sort;
  updateSort: (sort: Partial<Sort>) => void;
}

const defaultGraphSettings: GraphSettings = {
  showCompleted: true,
  showDependencies: true,
  showBlocked: true,
  layout: 'force',
};

const defaultFilters: Filters = {
  priority: ['low', 'medium', 'high'],
  completed: null,
  search: '',
};

const defaultSort: Sort = {
  field: 'createdAt',
  direction: 'desc',
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 默认视图模式
      viewMode: 'list',
      setViewMode: (viewMode) => set({ viewMode }),

      // 默认筛选：显示所有
      filter: 'all',
      setFilter: (filter) => set({ filter }),

      // 默认排序：按创建时间降序
      sortBy: 'createdAt',
      sortDirection: 'desc',
      setSorting: (sortBy, sortDirection) => set({ sortBy, sortDirection }),

      // 搜索查询
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // 选中的任务
      selectedTodoId: null,
      setSelectedTodoId: (selectedTodoId) => set({ selectedTodoId }),

      // 依赖管理模式
      isDependencyMode: false,
      setDependencyMode: (isDependencyMode) => set({ isDependencyMode }),

      // 图形视图设置
      graphSettings: defaultGraphSettings,
      updateGraphSettings: (settings) =>
        set((state) => ({
          graphSettings: { ...state.graphSettings, ...settings },
        })),

      // 筛选器
      filters: defaultFilters,
      updateFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // 排序
      sort: defaultSort,
      updateSort: (sort) =>
        set((state) => ({
          sort: { ...state.sort, ...sort },
        })),
    }),
    {
      name: 'todo-ui-store',
      version: 1,
    }
  )
); 