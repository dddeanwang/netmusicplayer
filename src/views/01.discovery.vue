<template>
  <div class="discovery-container" v-loading="loading">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img v-lazy="`${item.imageUrl}?param=550y230`" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="(list, index) in recommend"
          :key="index"
          @click="toListDetail(list.id)"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ list.name }}</span>
            </div>
            <img v-lazy="`${list.picUrl}?param=200y200`" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name" :title="list.name">{{ list.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div
          class="item"
          v-for="(song, index) in newsong"
          :key="index"
          @click="onClickSong(index)"
        >
          <div class="img-wrap">
            <img v-lazy="`${song.album.picUrl}?param=70y70`" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ song.name }}</div>
            <span
              class="singer"
              v-for="(singer, index2) in song.artists"
              :key="index2"
              style="cursor: pointer; display: inline"
              @click="toArtist(singer.id)"
            >
              {{ singer.name
              }}<span
                v-show="
                  song.artists.length != 1 && index2 != song.artists.length - 1
                "
                >/</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div
          class="item"
          v-for="(mv, index) in mv"
          :key="index"
          @click="toMvDetail(mv.id)"
        >
          <div class="img-wrap">
            <img v-lazy="`${mv.picUrl}?param=250y140`" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ mv.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ mv.name }}</div>
            <div class="singer">{{ mv.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reqBanner,
  reqRecommendList,
  reqNewSongs,
  reqRecommendMv,
} from "@/api";
import { createSong } from "@/utils";
import { mapActions, mapMutations } from "@/store/helper/music";
export default {
  name: "discovery",
  data() {
    return {
      // 轮播图数据
      banners: [],
      //推荐歌单
      recommend: [],
      // 最新音乐
      newsong: [],
      //推荐mv
      mv: [],
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    songs() {
      return this.newsong.map((song) => {
        return createSong(song);
      });
    },
  },
  methods: {
    // 获取数据
    async getData() {
      this.loading = true;
      // 获取轮播图
      await reqBanner().then((res) => {
        this.banners = res.data.banners;
      });
      // 获取推荐歌单
      await reqRecommendList({ limit: 10 }).then((res) => {
        this.recommend = res.data.result;
      });
      // 获取最新音乐//推荐音乐接口只能返回6条数据 limit不起效 不知道何原因
      await reqNewSongs({
        type: 0,
      }).then((res) => {
        this.newsong = res.data.data.slice(0, 10);
      });
      // 获取推荐mv
      await reqRecommendMv().then((res) => {
        this.mv = res.data.result;
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    //点击播放音乐

    onClickSong(index) {
      const nomalizedSong = this.songs[index];
      this.startSong(nomalizedSong);
      this.setPlaylist(this.songs);
    },
    ...mapMutations(["setPlaylist"]),
    ...mapActions(["startSong"]),
    //去mv详情页
    toMvDetail(mvid) {
      this.$router.push(`/mv?id=${mvid}`);
    },
    //去歌单详情页
    toListDetail(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    // 查看歌手详情
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
  },
};
</script>

<style >
.discovery-container .el-carousel__container {
  height: 230px;
}

.discovery-container .el-carousel__item img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.discovery-container .title {
  font-weight: normal;
  margin-bottom: 20px;
  padding-left: 8px;
}

.discovery-container .recommend {
  margin-bottom: 40px;
}

.discovery-container .recommend .items {
  display: flex;
  flex-wrap: wrap;
}

.discovery-container .recommend .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
}

.discovery-container .recommend .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.discovery-container .recommend .items .item .desc-wrap {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  max-height: 50px;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  top: -50px;
}

.discovery-container .recommend .items .item .desc-wrap span {
  font-size: 14px;
}

.discovery-container .recommend .items .item:hover .desc-wrap {
  top: 0;
}

.discovery-container .recommend .items .item .img-wrap {
  position: relative;
}

.discovery-container .recommend .items .item .img-wrap .icon-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
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

.discovery-container .recommend .items .item .img-wrap .icon-play::before {
  transform: translateX(3px);
}

.discovery-container .recommend .items .item .img-wrap:hover .icon-play {
  opacity: 1;
}

.discovery-container .recommend .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 14px;
}

.discovery-container .news {
  margin-bottom: 40px;
}

.discovery-container .news .items {
  height: 500px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-left: 15px;
}

.discovery-container .news .items .item {
  height: 100px;
  width: 50%;
  display: flex;
  align-items: center;
}

.discovery-container .news .items .item:hover {
  background-color: #f5f5f5;
}

.discovery-container .news .items .item .index {
  margin-right: 15px;
  font-size: 15px;
}

.discovery-container .news .items .item .img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.discovery-container .news .items .item .img-wrap img {
  width: 80px;
  height: 80px;
  border-radius: 15px;
}

.discovery-container .news .items .item .img-wrap .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  color: #dd6d60;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}

.discovery-container .news .items .item .img-wrap .iconfont::before {
  transform: translateX(3px);
}

.discovery-container .news .items .item .img-wrap:hover .iconfont {
  opacity: 1;
}

.discovery-container .news .items .item .song-wrap {
  justify-content: space-around;
  padding: 10px;
  font-size: 16px;
}

.discovery-container .news .items .item .song-wrap .singer {
  font-size: 14px;
  color: gray;
}

.discovery-container .mvs .items {
  display: flex;
  justify-content: space-around;
}

.discovery-container .mvs .items .item {
  width: 250px;
  cursor: pointer;
}

.discovery-container .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.discovery-container .mvs .items .item .img-wrap > .icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.discovery-container .mvs .items .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.discovery-container .mvs .items .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.discovery-container .mvs .items .item .img-wrap img {
  width: 100%;
  height: 140.63px;
  border-radius: 5px;
}

.discovery-container .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

.discovery-container .mvs .items .item .img-wrap .num-wrap .icon-play {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.discovery-container .mvs .items .item .info-wrap .name {
  font-size: 15px;
  margin-bottom: 5px;
}

.discovery-container .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}
</style>
