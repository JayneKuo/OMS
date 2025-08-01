<template>
  <nav class="nav-menu" :class="{ collapsed: isCollapsed }">
    <template v-for="item in menuItems" :key="item.path">
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="menu-title" v-show="!isCollapsed">{{ item.title }}</span>
        </template>
        <el-menu-item 
          v-for="child in item.children" 
          :key="child.path"
          :index="child.path"
          @click="navigateTo(child.path)"
        >
          <el-icon v-if="child.icon">
            <component :is="child.icon" />
          </el-icon>
          <span>{{ child.title }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item 
        v-else 
        :index="item.path"
        @click="navigateTo(item.path)"
      >
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-title" v-show="!isCollapsed">{{ item.title }}</span>
      </el-menu-item>
    </template>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import type { MenuItem } from '@/types/menu'

const props = defineProps<{
  menuItems: MenuItem[]
  isCollapsed: boolean
}>()

const route = useRoute()
const router = useRouter()

const isActive = (path: string) => {
  return route.path === path
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.nav-menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      color: #8b949e;
      
      &:hover {
        background-color: rgba(124, 77, 255, 0.05);
        color: #fff;
      }
    }
    
    .el-menu-item {
      color: #8b949e;
      
      &:hover {
        background-color: rgba(124, 77, 255, 0.05);
        color: #fff;
      }
      
      &.is-active {
        background-color: rgba(124, 77, 255, 0.1);
        color: #7c4dff;
      }
    }
  }
  
  &.collapsed {
    padding: 16px 0;
    
    .el-menu-item {
      padding: 12px 0;
      justify-content: center;
      
      .el-icon {
        margin: 0;
        font-size: 20px;
      }
      
      &:hover {
        background-color: rgba(124, 77, 255, 0.1);
      }
    }
  }
  
  .el-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 6px;
    color: #8b949e;
    text-decoration: none;
    transition: all 0.3s;
    margin-bottom: 4px;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.05);
      color: #fff;
    }
    
    &.is-active {
      background-color: rgba(124, 77, 255, 0.1);
      color: #7c4dff;
    }
    
    .el-icon {
      font-size: 16px;
      margin: 0 4px;
    }
    
    .menu-title {
      font-size: 14px;
      white-space: nowrap;
    }
  }
}
</style> 