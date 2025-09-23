<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-left">
        <div class="logo-container">
          <img src="@/assets/logo.svg" alt="OMS" class="logo" />
          <span class="logo-text">OMS</span>
        </div>
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
    <nav class="main-nav">
      <el-button 
        class="collapse-btn" 
        @click="toggleSidebar"
      >
        <el-icon>
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </el-button>
      <template v-for="menu in mainMenus" :key="menu.path">
        <div 
          class="nav-item" 
          :class="{ active: isActiveMainMenu(menu.path) }"
          @click="handleMainMenuClick(menu)"
        >
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.title }}</span>
        </div>
      </template>
    </nav>
    <div class="main-content">
      <aside 
        v-if="shouldShowSidebar" 
        class="sidebar" 
        :class="{ collapsed: isCollapsed }"
      >
        <nav-menu 
          :menu-items="currentMainMenu?.children || []" 
          :is-collapsed="isCollapsed"
          :active-path="route.path"
        />
      </aside>
      <main class="page-content" :class="{ 'full-width': !shouldShowSidebar }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Fold, Expand, HomeFilled, ArrowDown } from '@element-plus/icons-vue'
import NavMenu from '@/components/navigation/NavMenu.vue'
import UserInfo from '@/components/navigation/UserInfo.vue'
import { menuConfig } from '@/config/menu'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)

const mainMenus = menuConfig

const currentMainMenu = ref(mainMenus.find(menu => route.path.startsWith(menu.path)))

watch(
  () => route.path,
  (newPath) => {
    // First check if the route has meta.activeMenu
    const activeMenuPath = route.meta?.activeMenu as string
    if (activeMenuPath) {
      const activeMainMenu = mainMenus.find(menu => menu.path === activeMenuPath)
      if (activeMainMenu) {
        currentMainMenu.value = activeMainMenu
        return
      }
    }
    
    // Otherwise use the default path matching
    const newMainMenu = mainMenus.find(menu => newPath.startsWith(menu.path))
    if (newMainMenu && (!currentMainMenu.value || currentMainMenu.value.path !== newMainMenu.path)) {
      currentMainMenu.value = newMainMenu
    }
  },
  { immediate: true }
)

const isActiveMainMenu = (path: string) => {
  // Check if the current route has meta.activeMenu pointing to this path
  const activeMenuPath = route.meta?.activeMenu as string
  if (activeMenuPath && activeMenuPath === path) {
    return true
  }
  // Otherwise use the default path matching
  return route.path.startsWith(path)
}

const handleMainMenuClick = (menu: any) => {
  if (menu.path === '/dashboard') {
    router.push(menu.path)
  } else if (menu.children && menu.children.length > 0) {
    currentMainMenu.value = menu
    // Navigate to the first child route if not already on a child route
    if (!route.path.startsWith(menu.path)) {
      router.push(menu.children[0].path)
    }
  } else {
    router.push(menu.path)
  }
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const shouldShowSidebar = computed(() => {
  return currentMainMenu.value?.children && currentMainMenu.value.children.length > 0
})
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1a1d21;
  color: #fff;
}

.main-header {
  height: 60px;
  background-color: #1e2227;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .logo {
        width: 32px;
        height: 32px;
      }
      
      .logo-text {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .module-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.02);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      
      .module-name {
        margin: 0 4px;
      }
    }
  }
}

.main-nav {
  height: 48px;
  background-color: #1e2227;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
  
  .collapse-btn {
    padding: 8px;
    height: 36px;
    width: 36px;
    background: transparent;
    border: none;
    color: #8b949e;
    margin-right: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 18px;
    }
    
    &:hover {
      color: #7c4dff;
      background-color: rgba(124, 77, 255, 0.1);
    }
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    color: #8b949e;
    position: relative;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.05);
      color: #fff;
    }
    
    &.active {
      background-color: rgba(124, 77, 255, 0.1);
      color: #7c4dff;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -12px;
        width: 100%;
        height: 2px;
        background-color: #7c4dff;
      }
    }
    
    .el-icon {
      font-size: 16px;
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background-color: #1e2227;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  
  &.collapsed {
    width: 64px;
  }

  :deep(.sidebar-menu) {
    border-right: none;
    background-color: transparent;
    
    .el-menu-item,
    .el-sub-menu__title {
      color: #8b949e;
      background-color: transparent;
      
      &:hover {
        color: #fff;
        background-color: rgba(124, 77, 255, 0.05);
      }
    }
    
    .el-menu-item.is-active {
      color: #7c4dff;
      background-color: rgba(124, 77, 255, 0.1);
    }
  }
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: #1a1d21;
  
  &.full-width {
    width: 100%;
  }
}
</style> 