<template>
  <el-menu
    :default-active="activeMenu"
    class="nav-menu"
    :collapse="isCollapsed"
    background-color="#1e2227"
    text-color="#8b949e"
    active-text-color="#7c4dff"
  >
    <template v-for="menu in menus" :key="menu.path">
      <template v-if="menu.children">
        <el-sub-menu :index="menu.path">
          <template #title>
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :index="child.path"
            @click="handleMenuClick(child.path)"
          >
            <el-icon>
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item 
          :index="menu.path"
          @click="handleMenuClick(menu.path)"
        >
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuConfig } from '@/config/menu'

const props = defineProps<{
  isCollapsed: boolean
}>()

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const menus = menuConfig

const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.nav-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    &.is-active {
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
      }
    }
  }
  
  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style> 