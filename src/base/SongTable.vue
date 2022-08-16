<template>
  <div class="song-table" ref="song">
    <el-table :data="songs" style="width: 100%" @row-dblclick="onClickSong">
      <el-table-column type="index" width="60" v-if="showIndex">
      </el-table-column>
      <el-table-column width="100" v-if="showImg">
        <template slot-scope="scope">
          <div class="img-wrap">
            <img v-lazy="$utils.genImgUrl(scope.row.img, 65)" alt="" />
            <p class="iconfont icon-play" @click="onClickSong(scope.row)"></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌曲" width="">
        <template slot-scope="scope">
          <div
            class="song-name"
            :class="isActiveSong(scope.row)"
            :title="scope.row.name"
          >
            <span style="cursor: pointer" @click="onClickSong(scope.row)">{{
              scope.row.name
            }}</span>
            <span
              v-if="scope.row.mvId"
              class="iconfont icon-mv"
              @click="toMvDetail(scope.row.mvId)"
            ></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="artistsInfo" label="歌手" width="">
        <template slot-scope="scope">
          <div
            v-for="(singer, index) in scope.row.artists"
            :key="index"
            style="cursor: pointer; color: #696969; display: inline-block"
            @click="toArtist(singer.id)"
          >
            {{ singer.name
            }}<span
              style="color: #696969; margin: 0 3px"
              v-show="showMoreArtists(scope.row, index)"
              >/</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="albumname" label="专辑" v-if="showAlbum">
        <template slot-scope="scope">
          <span
            style="cursor: pointer; color: #696969"
            @click="toAlbum(scope.row.albumId)"
            >{{ scope.row.albumName }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="时长" width="100"
        ><template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
import { createSong, durationTransformItem } from "@/utils";
import { mapMutations, mapActions, mapState } from "@/store/helper/music";
export default {
  name: "SongTable",
  data() {
    return {};
  },
  props: ["songTable", "showIndex", "showImg", "showAlbum", "isCreated"],
  computed: {
    songs() {
      if (!this.isCreated) {
        return this.songTable.map((song) => {
          return createSong(song);
        });
      } else {
        return this.songTable;
      }
    },
    ...mapState(["currentSong"]),
  },
  methods: {
    // 播放选定歌曲
    onClickSong(row) {
      const createdSong = row;
      this.startSong(createdSong);
      this.setPlaylist(this.songs);
    },
    // 播放所有歌曲
    playAll() {
      this.startSong(this.songs[0]);
      this.setPlaylist(this.songs);
    },
    ...mapMutations(["setPlaylist"]),
    ...mapActions(["startSong"]),

    // 是否当前播放歌曲
    isActiveSong(song) {
      return song.id === this.currentSong.id ? "song-active" : "";
    },

    // 获取歌曲封面
    albumPic(row) {
      return row.al
        ? `${row.al.picUrl}?param=65y65`
        : `${row.album.picUrl}?param=65y65`;
    },

    // 是否有多位歌手
    showMoreArtists(row, index) {
      if (row.ar) {
        return row.ar.length != 1 && index != row.ar.length - 1;
      } else {
        return row.artists.length != 1 && index != row.artists.length - 1;
      }
    },
    // 专辑ID
    albumId(row) {
      return row.al ? row.al.id : row.album.id;
    },
    // 专辑名字
    albumName(row) {
      return row.al ? row.al.name : row.album.name;
    },
    // 时长转换
    durationTransform(row) {
      return durationTransformItem(row);
    },
    // 跳转歌手详情
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
    // 跳转专辑详情
    toAlbum(id) {
      this.$router.push(`/album?id=${id}`);
    },
    // 跳转MV详情
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`);
    },
  },
};
</script>

<style>
/* 只显示一行文字  */
.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-table .song-name {
  color: #1d1d1d;
}
.song-table .song-name.song-active {
  color: #d33a31;
}
.song-table .icon-mv {
  padding-left: 5px;
  color: #dd6d60;
}
</style>