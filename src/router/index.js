import Vue from 'vue'
import VueRouter from "vue-router"


// 导入对应的路由
import discovery from '@/views/01.discovery.vue'
import playlists from '@/views/02.playlists.vue'
import songs from '@/views/03.songs.vue'
import mvs from '@/views/04.mvs.vue'
import result from '@/views/05.result.vue'
import playlist from '@/views/06.playlist.vue'
import mv from '@/views/07.mv.vue'
import artist from '@/views/08.artist'
import album from '@/views/09.album'

// 使用router
Vue.use(VueRouter)

// 解决重复点击导航时，控制台出现报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const router = new VueRouter({
  mode:"history",
  routes: [
    {
      path: '/',
      redirect: "/discovery"
    },
    {
      // 发现音乐
      path: '/discovery',
      component: discovery
    },
    {
      // 推荐歌单
      path: '/playlists',
      component: playlists
    },
    {
      // 歌单详情
      path: '/playlist',
      component: playlist
    },
    {
      // 最新音乐
      path: '/songs',
      component: songs
    },
    {
      // 最新MV
      path: '/mvs',
      component: mvs
    },
    // mv详情
    {
      path: '/mv',
      component: mv
    },
    // 搜索结果页
    {
      path: '/result',
      component: result
    },
    // 歌手详情
    {
      path: '/artist',
      component: artist
    },
    // 专辑详情
    {
      path: '/album',
      component: album
    },
  ]
  
})

export default router