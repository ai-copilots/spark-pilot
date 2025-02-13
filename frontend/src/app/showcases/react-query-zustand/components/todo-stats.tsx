'use client';

import { useTodos } from '../hooks/use-todos';

export function TodoStats() {
  const { stats } = useTodos();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="总计"
        value={stats.total}
        description="所有待办事项"
      />
      <StatCard
        label="已完成"
        value={stats.completed}
        description={`完成率 ${stats.completionRate.toFixed(1)}%`}
      />
      <StatCard
        label="进行中"
        value={stats.active}
        description="未完成的事项"
      />
      <StatCard
        label="筛选"
        value={stats.filteredCount}
        description="当前显示的事项"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
} 