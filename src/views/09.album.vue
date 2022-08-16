<template>
  <div class="playlist" v-loading="loading">
    <div class="playlist-top-card">
      <div class="playlist-img-wrap">
        <img v-lazy="albumInfo.picUrl" alt="" />
      </div>
      <div class="playlist-info">
        <div class="playlist-name">
          <div class="tag1">专辑</div>
          {{ albumInfo.name }}
        </div>
        <div class="playlist-user-info">
          <div class="playlist-user-name">
            歌手：<span
              style="cursor: pointer; color: #2980b9"
              @click="toArtist(albumInfo.artist.id)"
              >{{ artistName }}</span
            >
          </div>
          <div class="playlist-user-name">
            时间：{{ albumInfo.publishTime }}
          </div>
          <div class="playlist-user-name">共{{ albumInfo.size }}首</div>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text" style="cursor: pointer" @click="playAll"
            >播放全部</span
          >
        </div>
      </div>
    </div>

    <div class="playlist-tabs-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="歌曲列表" name="song">
          <SongTable
            :songTable="tableData"
            :showImg="false"
            :showIndex="true"
            :showAlbum="true"
            :isCreated="false"
            ref="song"
          />
        </el-tab-pane>
        <el-tab-pane :label="`评论(${commentCount})`" name="comment">
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
        </el-tab-pane>
        <el-tab-pane label="专辑详情" name="desc">
          <span class="desc-title">专辑介绍</span>
          <p
            v-for="(item, index) in albumDescList"
            :key="index"
            class="desc-content"
          >
            {{ item }}
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { formatDate, scrollInto } from "@/utils";
import { reqAlbumComment, reqAlbum } from "@/api";

export default {
  name: "album",
  data() {
    return {
      activeName: "song",
      albumInfo: {},
      artistName: "",
      commentCount: 0,
      albumDescList: "",
      tableData: [],
      comments: [],
      hotComments: [],
      total: 0,
      limit: 20,
      page: 1,
      loading: false,
    };
  },
  created() {
    this.getAllData();
  },
  computed: {
    albumId() {
      return this.$route.query.id;
    },
  },
  methods: {
    // 播放所有歌曲 从第一首开始
    playAll() {
      this.$refs.song.playAll();
    },
    handleClick(tab) {},

    async handleCurrentChange(page) {
      this.page = page;
      this.loading = true;
      await this.getComments();
      setTimeout(() => {
        scrollInto(this.$refs.comment.$refs.comment);
        this.loading = false;
      }, 0);
    },

    // 获取所有数据
    async getAllData() {
      this.loading = true;
      await this.getAlbumData();
      await this.getComments();
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    // 获取专辑数据
    async getAlbumData() {
      await reqAlbum(this.albumId).then((res) => {
        this.albumInfo = res.data.album;
        this.commentCount = this.albumInfo.info.commentCount;
        this.artistName = res.data.album.artist.name;
        this.albumInfo.publishTime = formatDate(this.albumInfo.publishTime);
        this.tableData = res.data.songs;
        let albumDesc = this.albumInfo.description;
        this.albumDescList = albumDesc.split(/[\n]/);
      });
    },
    // 获取评论数据
    async getComments() {
      let params = {
        id: this.albumId,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
      await reqAlbumComment(params).then((res) => {
        this.comments = res.data.comments;
        if (this.page == 1) {
          this.total = res.data.total;
          this.hotComments = res.data.hotComments;
        }
      });
    },
    play() {},
    toAlbum(id) {
      this.$router.push(`/album?id=${id}`);
    },
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
  },
};
</script>


<style scoped>
ul {
  list-style: none;
}

.playlist {
  max-width: 1300px;
  margin: 0 auto;
}

.playlist-top-card {
  display: flex;
  /* height: 300px; */
}

.playlist-img-wrap {
  width: 200px;
  height: 200px;
}

.playlist-img-wrap img {
  width: 100%;
  height: 100%;
}

.playlist-info {
  /* font-size: 16px; */
  padding: 0 20px;
  flex: 1;
}

.playlist-info .tag1 {
  color: rgb(208, 53, 53);
  border: 1px solid rgb(208, 53, 53);
  display: inline-block;
  font-size: 20px;
  margin-right: 10px;
  border-radius: 5px;
  padding: 0px 7px;
  cursor: default;
}

.playlist-name {
  font-size: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.playlist-user-info {
  /* display: flex; */
  align-items: center;
  font-size: 14px;
}

.playlist-user-info img {
  margin: 10px 0;
}

.playlist-user-avatar img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.playlist-user-name {
  margin: 20px 10px;
}

.play-wrap {
  width: 120px;
  height: 35px;
  border-radius: 4px;
  background: linear-gradient(to right, #e85e4d, #c6483c);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

.play-wrap span {
  color: white;
}

.play-wrap span.iconfont {
  margin-right: 8px;
}
.play-wrap span.text {
  font-size: 16px;
}

.playlist-tags {
  margin: 10px 0;
}

.playlist-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.playlist-desc span:nth-of-type(2) {
  font-size: 14px;
}

.playlist-tags .tags {
  font-size: 14px;
}

.playlist-tags .tags:not(:last-of-type)::after {
  content: "/";
  margin: 0 4px;
}

.playlist-tabs-wrap {
  margin-top: 20px;
}

.comment-wrap {
  margin-bottom: 70px;
}

.comment-wrap .title {
  font-size: 20px;
}

.comment-wrap .title .number {
  color: black;
  font-size: 18px;
}

.comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.comment-wrap .item .date {
  color: #bebebe;
  font-size: 14px;
}

.comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}

.comment-wrap .item .content-wrap .comment {
  font-size: 14px;
}

.comment-wrap .item .content-wrap .content,
.comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}

/* 专辑介绍 */
.desc-content {
  line-height: 1.8rem;
  text-indent: 2rem;
  margin: 1rem 0;
  color: #676767;
}

.desc-title {
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  margin: 10px 0;
}
</style>