'use client'

import { useCounterStore } from '@/app/showcases/zustand/stores/counter-store'

const formatDate = (dateStr: string) => {
  if (dateStr === '-') return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString()
  } catch {
    return dateStr
  }
}

export const CounterInfo = () => {
  const { count, lastUpdated } = useCounterStore()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">状态信息</h2>
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700">
          当前计数: <span className="font-medium">{count}</span>
        </p>
        <p className="text-gray-700">
          最后更新时间: <span className="font-medium">{formatDate(lastUpdated)}</span>
        </p>
      </div>
    </div>
  )
} 