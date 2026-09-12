/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-09 20:23:58
 * @LastEditTime: 2026-09-12 15:47:45
 * @FilePath: \life-os\apps\api\src\auth\auth.ts
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '@life-os/db/schema'
// 引入我们在第二步初始化的 db 实例
import { db } from '../database/index.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
})
