import Vue from 'vue'
import App from './App.vue'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 使用插件 Element-ui
Vue.use(ElementUI)
// 导入全局初始化样式
import './assets/index.css'
// 引入仓库
import store from "@/store"
// 全局导入的组件
import global from '@/utils/global'
Vue.use(global)
// 导入路由
import router from './router'

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router,
  store
}).$mount('#app')
