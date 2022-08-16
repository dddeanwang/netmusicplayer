<template>
  <div class="playlists-container" v-loading="loading">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img v-lazy="`${highQuality.coverImgUrl}?param=200y200`" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{ highQuality.name }}
        </div>
        <div class="info">
          {{ highQuality.description }}
        </div>
      </div>
      <img src="../assets/listCover.jpg" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          :class="tag == tabActive ? 'item active' : 'item'"
          v-for="(tag, index) in tabItems"
          :key="index"
          @click="changeActive(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            v-for="(list, index) in songList"
            :key="index"
            @click="toListDetail(list.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ list.playCount }}</span>
              </div>

              <img v-lazy="`${list.coverImgUrl}?param=200y200`" />

              <!-- 播放歌单按钮 -->
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ list.name }}</p>
          </div>
        </div>
      </div>
    </div>
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
import { playCountTransform } from "@/utils";
import { reqHighqualityList, reqSongList } from "@/api";
export default {
  name: "recommend",
  data() {
    return {
      // 总条数
      total: 1,
      // 页码
      page: 1,
      // 每一页的显示数量
      limit: 30,
      //精品歌单数据
      highQuality: {},
      //当前活动标签
      tabActive: "全部",
      // 标签数据
      tabItems: [
        "全部",
        "欧美",
        "华语",
        "流行",
        "说唱",
        "摇滚",
        "民谣",
        "电子",
        "轻音乐",
        "影视原声",
        "ACG",
        "怀旧",
      ],
      // 歌单数据
      songList: [],
      // 总共歌单数据条数
      total: 1,
      loading: false,
    };
  },
  computed: {},
  created() {
    this.getPlayLists(this.tabActive);
  },
  methods: {
    //改变当前活动的标签
    changeActive(tag) {
      this.tabActive = tag;
      this.getPlayLists(this.tabActive);
    },
    //获取歌单数据
    async getPlayLists(tab) {
      this.loading = true;
      await reqHighqualityList({
        limit: 1,
        cat: this.tabActive,
      }).then((res) => {
        this.highQuality = res.data.playlists[0];
      });
      await reqSongList({
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        cat: this.tabActive,
      }).then((res) => {
        this.songList = res.data.playlists;
        playCountTransform(this.songList);
        this.total = res.data.total;
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    /*  // 获取精品歌单
    getHighquality(cat = "全部") {
      let params = ;
      reqHighqualityList(params).then((res) => {
        this.highQuality = res.data.playlists[0];
      });
    },
    // 获取歌单
    getLists(cat = "全部") {
      const { limit, page } = this;
      let params = {
        limit:this.limit,
        offset: (this.page - 1) * this.limit,
        cat:this.tabActive
      };
      reqSongList(params).then((res) => {
        this.songList = res.data.playlists;
        playCountTransform(this.songList);
        this.total = res.data.total;
      });
    }, */
    //去歌单详情页
    toListDetail(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    //分页器
    handleCurrentChange(val) {
      this.page = val;
      this.getPlayLists(this.tabActive);
    },
  },
};
</script>

<style >
.playlists-container .top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.playlists-container .top-card .icon-wrap {
  margin-right: 20px;
  z-index: 1;
}

.playlists-container .top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}

.playlists-container .top-card .content-wrap {
  z-index: 1;
}

.playlists-container .top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}

.playlists-container .top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}

.playlists-container .top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.playlists-container .top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(20px);
}

.playlists-container .top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.playlists-container .tab-container {
  padding-top: 30px;
}

.playlists-container .tab-container .tab-bar {
  display: flex;
  justify-content: center;
}

.playlists-container .tab-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.playlists-container .tab-container .tab-bar .item.active {
  color: #dd6d60;
}

.playlists-container .tab-container .tab-content {
  margin-top: 20px;
}

.playlists-container .tab-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
}

.playlists-container .tab-container .tab-content .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.playlists-container .tab-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.playlists-container .tab-container .tab-content .items .item .num-wrap {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  color: white;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  height: 30px;
  width: 100%;
  padding-left: 5px;
  top: -30px;
  overflow: hidden;
}

.playlists-container .tab-container .tab-content .items .item:hover .num-wrap {
  top: 0;
}

.playlists-container .tab-container .tab-content .items .item .img-wrap {
  position: relative;
}

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .icon-play {
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

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .icon-play::before {
  transform: translateX(3px);
}

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap:hover
  .icon-play {
  opacity: 1;
}

.playlists-container .tab-container .tab-content .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}
</style>
