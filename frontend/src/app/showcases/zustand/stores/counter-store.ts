import { create } from 'zustand'

// 定义状态类型
export type CounterState = {
  count: number
  lastUpdated: string
}

// 定义操作类型
export type CounterActions = {
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 组合状态和操作
export type CounterStore = CounterState & CounterActions

// 默认初始状态
export const defaultInitState: CounterState = {
  count: 0,
  lastUpdated: '-'
}

// 创建 store
export const useCounterStore = create<CounterStore>()((set) => ({
  ...defaultInitState,
  increment: () => set((state) => ({ 
    count: state.count + 1,
    lastUpdated: new Date().toISOString()
  })),
  decrement: () => set((state) => ({ 
    count: state.count - 1,
    lastUpdated: new Date().toISOString()
  })),
  reset: () => set(defaultInitState)
})) 