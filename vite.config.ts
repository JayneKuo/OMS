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
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue': ['vue', '@vue/shared', '@vue/runtime-core', '@vue/runtime-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['element-plus', '@vue/shared']
  }
}) 