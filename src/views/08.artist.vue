<template>
  <div class="artist" ref="artist" v-loading="loading">
    <div class="artist-info">
      <div class="artist-img-wrap">
        <img v-lazy="topInfo.picUrl" alt="" />
      </div>
      <div class="artist-others">
        <div class="artist-name">{{ topInfo.name }}</div>
        <div class="artsit-works">
          <div class="artist-works-count">单曲数：{{ topInfo.musicSize }}</div>
          <div class="artist-works-count">专辑数：{{ topInfo.albumSize }}</div>
          <div class="artist-works-count">MV数：{{ topInfo.mvSize }}</div>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 专辑栏 -->
      <el-tab-pane label="专辑" name="album">
        <div class="album">
          <div
            class="item"
            v-for="(list, index) in albumData"
            :key="index"
            @click="toAlbum(list.id)"
          >
            <div class="img-wrap">
              <img v-lazy="`${list.picUrl}?param=200y200`" />
              <span class="iconfont icon-play"></span>
            </div>
            <div class="name" :title="list.name">{{ list.name }}</div>
            <div class="time">{{ list.publishTime }}</div>
          </div>
        </div>
      </el-tab-pane>
      <!-- MV 栏 -->
      <el-tab-pane label="MV" name="mv">
        <MvTable :mvTable="mvData" />
      </el-tab-pane>

      <!-- 歌手详情栏 -->
      <el-tab-pane label="歌手详情" name="detail">
        <span class="detail-title">{{ topInfo.name }}简介</span>
        <p class="detail-words">
          {{ briefDesc }}
        </p>

        <div v-for="(item, index4) in introduction" :key="index4 + 999">
          <span class="detail-title">{{ item.ti }}</span>
          <p class="detail-words" v-for="(x, i) in item.strList" :key="i">
            {{ x }}
          </p>
        </div>
      </el-tab-pane>
      <!-- 相似歌手栏 -->
      <el-tab-pane label="相似歌手" name="simi">
        <div class="simi">
          <div
            class="item"
            v-for="(list, index) in simi"
            :key="index"
            @click="toArtist(list.id)"
          >
            <div class="img-wrap">
              <img v-lazy="`${list.picUrl}?param=200y200`" />
            </div>
            <div class="name" :title="list.name">{{ list.name }}</div>
            <span v-if="simi.length == 0">暂无相似歌手</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
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
</template>

