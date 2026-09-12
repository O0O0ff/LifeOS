/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:41:46
 * @LastEditTime: 2026-09-12 15:41:24
 * @FilePath: \life-os\apps\api\src\main.ts
 */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // @thallesp/nestjs-better-auth 要求必须为 false
  })
  await app.listen(process.env.PORT ?? 3000)
}
await bootstrap()
