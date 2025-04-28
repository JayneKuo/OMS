<template>
  <nav class="nav-menu" :class="{ collapsed: isCollapsed }">
    <template v-for="item in menuItems" :key="item.path">
      <router-link 
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-title" v-show="!isCollapsed">{{ item.title }}</span>
      </router-link>
    </template>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/types/menu'

const props = defineProps<{
  menuItems: MenuItem[]
  isCollapsed: boolean
}>()

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style lang="scss" scoped>
.nav-menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  
  &.collapsed {
    padding: 16px 0;
    
    .menu-item {
      padding: 12px 0;
      justify-content: center;
      
      .el-icon {
        margin: 0;
        font-size: 20px;
      }

      &:hover {
        background-color: rgba(124, 77, 255, 0.1);
      }
      
      &.active::before {
        width: 3px;
      }
    }
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 6px;
    color: #8b949e;
    text-decoration: none;
    transition: all 0.3s;
    margin-bottom: 4px;
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
        top: 0;
        width: 4px;
        height: 100%;
        background-color: #7c4dff;
        border-radius: 0 2px 2px 0;
      }
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