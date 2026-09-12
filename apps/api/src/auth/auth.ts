/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-09 20:23:58
 * @LastEditTime: 2026-09-12 15:47:45
 * @FilePath: \life-os\apps\api\src\auth\auth.ts
 */
import type { DatabaseInstance } from '@life-os/db/client'
import * as schema from '@life-os/db/schema'
import type { ConfigService } from '@nestjs/config'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

// 导出一个工厂函数，接受 NestJS 注入进来的 db 和 configService
export const createAuth = (
  db: DatabaseInstance,
  configService: ConfigService
) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    // 从 ConfigService 拿环境变量，再也不用 process.env 了！
    trustedOrigins: [
      configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    ],
    baseURL:
      configService.get<string>('BETTER_AUTH_URL') || 'http://localhost:3000',
    secret: configService.get<string>('BETTER_AUTH_SECRET'),
  })
