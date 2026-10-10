/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:41:46
 * @LastEditTime: 2026-10-10 22:05:28
 * @FilePath: \life-os\apps\api\src\main.ts
 */
import 'varlock/auto-load'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ENV } from 'varlock/env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { Logger } from '@nestjs/common' // 引入 NestJS 自带的日志工具

async function bootstrap() {
  // 创建一个专用于引导启动的 Logger 实例
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // @thallesp/nestjs-better-auth 要求必须为 false
  })

  /**
   * 1. 设置全局路由前缀为 'api'
   * 这样做可以让所有的业务 Controller 自动带有 /api 前缀（例如 /api/users）
   *
   * [避坑指南]:
   * better-auth 默认已经自带了 /api/auth 前缀。
   * 如果不加 exclude 排除，它会变成丑陋且非预期的 /api/api/auth。
   * 这里使用新版 path-to-regexp 规范的命名通配符语法 {*path}，消除后台 WARN 警告。
   */
  app.setGlobalPrefix('api', {
    exclude: ['api/auth/{*path}'],
  })

  /**
   * 2. 配置 Swagger / Scalar 接口文档
   */
  const config = new DocumentBuilder()
    .setTitle('Life-OS')
    .setDescription('Life-OS API Reference')
    .setVersion('1.0')
    .addTag('Life-OS')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // 挂载 Scalar API 交互式文档页面
  app.use(
    '/api/reference',
    apiReference({
      content: document,
    })
  )

  /**
   * 3. 启动应用并监听端口
   */
  const port = ENV.PORT || 3000
  await app.listen(port)

  // 打印美观且实用的启动成功控制台信息
  logger.log('--------------------------------------------------')
  logger.log(`🚀 Life-OS API 服务已成功启动!`)
  logger.log(`- 根路径前缀: http://localhost:${port}/api`)
  logger.log(`- 接口文档 (Scalar): http://localhost:${port}/reference`)
  logger.log(`- 认证服务 (Better-Auth): http://localhost:${port}/api/auth`)
  logger.log('--------------------------------------------------')
}

await bootstrap()
