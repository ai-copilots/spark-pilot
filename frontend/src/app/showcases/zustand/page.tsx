import { Counter } from './components/counter'
import { CounterInfo } from './components/counter-info'

export default function ZustandShowcase() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Zustand 状态管理示例
      </h1>
      
      <p className="text-xl text-muted-foreground">
        简单演示 Zustand 在 React 应用中的状态管理功能
      </p>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-8">
          <Counter />
          <CounterInfo />
        </div>
      </div>
    </div>
  )
} 