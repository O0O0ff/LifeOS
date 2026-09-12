/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 15:13:59
 * @LastEditTime: 2026-09-12 15:22:00
 * @FilePath: \life-os\apps\api\src\database\database.module.ts
 */

import { Global, Module } from '@nestjs/common'
import { createDb } from '@life-os/db/client'
import { ConfigService } from '@nestjs/config'

export const DRIZZLE = Symbol('DRIZZLE_INSTANCE')

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString =
          configService.getOrThrow<string>('DATABASE_URL')
        const { db } = createDb({ connectionString, max: 20 })
        return db
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
