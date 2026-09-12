/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 22:09:27
 * @LastEditTime: 2026-09-12 15:43:53
 * @FilePath: \life-os\apps\api\src\app.module.ts
 */
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './auth/auth.js'

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env.production',
        '.env.development',
        '.env',
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
