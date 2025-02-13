// 使用 server-only 包确保此组件仅在服务器端运行
import 'server-only'
import { 
  executeRead, 
  executeWrite, 
  verifyConnectivity, 
  getServerInfo 
} from '@/lib/neo4j'

// 定义数据类型
interface Movie {
  title: string
  released: number
  tagline?: string
}

interface DemoNode {
  name: string
  created: string
}

// 定义页面组件
export default async function Neo4jShowcase() {
  // 验证数据库连接并获取服务器信息
  try {
    await verifyConnectivity()
    const serverInfo = getServerInfo()

    // 执行示例查询 - 读取电影数据
    const movies = await executeRead<Movie>(
      `MATCH (n:Movie) 
       RETURN n.title as title, 
              n.released as released, 
              n.tagline as tagline 
       ORDER BY n.released DESC 
       LIMIT 5`
    )

    // 执行写入示例 - 创建演示节点
    const demoNode = await executeWrite<DemoNode>(
      `CREATE (n:Demo {
        name: $name, 
        created: datetime()
      }) 
       RETURN n.name as name, 
              toString(n.created) as created`,
      { name: `Demo Node ${new Date().toISOString()}` }
    )

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Neo4j 功能展示</h1>
        
        {/* 服务器信息展示 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">服务器信息</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm">
              {JSON.stringify(serverInfo, null, 2)}
            </pre>
          </div>
        </section>

        {/* 数据读取示例 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">最新电影数据</h2>
          <div className="grid gap-4">
            {movies.map((movie, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-gray-600">发行年份: {movie.released}</p>
                {movie.tagline && (
                  <p className="text-sm text-gray-500 mt-2">{movie.tagline}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 数据写入示例 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">写入操作演示</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-medium">成功创建新节点:</p>
            <pre className="text-sm mt-2">
              {JSON.stringify(demoNode, null, 2)}
            </pre>
          </div>
        </section>

        {/* 功能特性说明 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">核心特性</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <FeatureCard 
              title="类型安全" 
              description="使用 TypeScript 泛型确保数据类型安全"
            />
            <FeatureCard 
              title="连接管理" 
              description="自动管理连接池（最大50个连接）和会话"
            />
            <FeatureCard 
              title="性能监控" 
              description="自动记录查询执行时间和性能日志"
            />
            <FeatureCard 
              title="错误处理" 
              description="统一的错误处理机制和自定义错误类"
            />
          </div>
        </section>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h1 className="text-2xl font-bold text-red-600">Neo4j 连接错误</h1>
          <p className="mt-2">请检查数据库配置和连接状态</p>
          <p className="text-sm text-red-500 mt-2">
            {error instanceof Error ? error.message : '未知错误'}
          </p>
        </div>
      </div>
    )
  }
}

// 功能特性卡片组件
function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  )
}
