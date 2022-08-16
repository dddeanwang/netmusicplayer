<template>
  <div class="result-container" v-loading="loading">
    <div class="title-wrap">
      <h2 class="title">{{ keywords }}</h2>
      <span class="sub-title">找到{{ total }}个结果</span>
    </div>
    <el-tabs v-model="activeName">
      <!-- 单曲搜索结果 -->
      <el-tab-pane label="单曲" name="songs">
        <SongTable
          :songTable="songs"
          :showImg="false"
          :showIndex="true"
          :showAlbum="true"
          :isCreated="false"
        />
      </el-tab-pane>

      <!-- 歌单搜索结果 -->
      <el-tab-pane label="歌单" name="playlists">
        <div class="lists">
          <div
            class="item"
            v-for="(list, index) in playlists"
            :key="index"
            @click="toListDetail(list.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ list.playCount }}</span>
              </div>
              <img v-lazy="list.coverImgUrl" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name" :title="list.name">{{ list.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <!-- mv搜索结果 -->
      <el-tab-pane label="MV" name="mvs">
        <MvTable :mvTable="mvs" />
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
    >
    </el-pagination>
  </div>
</template>

<script>
import { reqSearch } from "@/api";
import { playCountTransform, durationTransform } from "@/utils";
export default {
  name: "result",
  data() {
    return {
      activeName: "songs",
      // 每页的数据数量
      limit: 30,
      // 页码
      page: 1,
      total: 1,
      //单曲,歌单,MV
      type: 1,
      songs: [],
      playlists: [],
      mvs: [],
      loading: false,
    };
  },
  methods: {
    //获取搜索结果数据
    async getResult() {
      this.loading = true;
      const { keywords, limit, page, type } = this;
      let params = {
        keywords,
        limit,
        offset: (page - 1) * limit,
        type,
      };
      await reqSearch(params).then((res) => {
        if (type == 1) {
          console.log(res)
          this.songs = res.data.result.songs;
          if(this.page==1){
            this.total = res.data.result.songCount;
          } 
        } else if (type == 1000) {
          this.playlists = res.data.result.playlists;
          playCountTransform(this.playlists);
          this.total = res.data.result.playlistCount;
        } else if (type == 1004) {
          this.mvs = res.data.result.mvs;
          playCountTransform(this.mvs);
          durationTransform(this.mvs);
          this.total = res.data.result.mvCount;
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    // 查看歌单详情
    toListDetail(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    //查看MV详情
    toMvDetail(mvid) {
      this.$router.push(`/mv?id=${mvid}`);
    },
    //分页器
    handleCurrentChange(page) {
      this.page = page;
      this.getResult();
    },
  },
  computed: {
    // 通过路由获取的关键字参数
    keywords() {
      return this.$route.query.keywords;
    },
  },
  watch: {
    // 关键字一变化就发请求
    keywords: {
      handler(newVal) {
        this.activeName = "songs";
        this.page = 1;
        this.getResult();
      },
      immediate: true,
    },
    activeName: {
      handler(newVal) {
        if (newVal == "playlists") {
          this.type = 1000;
          this.limit = 20;
        } else if (newVal == "mvs") {
          this.type = 1004;
          this.limit = 12;
        } else {
          this.type = 1;
          this.limit = 30;
        }
        this.page = 1;
        this.getResult();
      },
    },
  },
};
</script>

<style >
.result-container .title-wrap {
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
}

.result-container .title-wrap .title {
  margin-right: 10px;
}

.result-container .title-wrap .sub-title {
  font-size: 15px;
  color: #bebebe;
}

.result-container .el-table td,
.result-container .el-table th.is-leaf {
  border-bottom: none;
}

.result-container .lists {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.result-container .lists .item {
  width: 200px;
  cursor: pointer;
  margin-right: 20px;
  margin-bottom: 20px;
}

.result-container .lists .item .name {
  color: #1e1e1e;
  font-size: 15px;
  /* 只显示两行文字 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-container .lists .item .img-wrap {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.result-container .lists .item .img-wrap > .icon-play {
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

.result-container .lists .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.result-container .lists .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.result-container .lists .item .img-wrap img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.result-container .lists .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: -30px;
  left: 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  padding-right: 5px;
  padding-left: 5px;
  height: 30px;
  width: 100%;
}

.result-container .lists .item:hover .num-wrap {
  top: 0;
}
</style>
