import { ref, watch } from 'vue'

const isDark = ref(false)

// 检查系统主题
const checkSystemTheme = () => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
  isDark.value = darkMode.matches
}

// 监听系统主题变化
const setupThemeListener = () => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
  darkMode.addEventListener('change', (e) => {
    isDark.value = e.matches
  })
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// 初始化主题
const initTheme = () => {
  checkSystemTheme()
  setupThemeListener()
}

export function useTheme() {
  return {
    isDark,
    toggleTheme,
    initTheme
  }
} 