import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'  // 引入暗色主题变量
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import './styles/element-dark.scss'  // 引入自定义的暗色主题样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { vClickOutside } from './directives'
import en from 'element-plus/es/locale/lang/en' // 引入英文语言包

// 引入模拟数据
import './mock'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus, {
  locale: en // 设置Element Plus为英文
})
app.directive('click-outside', vClickOutside)

// 添加暗色主题类名到 html 元素
document.documentElement.classList.add('dark')

app.mount('#app') 