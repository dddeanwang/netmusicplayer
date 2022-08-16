<template>
  <div class="mv-container" ref="mvdetail" v-loading="loading">
    <div class="mv-wrap">
      <h3 class="title">MV详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="mvUrl"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div
          class="singer-info"
          @click="toArtist(mvInfo.artistId)"
          style="cursor: pointer"
        >
          <div class="avatar-wrap">
            <img
              v-lazy="`${artistAvator}?param=70y70` || defaultArtistAvatar"
              alt=""
            />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ playCount }}次</span>
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>
      <Comment
        ref="comment"
        :comments="comments"
        :hotComments="hotComments"
        :total="total"
      />
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="limit"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>

    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div
            class="item"
            v-for="(mv, index) in simiMv"
            :key="index"
            @click="toMvDetail(mv.id)"
          >
            <div class="img-wrap">
              <img v-lazy="`${mv.cover}?param=180y101`" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ mv.playCount }}</div>
              </div>
              <span class="time">{{ mv.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ mv.name }}</div>
              <div class="singer">{{ mv.artists[0].name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { playCountTransform, durationTransform, scrollInto } from "@/utils";
import {
  reqMvDetail,
  reqMvUrl,
  reqSimiMv,
  reqArtists,
  reqMvComment,
} from "@/api";
export default {
  name: "mv",
  data() {
    return {
      loading: false,
      // 评论总条数
      total: 1,
      // 页码
      page: 1,
      // 页容量
      limit: 20,
      //Mv信息
      mvInfo: {},
      playCount: 1,
      //mv地址
      mvUrl: "",
      //类似mv
      simiMv: [],
      // 评论
      comments: [],
      hotComments: [],
      // 歌手id
      artistAvator: "",
      // 默认歌手头像
      defaultArtistAvatar:
        "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=120y120",
    };
  },
  created() {
    this.getMvInfo();
  },
  computed: {
    // mvid
    mvId() {
      return this.$route.query.id;
    },
  },
  watch: {
    // mvid一变化就发请求
    mvId: {
      handler(newVal) {
        //初始化第一页获取到热评
        this.page = 1;
        this.getMvInfo();
        setTimeout(() => {
          scrollInto(this.$refs.mvdetail);
        }, 0);
      },
    },
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page;
      this.loading = true;
      let params = {
        id: this.mvId,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
      reqMvComment(params)
        .then((res) => {
          this.comments = res.data.comments;
          this.total = res.data.total;
          if (this.page == 1) {
            this.hotComments = res.data.hotComments;
          }
        })
        .then(() => {
          setTimeout(() => {
            scrollInto(this.$refs.comment.$refs.comment);
            this.loading = false;
          }, 0);
        });
    },
    //获取MV信息
    async getMvInfo() {
      this.loading = true;
      let id = this.mvId;
      await reqMvDetail(id).then((res) => {
        this.mvInfo = res.data.data;
      });
      // 歌手头像
      await reqArtists({ id: this.mvInfo.artistId }, "detail").then((res) => {
        this.artistAvator = res.data.data.artist.cover;
      });
      //播放量
      let playCountTemp = this.mvInfo.playCount;
      //转换单位
      if (playCountTemp >= 100000) {
        let count = Math.floor(playCountTemp / 10000);
        this.playCount = `${count}万`;
      } else {
        this.playCount = playCountTemp;
      }
      //播放地址
      await reqMvUrl(id).then((res) => {
        this.mvUrl = res.data.data.url;
      });
      // 获取相似MV
      await reqSimiMv(id).then((res) => {
        this.simiMv = res.data.mvs;
        durationTransform(this.simiMv);
        playCountTransform(this.simiMv);
      });
      // 获取全部评论
      await reqMvComment({
        id: this.mvId,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      }).then((res) => {
        this.comments = res.data.comments;
        this.total = res.data.total;
        if (this.page == 1) {
          this.hotComments = res.data.hotComments;
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },

    // 跳转MV
    toMvDetail(mvid) {
      this.$router.push(`/mv?id=${mvid}`);
    },
    // 跳转歌手详情
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
  },
};
</script>

<style>
.mv-container {
  display: flex;
}

.mv-container .title {
  margin-bottom: 20px;
}

.mv-container .mv-wrap {
  width: 700px;
  margin-right: 35px;
}

.mv-container .mv-wrap .date {
  margin-right: 25px;
}

.mv-container .mv-wrap .date,
.mv-container .mv-wrap .number {
  color: #bebebe;
  font-size: 14px;
}

.mv-container .mv-wrap .video-wrap {
  width: 100%;
  height: 390px;
  margin-bottom: 20px;
}

.mv-container .mv-wrap .video-wrap video {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  outline: none;
}

.mv-container .mv-wrap .info-wrap {
  margin-bottom: 50px;
}

.mv-container .mv-wrap .info-wrap .singer-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap img {
  height: 100%;
}

.mv-container .mv-wrap .info-wrap .mv-info .title {
  font-size: 30px;
}

.mv-container .mv-wrap .info-wrap .mv-info .desc {
  font-size: 15px;
  margin-top: 20px;
}

.mv-container .mv-recommend {
  flex: 1;
}

.mv-container .mv-recommend .mvs .items {
  display: flex;
  flex-wrap: wrap;
}

.mv-container .mv-recommend .mvs .items .item {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.mv-container .mv-recommend .mvs .items .item:hover {
  background-color: #f5f5f5;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap {
  width: 180px;
  position: relative;
  margin-right: 10px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap > .icon-play {
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

.mv-container .mv-recommend .mvs .items .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.mv-container .mv-recommend .mvs .items .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap img {
  width: 100%;
  height:100%;
  border-radius: 5px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap {
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

.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap .icon-play {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap {
  flex: 1;
}


</style>
