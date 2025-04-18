import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

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
    }),
    Components({
      resolvers: [PrimeVueResolver()]
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
      // '/pulse': {
      //   target: 'http://localhost:3000'
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // },
      '/twse': {
        target: 'https://mis.twse.com.tw/stock/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twse/, '')
      },
      '/openapi-twse': {
        target: 'https://openapi.twse.com.tw/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openapi-twse/, '')
      },
      '/openapi-tpex': {
        target: 'https://www.tpex.org.tw/openapi/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openapi-tpex/, '')
      },
      '/exchangeReport': {
        target: 'http://www.twse.com.tw/exchangeReport',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/exchangeReport/, '')
      }
    }
  }
})
