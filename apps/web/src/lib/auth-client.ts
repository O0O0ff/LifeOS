/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-13 23:50:50
 * @LastEditTime: 2026-09-14 00:00:00
 * @FilePath: \life-os\apps\web\src\lib\auth-client.ts
 */
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || undefined,
})

export const { signIn, signUp } = authClient
