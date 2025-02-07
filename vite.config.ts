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
        manualChunks(id) {
          // 将 element-plus 及其依赖打包到一个文件中
          if (id.includes('node_modules/element-plus')) {
            return 'element-plus'
          }
          // 将 Vue 相关依赖打包到一个文件中
          if (id.includes('node_modules/vue') || 
              id.includes('node_modules/@vue') || 
              id.includes('node_modules/@element-plus')) {
            return 'vue-vendor'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'element-plus',
      '@vue/shared',
      '@vue/runtime-core',
      '@vue/runtime-dom'
    ]
  }
}) 