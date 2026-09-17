/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 23:01:26
 * @LastEditTime: 2026-09-17 20:20:17
 * @FilePath: \life-os\apps\web\vite.config.ts
 */
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import { ENV } from 'varlock/env' // 👈 引入 varlock 的 ENV
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    varlockVitePlugin(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'), // 👈 改为 import.meta.dirname
    },
  },
  server: {
    proxy: {
      '/api': {
        target: ENV.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
})
