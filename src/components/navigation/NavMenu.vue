<template>
  <el-menu
    class="nav-menu"
    :class="{ collapsed: isCollapsed }"
    :collapse="isCollapsed"
    :default-active="activePath"
    :unique-opened="true"
    :collapse-transition="false"
  >
    <template v-for="item in menuItems" :key="item.path">
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item 
          v-for="child in item.children" 
          :key="child.path"
          :index="child.path"
          @click="navigateTo(child.path, child.meta?.activeMenu)"
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
        @click="navigateTo(item.path, item.meta?.activeMenu)"
      >
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuItem } from '@/types/menu'

const props = defineProps<{
  menuItems: MenuItem[]
  isCollapsed: boolean
  activePath: string
}>()

const router = useRouter()

const navigateTo = (path: string, activeMenu?: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.nav-menu {
  border-right: none !important;
  background-color: transparent;
  
  :deep(.el-menu-item) {
    &.is-active {
      background-color: rgba(124, 77, 255, 0.1);
      color: #7c4dff;
      &::before {
        opacity: 0;
      }
    }
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.05);
      color: #fff;
    }
  }
  
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      &:hover {
        background-color: rgba(124, 77, 255, 0.05);
      }
    }
  }
  
  &.collapsed {
    .el-menu-item {
      .el-icon {
        margin: 0;
      }
    }
  }
}
</style> 