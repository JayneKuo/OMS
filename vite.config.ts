import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  server: {
    port: 3001,
    host: true
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 处理模板编译警告
          isCustomElement: (tag) => false,
          whitespace: 'preserve'
        }
      }
    })
  ],
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
          // 将 vuedraggable 及其依赖打包到一个文件中
          if (id.includes('node_modules/vuedraggable') ||
              id.includes('node_modules/sortablejs')) {
            return 'draggable-vendor'
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
      '@vue/runtime-dom',
      'vuedraggable',
      'sortablejs'
    ]
  }
}) 