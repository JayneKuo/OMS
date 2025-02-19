import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'  // 引入暗色主题变量
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import './styles/element-dark.scss'  // 引入自定义的暗色主题样式
import { vClickOutside } from './directives'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.directive('click-outside', vClickOutside)

// 添加暗色主题类名到 html 元素
document.documentElement.classList.add('dark')

app.mount('#app') 