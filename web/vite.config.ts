import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 读取 .env 文件中的变量
  const root = process.cwd()
  const env = loadEnv(mode, root, '')
  // const isDev = mode === 'development'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // '@' 指向 src 目录
      },
    },
    server: {
      port: 3100,
      proxy: {
        [env.VITE_APP_API]: {
          target: env.VITE_APP_SERVER,
          changeOrigin: true,
          secure: false, // 忽略 HTTPS 证书验证
          rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        },
      },
    },
  }
})
