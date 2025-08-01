declare module 'element-plus/es/components/message' {
  const ElMessage: {
    success(message: string): void
    warning(message: string): void
    error(message: string): void
    info(message: string): void
  }
  export { ElMessage }
}

declare module 'element-plus/es/components/message-box' {
  const ElMessageBox: {
    confirm(message: string, title: string, options?: any): Promise<void>
  }
  export { ElMessageBox }
}

declare module 'element-plus' {
  import type { Component } from 'vue'
  
  export const ElMessage: {
    success(message: string): void
    warning(message: string): void
    error(message: string): void
    info(message: string): void
  }
  
  export const ElMessageBox: {
    confirm(message: string, title: string, options?: any): Promise<void>
  }
  
  export interface FormInstance {
    validate(): Promise<boolean>
    resetFields(): void
    clearValidate(): void
  }
}

declare module '@element-plus/icons-vue' {
  import type { Component } from 'vue'
  export const Plus: Component
  export const InfoFilled: Component
  export const Delete: Component
} 