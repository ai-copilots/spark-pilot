'use client';

import { useTodoUIStore } from '../stores/todo-ui-store';
import type { TodoFilter, TodoSort, SortDirection } from '../stores/todo-ui-store';

export function TodoControls() {
  const {
    filter,
    setFilter,
    sortBy,
    sortDirection,
    setSorting,
    searchQuery,
    setSearchQuery,
    isCompactView,
    toggleViewMode,
  } = useTodoUIStore();

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索待办事项..."
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background 
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* 筛选按钮组 */}
        <div className="flex rounded-lg border border-input bg-background">
          <FilterButton current={filter} value="all" onClick={setFilter}>
            全部
          </FilterButton>
          <FilterButton current={filter} value="active" onClick={setFilter}>
            进行中
          </FilterButton>
          <FilterButton current={filter} value="completed" onClick={setFilter}>
            已完成
          </FilterButton>
        </div>

        {/* 排序控制 */}
        <div className="flex rounded-lg border border-input bg-background">
          <SortButton
            current={sortBy}
            direction={sortDirection}
            value="title"
            onClick={(value) => setSorting(value, sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            按标题
          </SortButton>
          <SortButton
            current={sortBy}
            direction={sortDirection}
            value="status"
            onClick={(value) => setSorting(value, sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            按状态
          </SortButton>
        </div>

        {/* 视图切换 */}
        <button
          onClick={toggleViewMode}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-input bg-background
            hover:bg-accent hover:text-accent-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isCompactView ? '详细视图' : '紧凑视图'}
        </button>
      </div>
    </div>
  );
}

// 筛选按钮组件
function FilterButton({
  current,
  value,
  onClick,
  children,
}: {
  current: TodoFilter;
  value: TodoFilter;
  onClick: (value: TodoFilter) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${current === value
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
    >
      {children}
    </button>
  );
}

// 排序按钮组件
function SortButton({
  current,
  direction,
  value,
  onClick,
  children,
}: {
  current: TodoSort;
  direction: SortDirection;
  value: TodoSort;
  onClick: (value: TodoSort) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${current === value
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
    >
      {children}
      {current === value && (
        <span className="ml-1">
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
} 