<template>
  <div class="mvs">
    <div class="items">
      <div
        class="item"
        v-for="(mv, index) in mvTable"
        :key="index"
        @click="toMvDetail(mv.id)"
      >
        <div class="img-wrap">
          <img v-lazy="mvCover(mv)" />
          <p class="iconfont icon-play play"></p>
          <div class="num-wrap">
            <!-- 这里的两个icon-play有冲突 所以起个别名 -->
            <div class="iconfont icon-play small-play"></div>
            <div class="num">{{ mv.playCount }}</div>
          </div>
          <div class="mv-duration">{{ mv.duration }}</div>
        </div>
        <div class="info-wrap">
          <div class="name" :title="mv.name" >{{ mv.name }}</div>
          <div class="singer">{{ artistName(mv) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MvTable",
  props: ["mvTable"],
  data() {
    return {};
  },
  methods: {
    //去mv详情页
    toMvDetail(mvid) {
      this.$router.push(`/mv?id=${mvid}`);
    },
    // 获取MV封面
    mvCover(mv) {
      return mv.cover
        ? `${mv.cover}?param=250y140`
        : `${mv.imgurl}?param=250y140`;
    },
    //歌手名字
    artistName(mv) {
      return mv.artist ? mv.artist.name : mv.artists[0].name;
    },
  },
};
</script>

<style scoped>
.mvs .items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.mvs .items .item {
  width: 250px;
  /* 固定了高也可以让显示效果更稳定 不会有的高有的低 */
  height: 200px;
  cursor: pointer;
  margin-right: 25px;
}

.mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.mvs .items .item .img-wrap img {
  width: 100%;
  /* 不设置高度的话就会先占满元素再缩回 影响体验 */
  height: 140px;
  border-radius: 5px;
}

.mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 16px;
  padding-right: 10px;
  padding-top: 5px;
}
.mvs .items .item .img-wrap .mv-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: white;
  font-size: 16px;
}
/* 小播放按钮 */
.mvs .items .item .img-wrap .num-wrap .small-play {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

/* mv的播放按钮 不和小播放按钮冲突 start */
.mvs .items .item .img-wrap {
  position: relative;
}

.mvs .items .item .img-wrap .play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 以上三句让图标居中 */
  width: 40px;
  height: 40px;
  color: #dd6d60;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}
/* 让圆形中的播放按钮居中! */
.mvs .items .item .img-wrap .play::before {
  transform: translateX(3px);
}
/* 鼠标放上去才显示 */
.mvs .items .item .img-wrap:hover .play {
  opacity: 1;
}
/* mv的播放按钮 end */

.mvs .items .item .info-wrap .name {
   color:  #1e1e1e;
  font-size: 15px;
  /* 只显示两行文字 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mvs .items .item .info-wrap .singer {
  font-size: 15px;
  color: #707070;
}
</style>