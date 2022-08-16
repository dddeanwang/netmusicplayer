<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home"  @click="goHome"></span>
        <span class="iconfont icon-sami-select" @click="exitFullScreen"></span>
        <span class="iconfont icon-full-screen"  @click="fullScreen"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift"  @click="back"></span>
        <span class="iconfont icon-arrow-right" @click="forward"></span>
      </div>
    </div>
    <Search />
  </div>
</template>

<script>
import Search from "./Search";
import { requestFullScreen, exitFullscreen, isFullscreen } from "@/utils"
export default {
  name: "top",
  methods:{
      goHome() {
      this.$router.push("/discovery")
    },
    fullScreen() {
      requestFullScreen(document.documentElement)
    },
    exitFullScreen() {
      console.log(isFullscreen())
      if (isFullscreen()) {
        exitFullscreen()
      }
    },
     back() {
      this.$router.back()
    },
    forward() {
      this.$router.forward()
    }
  },
  components: { Search },
};
</script>

<style>
.top-container {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  background-color: #f9f9f9;
  width: 100%;
  /* 让热搜框保持在main和miniplayer最上层 */
  z-index: 2;
}

.top-container .left-box {
  display: flex;
}

.top-container .left-box .icon-wrapper {
  margin-top: 10px;
  margin-right: 20px;
}

.top-container .left-box .icon-wrapper .iconfont {
  margin-right: 10px;
  font-size: 12px;
  width: 18px;
  height: 18px;
  display: inline-block;
  text-align: center;
  line-height: 18px;
}

.top-container .left-box .icon-wrapper .iconfont::before {
  opacity: 0;
  transition: 0.2s;
}

.top-container .left-box .icon-wrapper .iconfont:hover::before {
  opacity: 1;
}

.top-container .left-box .icon-wrapper .iconfont.icon-home {
  background-color: #dd6d60;
  border-radius: 50%;
}

.top-container .left-box .icon-wrapper .iconfont.icon-sami-select {
  background-color: #dcc060;
  border-radius: 50%;
}

.top-container .left-box .icon-wrapper .iconfont.icon-full-screen {
  background-color: #84bb58;
  border-radius: 50%;
}

.top-container .left-box .history-wrapper {
  display: flex;
  align-items: center;
}

.top-container .left-box .history-wrapper .iconfont {
  width: 35px;
  height: 35px;
  font-size: 30px;
  text-align: center;
  line-height: 35px;
  color: gray;
  border-radius: 50%;
  transition: 0.2s;
  cursor: pointer;
}

.top-container .left-box .history-wrapper .iconfont:first-child {
  margin-right: 10px;
}

.top-container .left-box .history-wrapper .iconfont:hover {
  background-color: #ebebeb;
}
</style>
