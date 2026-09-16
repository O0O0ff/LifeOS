/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-16 18:26:23
 * @LastEditTime: 2026-09-16 18:26:55
 * @FilePath: \life-os\packages\auth\src\client.ts
 */
import { createAuthClient } from 'better-auth/react'
// ⚠️ 重点：这里必须加 type，保证前端打包时不会把 server.ts 里的 node.js 依赖打进去
import type { AppAuth } from './server'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export interface AuthClientConfig {
  baseURL: string
}

// 导出一个工厂函数给前端 Vite 项目调用
export const createLifeOsAuthClient = (config: AuthClientConfig) => {
  return createAuthClient({
    baseURL: config.baseURL,
    plugins: [inferAdditionalFields<AppAuth>()],
  })
}
