/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 23:01:26
 * @LastEditTime: 2026-09-12 13:48:58
 * @FilePath: \life-os-shadcn\apps\web\vite.config.ts
 */
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'), // 👈 改为 import.meta.dirname
    },
  },
})
