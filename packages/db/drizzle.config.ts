/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:17:28
 * @LastEditTime: 2026-09-12 01:22:56
 * @FilePath: \life-os-shadcn\packages\db\drizzle.config.ts
 */
import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config({ path: '../../.env' }) // 读取根目录的 .env

export default defineConfig({
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
