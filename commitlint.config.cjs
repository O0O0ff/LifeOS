/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 23:14:28
 * @LastEditTime: 2026-09-11 23:17:08
 * @FilePath: \life-os-shadcn\commitlint.config.cjs
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 限制 scope 只能填当前 Monorepo 的子项目或常用范围
    // 例如: feat(web): 增加登录页, fix(api): 修复接口报错
    'scope-enum': [
      2,
      'always',
       [
        // Apps（业务应用）
        'api',        // apps/api (NestJS)
        'web',        // apps/web (React/Vite)

        // Packages（跨项目共享包）
        'ui',         // packages/ui (Shadcn UI 组件)
        'types',      // packages/types (共享的 TS 类型/DTO定义)
        'api-client', // packages/api-client (TanStack Query 请求封装与 hooks)
        'shared',     // packages/shared 或 utils (公共工具函数等)
        
        // 全局管理/工程化
        'root',       // 根目录配置变动
        'deps',       // 依赖包全局更新
        'release',    // 发版/版本标签
      ],
    ],
  },
};