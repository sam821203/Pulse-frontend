import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        'vue-router',
        {
          'class-transformer': [
            'plainToInstance',
            'instanceToPlain',
            'instanceToInstance',
            'Transform',
            'Type'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8090,
    proxy: {
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true
      // },
      '/api/stock': {
        target: 'https://mis.twse.com.tw/stock/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stock/, '')
      }
    }
  }
})
