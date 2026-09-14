/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-09 20:23:58
 * @LastEditTime: 2026-09-14 23:07:51
 * @FilePath: \life-os\apps\api\src\auth\auth.ts
 */
// apps/api/src/auth/auth.ts
import type { DatabaseInstance } from '@life-os/db/client'
import type { ConfigService } from '@nestjs/config'
import { createLifeOsAuth } from '@life-os/auth' // 引入工厂

export const createAuth = (
  db: DatabaseInstance,
  configService: ConfigService
) => {
  // 依然保留你优秀的 DI 和环境变量读取
  return createLifeOsAuth({
    db,
    frontendUrl:
      configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    authUrl:
      configService.get<string>('BETTER_AUTH_URL') || 'http://localhost:3000',
    secret: configService.get<string>('BETTER_AUTH_SECRET')!,
  })
}
