/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 15:13:59
 * @LastEditTime: 2026-09-12 15:22:00
 * @FilePath: \life-os\apps\api\src\database\database.module.ts
 */

import { createDb } from '@life-os/db/client'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export const DRIZZLE = Symbol('DRIZZLE_INSTANCE')

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 此时 ConfigModule 已经加载完毕，自带多环境（.env.local）支持
        const connectionString =
          configService.getOrThrow<string>('DATABASE_URL')

        const { db } = createDb({
          connectionString,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        })

        return db
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
