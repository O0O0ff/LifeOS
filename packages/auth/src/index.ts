/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-14 23:00:02
 * @LastEditTime: 2026-09-14 23:13:34
 * @FilePath: \life-os\packages\auth\src\index.ts
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { DatabaseInstance } from '@life-os/db/client'
import * as schema from '@life-os/db/schema'

export interface AuthConfig {
  db: DatabaseInstance
  frontendUrl: string
  authUrl: string
  secret: string
}

export const createLifeOsAuth = (config: AuthConfig) =>
  betterAuth({
    database: drizzleAdapter(config.db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: { enabled: true },
    user: {
      // 假设以后有自定义字段，在这里声明
      additionalFields: {
        // role: { type: 'string' }
      },
    },
    trustedOrigins: [config.frontendUrl],
    baseURL: config.authUrl,
    secret: config.secret,
  })

// 导出纯类型供前端/移动端消费
export type AppAuth = ReturnType<typeof createLifeOsAuth>
