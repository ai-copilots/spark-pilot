'use client'

import { useCounterStore } from '@/app/showcases/zustand/stores/counter-store'

export const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">计数器组件</h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          减少
        </button>
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          增加
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          重置
        </button>
      </div>
    </div>
  )
} 