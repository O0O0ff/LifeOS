/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 15:13:59
 * @LastEditTime: 2026-09-17 22:10:26
 * @FilePath: \life-os\apps\api\src\database\database.module.ts
 */

import { createDb } from '@life-os/db/client'
import { Global, Module } from '@nestjs/common'
import { ENV } from 'varlock/env'
export const DRIZZLE = Symbol('DRIZZLE_INSTANCE')

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const { db } = createDb({
          connectionString: ENV.DATABASE_URL,
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
