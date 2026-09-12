/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 22:09:27
 * @LastEditTime: 2026-09-12 15:43:53
 * @FilePath: \life-os\apps\api\src\app.module.ts
 */
import { DatabaseInstance } from '@life-os/db'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { createAuth } from './auth/auth.js'
import { DatabaseModule, DRIZZLE } from './database/database.module.js'

@Module({
  imports: [
    // 1. 先加载配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env.production',
        '.env.development',
        '.env',
      ],
    }),

    // 2. 加载数据库模块（内部会使用 ConfigModule 提供的信息连接数据库）
    DatabaseModule,

    // 3. 异步加载 Auth 模块
    AuthModule.forRootAsync({
      // 声明需要注入的依赖
      inject: [DRIZZLE, ConfigService],
      // NestJS 会自动把依赖作为参数传给 useFactory
      useFactory: (db: DatabaseInstance, configService: ConfigService) => {
        return {
          // 调用我们在第二步写的工厂函数
          auth: createAuth(db, configService),
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
