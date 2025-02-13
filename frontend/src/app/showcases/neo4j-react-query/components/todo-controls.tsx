'use client';

import { useUIStore } from '../stores/ui-store';
import { TodoFilters } from './todo-filters';
import type { ViewMode } from '../stores/ui-store';

export function TodoControls() {
  const {
    viewMode,
    setViewMode,
    graphSettings,
    updateGraphSettings,
  } = useUIStore();

  return (
    <div className="space-y-6">
      {/* 视图切换 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex rounded-lg border border-input bg-background">
          <ViewButton current={viewMode} value="list" onClick={setViewMode}>
            列表视图
          </ViewButton>
          <ViewButton current={viewMode} value="graph" onClick={setViewMode}>
            图形视图
          </ViewButton>
          <ViewButton current={viewMode} value="timeline" onClick={setViewMode}>
            时间线
          </ViewButton>
        </div>
      </div>

      {/* 图形视图设置 */}
      {viewMode === 'graph' && (
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">图形视图设置</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={graphSettings.showCompleted}
                onChange={(e) =>
                  updateGraphSettings({ showCompleted: e.target.checked })
                }
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm">显示已完成</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={graphSettings.showDependencies}
                onChange={(e) =>
                  updateGraphSettings({ showDependencies: e.target.checked })
                }
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm">显示依赖关系</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={graphSettings.showBlocked}
                onChange={(e) =>
                  updateGraphSettings({ showBlocked: e.target.checked })
                }
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm">显示阻塞任务</span>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">布局：</span>
            <div className="flex rounded-lg border border-input bg-background">
              <LayoutButton
                current={graphSettings.layout}
                value="force"
                onClick={(layout) => updateGraphSettings({ layout })}
              >
                力导向
              </LayoutButton>
              <LayoutButton
                current={graphSettings.layout}
                value="dagre"
                onClick={(layout) => updateGraphSettings({ layout })}
              >
                层次
              </LayoutButton>
              <LayoutButton
                current={graphSettings.layout}
                value="circular"
                onClick={(layout) => updateGraphSettings({ layout })}
              >
                环形
              </LayoutButton>
            </div>
          </div>
        </div>
      )}

      {/* 列表视图筛选器 */}
      {viewMode === 'list' && (
        <div className="rounded-lg border bg-card p-4">
          <TodoFilters />
        </div>
      )}
    </div>
  );
}

// 视图切换按钮
function ViewButton({
  current,
  value,
  onClick,
  children,
}: {
  current: ViewMode;
  value: ViewMode;
  onClick: (value: ViewMode) => void;
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

// 布局切换按钮
function LayoutButton({
  current,
  value,
  onClick,
  children,
}: {
  current: 'force' | 'dagre' | 'circular';
  value: 'force' | 'dagre' | 'circular';
  onClick: (value: 'force' | 'dagre' | 'circular') => void;
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