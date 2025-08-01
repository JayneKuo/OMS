/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@element-plus/icons-vue' {
  import type { Component } from 'vue'
  const component: Component
  export const Document: Component
  export const Van: Component
  export const Warning: Component
  export const Timer: Component
  export const TrendCharts: Component
  export const DataAnalysis: Component
  export const ShoppingCart: Component
  export const Connection: Component
  export const Upload: Component
  export const CircleClose: Component
  export const Box: Component
} 