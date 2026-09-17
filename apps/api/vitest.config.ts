/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 23:25:46
 * @LastEditTime: 2026-09-17 22:02:22
 * @FilePath: \life-os\apps\api\vitest.config.ts
 */
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { varlockVitePlugin } from '@varlock/vite-integration'
export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [varlockVitePlugin(), tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
})
