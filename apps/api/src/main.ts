/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:41:46
 * @LastEditTime: 2026-09-17 22:00:44
 * @FilePath: \life-os\apps\api\src\main.ts
 */
import 'varlock/auto-load'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ENV } from 'varlock/env'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // @thallesp/nestjs-better-auth 要求必须为 false
  })
  await app.listen(ENV.PORT)
}
await bootstrap()