<script>
import { reqArtists } from "@/api";
import {
  durationTransform,
  playCountTransform,
  formatDate,
  scrollInto,
} from "@/utils";
export default {
  name: "artist",
  data() {
    return {
      activeName: "album",
      topInfo: {},
      albumData: [],
      mvData: [],
      briefDesc: [],
      introduction: [],
      simi: [],
      //   element-ui提供的加载中的页面
      loading: false,
      page: 1,
      limit: 20,
      total: 1,
    };
  },
  created() {
    this.getArtistData();
  },

  computed: {
    //歌手id
    artistId() {
      return this.$route.query.id;
    },
    // 分页偏移
    offset() {
      return (this.page - 1) * this.limit;
    },
  },
  watch: {
    artistId(newVal) {
      this.activeName = "album";
      this.getArtistData();
      setTimeout(() => {
        scrollInto(this.$refs.artist);
      }, 0);
    },
  },
  methods: {
    // 点击导航栏回调
    async handleClick(tab) {
      this.loading = true;
      if (tab.name == "mv") {
        this.total = this.topInfo.mvSize;
        this.page = 1;
        await this.getMv();
      } else if (tab.name == "album") {
        this.total = this.topInfo.albumSize;
        this.page = 1;
        await this.getAlbum();
      } else if (tab.name == "simi") {
        this.total = 0;
        //相似歌手数据
        await this.getSimi();
      } else {
        this.total = 0;
        await this.getDesc()
      }
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },

    // 点击分页回调
    async handleCurrentChange(page) {
      this.page = page;
      this.loading = true;
      if (this.activeName == "album") {
        await this.getAlbum();
      }
      if (this.activeName == "mv") {
        await this.getMv();
      }
      setTimeout(() => {
        // scrollInto(this.$refs.artist);
        this.loading = false;
      }, 0);
    },

    // 异步获取歌手基本信息和专辑信息
    async getArtistData() {
      this.loading = true;
      await this.getTopInfo();
      await this.getAlbum();
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },

    //获取顶部数据
    async getTopInfo() {
      await reqArtists(
        {
          id: this.artistId,
        },
        "detail"
      ).then((res) => {
        this.topInfo = {
          albumSize: res.data.data.artist.albumSize,
          musicSize: res.data.data.artist.musicSize,
          mvSize: res.data.data.artist.mvSize,
          name: res.data.data.artist.name,
          picUrl: `${res.data.data.artist.cover}?param=220y220`,
        };
        this.total = res.data.data.artist.albumSize;
      });
    },

    // 获取专辑数据
    async getAlbum() {
      let params = {
        id: this.artistId,
        limit: this.limit,
        offset: this.offset,
      };
      await reqArtists(params, "album").then((res) => {
        this.albumData = res.data.hotAlbums;
        for (let item of this.albumData) {
          item.publishTime = formatDate(item.publishTime);
        }
      });
    },

    // 获取MV数据
    async getMv() {
      let params = {
        id: this.artistId,
        limit: this.limit,
        offset: this.offset,
      };
      await reqArtists(params, "mv").then((res) => {
        this.mvData = res.data.mvs;
        playCountTransform(this.mvData);
        durationTransform(this.mvData);
      });
    },

    // 获取歌手描述信息
    async getDesc() {
      await reqArtists(
        {
          id: this.artistId,
        },
        "desc"
      ).then((res) => {
        // 简介
        this.briefDesc = res.data.briefDesc;
        // 详细介绍
        this.introduction = res.data.introduction;
        let strList = [];
        for (let item of this.introduction) {
          strList = item.txt.split(/[\n]/);
          item.strList = strList;
        }
      });
    },

    //获取相似歌手
    async getSimi() {
      await reqArtists({ id: this.artistId }, "simi").then((res) => {
        this.simi = res.data.artists;
      });
    },

    //跳转按钮
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
    toAlbum(id) {
      this.$router.push(`/album?id=${id}`);
    },
  },
};
</script>

<style scoped>
.artist {
  max-width: 1300px;
  margin: 0 auto;
}

.artist >>> .el-tabs__item {
  font-size: 18px;
}

.artist >>> .el-loading-spinner {
  top: 15%;
}

.artist-info {
  display: flex;
  font-size: 17px;
  margin-bottom: 20px;
}

.artist-img-wrap {
  width: 220px;
  height: 220px;
  margin-right: 50px;
  overflow: hidden;
}

.artist-img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.artist-name {
  font-weight: bold;
  font-size: 22px;
}

.artsit-works {
  margin-top: 30px;
}

.artist-works-count {
  margin: 20px 0;
}

/* tabs部分 */
/* 专辑部分 */

.album {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.album .item {
  width: 200px;
  height: 246px;
  cursor: pointer;
  margin-right: 20px;
  margin-bottom: 20px;
}

.album .item .name {
  color: #1e1e1e;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album .item .img-wrap {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.album .item .img-wrap > .icon-play {
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

.album .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.album .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.album .item .img-wrap img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
.time {
  font-size: 15px;
  color: #707070;
}

/* 歌手详情 */
.detail-title {
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  margin: 10px 0;
}

.detail-words {
  line-height: 1.5rem;
  text-indent: 2rem;
  margin: 0.8rem 0;
  color: #676767;

  /* white-space: pre-line;  */
}

/* 相似歌手 */

.simi {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.simi .item {
  width: 200px;
  cursor: pointer;
  margin-right: 20px;
  margin-bottom: 20px;
}

.simi .item .img-wrap {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.simi .item .img-wrap img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
</style>