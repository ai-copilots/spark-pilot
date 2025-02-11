// 使用 server-only 包确保此组件仅在服务器端运行
import 'server-only'
import { executeRead, executeWrite, verifyConnectivity } from '@/lib/neo4j'

// 定义页面组件
export default async function Neo4jShowcase() {
  // 验证数据库连接
  try {
    await verifyConnectivity()
  } catch (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-500">Neo4j 连接错误</h1>
        <p>请检查数据库配置和连接状态</p>
        <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
      </div>
    )
  }

  // 执行示例查询
  type Movie = { title: string }
  const readResult = await executeRead<Movie>(
    `MATCH (n:Movie) 
     RETURN n.title as title 
     LIMIT 5`
  )

  // 执行写入示例
  const writeResult = await executeWrite(
    `CREATE (n:Demo {name: $name, created: datetime()}) 
     RETURN n`,
    { name: 'Neo4j Showcase' }
  )

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Neo4j 功能展示</h1>
      
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">数据读取示例</h2>
        <div className="bg-gray-100 p-4 rounded">
          <ul className="list-disc list-inside">
            {readResult.map((movie, index) => (
              <li key={`${movie.title}-${index}`}>{movie.title}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">数据写入示例</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(writeResult, null, 2)}</pre>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">主要特性</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>服务器端组件 - 使用 server-only 确保安全性</li>
          <li>自动连接管理 - 连接池和会话控制</li>
          <li>类型安全 - 使用 TypeScript 泛型</li>
          <li>错误处理 - 包装所有数据库错误</li>
          <li>性能监控 - 自动记录查询执行时间</li>
        </ul>
      </section>
    </div>
  )
}
