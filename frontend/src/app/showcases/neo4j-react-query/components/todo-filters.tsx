'use client';

import { useUIStore } from '../stores/ui-store';

export function TodoFilters() {
  const { filters, updateFilters, resetFilters, sort, updateSort } = useUIStore();

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-muted-foreground">
          搜索
        </label>
        <input
          id="search"
          type="search"
          placeholder="搜索待办事项..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* 优先级筛选 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">优先级</label>
        <div className="flex flex-wrap gap-2">
          {(['low', 'medium', 'high'] as const).map((priority) => (
            <label key={priority} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.priority.includes(priority)}
                onChange={(e) => {
                  const newPriorities = e.target.checked
                    ? [...filters.priority, priority]
                    : filters.priority.filter((p) => p !== priority);
                  updateFilters({ priority: newPriorities });
                }}
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm">
                {priority === 'low' && '低'}
                {priority === 'medium' && '中'}
                {priority === 'high' && '高'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 完成状态筛选 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">完成状态</label>
        <div className="flex rounded-lg border border-input bg-background">
          <button
            className={`flex-1 px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${filters.completed === null
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
              }`}
            onClick={() => updateFilters({ completed: null })}
          >
            全部
          </button>
          <button
            className={`flex-1 px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${filters.completed === false
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
              }`}
            onClick={() => updateFilters({ completed: false })}
          >
            进行中
          </button>
          <button
            className={`flex-1 px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${filters.completed === true
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
              }`}
            onClick={() => updateFilters({ completed: true })}
          >
            已完成
          </button>
        </div>
      </div>

      {/* 排序 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">排序</label>
        <div className="flex gap-2">
          <select
            value={sort.field}
            onChange={(e) => updateSort({ field: e.target.value as typeof sort.field })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="createdAt">创建时间</option>
            <option value="title">标题</option>
            <option value="priority">优先级</option>
          </select>
          <button
            onClick={() => updateSort({ direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            {sort.direction === 'asc' ? '升序' : '降序'}
          </button>
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={resetFilters}
        className="w-full inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        重置筛选器
      </button>
    </div>
  );
} 