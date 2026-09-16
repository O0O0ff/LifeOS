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
      additionalFields: {},
    },
    trustedOrigins: [config.frontendUrl],
    baseURL: config.authUrl,
    secret: config.secret,
  })

// 导出纯类型！(只供前端使用 type import，编译时会被擦除)
export type AppAuth = ReturnType<typeof createLifeOsAuth>
