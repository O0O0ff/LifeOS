/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:18:36
 * @LastEditTime: 2026-09-12 01:20:45
 * @FilePath: \life-os-shadcn\packages\db\src\client.ts
 */
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { Pool, PoolConfig } from 'pg'
export type { Pool, PoolConfig } from 'pg'
export type DatabaseInstance = NodePgDatabase<typeof schema>

// 顺带把 Pool 类型导出去，下游就不需要再 import 'pg' 了
// 导出一个工厂函数，由使用者决定连接池配置与时机
export function createDb(options: PoolConfig | string) {
  const pool =
    typeof options === 'string'
      ? new Pool({ connectionString: options })
      : new Pool(options)

  return {
    db: drizzle(pool, { schema }),
    pool, // 导出 pool 方便应用管理关闭生命周期
  }
}
