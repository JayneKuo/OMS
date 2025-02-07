import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@vue/shared': path.resolve(__dirname, 'node_modules/@vue/shared')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['@vue/shared'],
      output: {
        globals: {
          '@vue/shared': 'VueShared'
        }
      }
    },
    commonjsOptions: {
      esmExternals: true
    }
  },
  optimizeDeps: {
    include: ['@vue/shared']
  }
}) 