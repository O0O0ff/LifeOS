/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-13 23:50:50
 * @LastEditTime: 2026-09-16 20:04:36
 * @FilePath: \life-os\apps\web\src\lib\auth-client.ts
 */

import { createLifeOsAuthClient } from '@life-os/auth/client'

export const authClient = createLifeOsAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // 指向 NestJS 的 Auth 接口
})

// 导出 hooks 供 React 组件使用
export const { useSession, signIn, signOut } = authClient
