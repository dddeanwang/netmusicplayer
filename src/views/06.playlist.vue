<template>
  <div class="playlist-container" v-loading="loading">
    <div class="top-wrap">
      <div class="img-wrap">
        <img v-lazy="`${playlistInfo.coverImgUrl}?param=230y230`" alt="" />
      </div>
      <div class="info-wrap">
        <div class="nametitle">
          <div class="playlist-tag">歌单</div>
          {{ playlistInfo.name }}
        </div>
        <div class="author-wrap">
          <img
            class="avatar"
            v-lazy="`${playlistInfo.creatorAvatar}?param=35y35`"
            alt=""
          />
          <span class="name">{{ playlistInfo.creatorNickname }}</span>
          <span class="time">{{ playlistInfo.creatTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text" style="cursor:pointer" @click="playAll">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(tag, index) in playlistInfo.tags" :key="index">
              {{ tag }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlistInfo.description }}</span>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲列表" name="song">
        <SongTable
          :songTable="playlistAll"
          :showImg="true"
          :showIndex="true"
          :showAlbum="true"
          :isCreated="false"
          ref="song"
        />
      </el-tab-pane>

      <el-tab-pane :label="`评论(${playlistInfo.commentCount})`" name="comment">
        <Comment
          ref="comment"
          :comments="comments"
          :hotComments="hotComments"
          :total="total"
        />
        <!-- 分页器  -->
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
    </el-tabs>
  </div>
</template>

<script>
import { reqListDetail, reqListAll, reqPlaylistComment } from "@/api";
import { formatDate, scrollInto } from "@/utils";
export default {
  name: "playlist",
  data() {
    return {
      activeName: "song",
      // 评论总条数
      total: 1,
      // 页码
      page: 1,
      // 每页评论条数
      limit: 20,
      // 播放列表信息
      playlistInfo: {},
      //歌单所有歌曲
      playlistAll: [],
      // 热评
      hotComments: [],
      // 全部评论
      comments: [],
      loading: false,
    };
  },
  created() {
    this.getPlaylist();
  },
  computed: {
    //通过路由组件获取歌单id
    playListId() {
      return this.$route.query.id;
    },
  },
  methods: {
    // 播放所有歌曲 从第一首开始
    playAll() {
      this.$refs.song.playAll();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getComments();
      setTimeout(() => {
        scrollInto(this.$refs.comment.$refs.comment);
        this.loading = false;
      }, 0);
    },
    //获取所有信息
    async getPlaylist() {
      this.loading = true;
      let params = {
        id: this.playListId,
      };
      await reqListDetail(params)
        .then((res) => {
          // 解构出歌单具体信息,加快加载速度
          this.playlistInfo.coverImgUrl = res.data.playlist.coverImgUrl;
          this.playlistInfo.name = res.data.playlist.name;
          this.playlistInfo.tags = res.data.playlist.tags;
          this.playlistInfo.description = res.data.playlist.description;
          this.playlistInfo.commentCount = res.data.playlist.commentCount;
          this.playlistInfo.creatorAvatar = res.data.playlist.creator.avatarUrl;
          this.playlistInfo.creatorNickname =
            res.data.playlist.creator.nickname;
          this.playlistInfo.creatTime = formatDate(
            res.data.playlist.updateTime
          );
          this.playlistInfo.totalSong = res.data.playlist.trackIds.length;
        })
        .then(() => {
          if (this.playlistInfo.totalSong > 100) {
            this.getSongs(100);
          } else {
            this.getSongs();
          }
          this.getComments();
        });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    // 获取全部评论
    async getComments() {
      let params = {
        id: this.playListId,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
      await reqPlaylistComment(params).then((res) => {
        this.total = res.data.total;
        this.comments = res.data.comments;
        if (this.page == 1) {
          this.hotComments = res.data.hotComments;
        }
      });
    },
    // 获取全部歌曲
    async getSongs(limit) {
      let params = {
        id: this.playListId,
        limit,
      };
      await reqListAll(params).then((res) => {
        this.playlistAll = res.data.songs;
      });
    },
  },
};
</script>

<style >
.playlist-container {
  margin: auto;
  padding-top: 40px;
}

.playlist-container .top-wrap {
  display: flex;
}

.playlist-container .top-wrap span {
  font-size: 17px;
}

.playlist-container .top-wrap .img-wrap {
  margin-right: 30px;
}

.playlist-container .top-wrap .img-wrap img {
  width: 230px;
  height: 230px;
}

.playlist-container .top-wrap .info-wrap .playlist-tag {
  color: rgb(208, 53, 53);
  border: 1px solid rgb(208, 53, 53);
  display: inline-block;
  font-size: 20px;
  margin-right: 10px;
  border-radius: 5px;
  padding: 0px 7px;
}
.playlist-container .top-wrap .info-wrap .nametitle {
  margin-bottom: 20px;
  font-size: 25px;
  font-weight: 600;
}

.playlist-container .top-wrap .info-wrap .author-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.playlist-container .top-wrap .info-wrap .author-wrap img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
}

.playlist-container .top-wrap .info-wrap .author-wrap .name {
  margin-right: 10px;
}

.playlist-container .top-wrap .info-wrap .author-wrap .time {
  font-size: 14px;
}

.playlist-container .top-wrap .info-wrap .play-wrap {
  width: 120px;
  height: 35px;
  border-radius: 4px;
  background: linear-gradient(to right, #e85e4d, #c6483c);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

.playlist-container .top-wrap .info-wrap .play-wrap span {
  color: white;
}

.playlist-container .top-wrap .info-wrap .play-wrap span.iconfont {
  margin-right: 8px;
}

.playlist-container .top-wrap .info-wrap .play-wrap span.text {
  font-size: 16px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap {
  display: flex;
  margin-bottom: 15px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap span {
  margin: 0;
}

.playlist-container .top-wrap .info-wrap .tag-wrap ul {
  display: flex;
  align-items: center;
}

.playlist-container .top-wrap .info-wrap .tag-wrap li {
  font-size: 15px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap li:not(:last-child)::after {
  content: "/";
  margin: 0 4px;
}

.playlist-container .top-wrap .info-wrap .desc-wrap span:last-child {
  font-size: 15px;
}

.playlist-container .top-wrap .info-wrap span:first-child {
  margin-right: 10px;
}
</style>
