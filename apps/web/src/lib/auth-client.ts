/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-13 23:50:50
 * @LastEditTime: 2026-09-14 23:15:25
 * @FilePath: \life-os\apps\web\src\lib\auth-client.ts
 */
import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { AppAuth } from '@life-os/auth'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [inferAdditionalFields<AppAuth>()],
})

export const { signIn, signUp, useSession, signOut } = authClient
