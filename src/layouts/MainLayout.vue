<template>
  <div class="app-container">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo-container">
        <div class="logo-content">
          <img src="@/assets/logo.svg" alt="OMS" class="logo" />
          <span class="logo-text" v-show="!isCollapsed">OMS</span>
        </div>
        <el-button 
          class="collapse-btn" 
          @click="toggleSidebar"
        >
          <el-icon>
            <component :is="isCollapsed ? 'Expand' : 'Fold'" />
          </el-icon>
        </el-button>
      </div>
      <nav-menu :is-collapsed="isCollapsed" />
    </aside>
    <main class="main-content">
      <header class="header">
        <div class="header-left">
          <div class="module-selector">
            <el-icon><HomeFilled /></el-icon>
            <span class="module-name">LAUNDRY SAUCE</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
        <div class="header-right">
          <user-info />
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Fold, Expand, HomeFilled, ArrowDown } from '@element-plus/icons-vue'
import NavMenu from '@/components/navigation/NavMenu.vue'
import UserInfo from '@/components/navigation/UserInfo.vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #1a1d21;
  color: #fff;
}

.sidebar {
  width: 260px;
  background-color: #1e2227;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    width: 64px;
    
    .logo-text {
      display: none;
    }
  }
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  .logo-content {
    display: flex;
    align-items: center;
    
    .logo {
      width: 32px;
      height: 32px;
    }
    
    .logo-text {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
    }
  }
  
  .collapse-btn {
    padding: 8px;
    height: 32px;
    background: transparent;
    border: none;
    color: #8b949e;
    
    &:hover {
      color: #fff;
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #1e2227;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  .header-left {
    display: flex;
    align-items: center;
    
    .module-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      
      .module-name {
        font-weight: 500;
        margin: 0 4px;
      }
      
      .el-icon {
        font-size: 16px;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style> 