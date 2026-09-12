/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 14:11:16
 * @LastEditTime: 2026-09-12 15:12:36
 * @FilePath: \life-os\apps\api\src\database\index.ts
 */
import { createDb, type DatabaseInstance, type Pool } from '@life-os/db/client'
import * as dotenv from 'dotenv'
import path from 'path'

// 手动加载环境变量，因为该文件在 NestJS ConfigModule 初始化之前就会被执行
dotenv.config({ path: path.join(process.cwd(), '.env') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('apps/api 缺少环境变量: DATABASE_URL 未定义')
}

// 初始化针对 API 进程优化过的连接池
const client = createDb({
  connectionString,
  max: 20, // 接口服务允许的最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

export const db: DatabaseInstance = client.db
export const pool: Pool = client.pool
