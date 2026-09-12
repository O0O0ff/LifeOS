# LifeOS V2 — 技术架构与工程化设计 (Serverless 优先)

## 1. 核心架构思想：“双轨制” + Serverless 乐高组合

本架构采用最佳的现代化组合库：以 **Neon** 为核心关系存储，以 **React+Vite+Tauri** 打造 Local-first 极致客户端，以 **Next.js** 承担 SEO 分享层。

## 2. 最优技术栈选型 (Neon Stack)

| 领域                      | 技术选型                       | 选用原因 & 架构优势                                                                                                                                         |
| ------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **主数据库**              | **Neon (Serverless Postgres)** | **核心！** 支持逻辑复制 (Logical Replication，配合 PowerSync 必须)；支持 Database Branching (每个 PR 自动生成测试数据库)；流量低谷 Scale-to-zero 节省成本。 |
| **本地数据库 & 同步**     | **PowerSync + SQLite**         | 监听 Neon 的变更流，双向同步到客户端 SQLite。彻底解决多端数据一致性和离线操作问题。                                                                         |
| **实时状态引擎**          | **PartyKit / Pusher**          | **专职负责计时器状态**。手机点击“开始”，通过 WebSocket 瞬间广播至 PC 端。轻量且全球边缘加速，不占用 Neon 数据库的读写 I/O。                                 |
| **身份认证 (Auth)**       | **Clerk**                      | 完美适配 React、Expo 和 Next.js，开箱即用的多端登录UI，生成的 User_ID 直接关联 Neon 业务表。                                                                |
| **核心客户端 (Web / PC)** | **React + Vite + Zustand**     | 纯粹的 SPA，极速 HMR。没有任何服务端包袱，完美嵌入 Tauri 容器。                                                                                             |
| **PC 桌面端容器**         | **Tauri (Rust)**               | 提供系统托盘、全局快捷键和底层系统权限，内存占用极低。                                                                                                      |
| **移动端**                | **React Native (Expo)**        | 一套代码搞定 iOS/Android 灵动岛，底层逻辑与 Web 端高度共享。                                                                                                |
| **社交分享渲染端**        | **Next.js / 边缘函数**         | **仅用于渲染公开分享页 (`/share/xxx`)**。专为推特爬虫服务，利用 Vercel Satori 生成海报 (og:image)。                                                         |

## 3. Monorepo 工程化目录结构 (基于 Turborepo)

```text
lifeos-workspace/
├── apps/
│   ├── web-app/         # React+Vite (Web 核心, Clerk Auth, Local DB)
│   ├── desktop-app/     # Tauri 容器 (打包 web-app)
│   ├── mobile-app/      # Expo (React Native)
│   └── share-site/      # Next.js (用于读取 Neon 数据并用 Satori 渲染卡片)
├── packages/
│   ├── db-schema/       # Drizzle / Prisma Schema (对接 Neon)
│   ├── sync-engine/     # PowerSync 离线同步配置
│   └── ui-kit/          # 跨端共享的 Tailwind UI 组件
```
