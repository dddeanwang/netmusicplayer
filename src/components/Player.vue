<template>
  <transition leave-active-class="closeWindow">
    <div class="song-detail" v-show="isPlayerShow" ref="bg">
      <i class="el-icon-arrow-down" @click="close"></i>
      <div class="content">
        <div class="img-box">
          <img
            src="@/assets/player_bar.png"
            :class="{ 'player-bar isplay': playing, 'player-bar': !playing }"
          />
          <div class="img-wrap-rotate">
            <img
              :src="currentSong.img ? currentSong.img : defaultImgUrl"
              alt=""
              :class="{ running: playing, paused: !playing }"
              crossorigin="anonymous"
              ref="cover"
            />
          </div>
        </div>

        <div class="song-wrap">
          <div class="song-title">
            {{ currentSong.name }}
            <span
              v-if="currentSong.mvId"
              class="iconfont icon-mv song-mv"
              @click="toMvDetail(currentSong.mvId)"
              >MV</span
            >
          </div>
          <div class="song-artist">
            <div
              v-for="(singer, index) in currentSong.artists"
              :key="index"
              style="cursor: pointer; display: inline-block"
              @click="toArtist(singer.id)"
            >
              {{ singer.name }}

              <span
                style="margin: 0 3px"
                v-if="showMoreArtists(currentSong, index)"
                >/</span
              >
            </div>

            <span> - </span>

            <span
              style="cursor: pointer"
              @click="toAlbum(currentSong.albumId)"
              >{{ currentSong.albumName }}</span
            >
          </div>
          <!-- <div style="margin: 5px 0 60px 0">
            <span class="song-info">{{ currentSong.artistsText }} </span>
          </div> -->
          <div class="lyric-wrap">
            <el-scrollbar style="height: 100%" v-if="hasLyric" ref="scroll">
              <p
                v-for="(item, index) in lyric"
                :key="index"
                :class="{ 'active-lyric': currentIndex === index }"
              >
                {{ item.lyricWords }}
              </p>
            </el-scrollbar>
            <p v-if="!hasLyric">还没有歌词哦~</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ColorThief from "colorthief";
import { reqLyric } from "@/api";
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from "@/store/helper/music";

export default {
  name: "Player",
  data() {
    return {
      defaultImgUrl: require("@/assets/defaultImg.png"),
      lyric: [],
      currentIndex: 0,
      hasLyric: true,
      colors: [],
    };
  },
  methods: {
    // 关闭播放器
    close() {
      this.setPlayerShow(false);
    },
    // 是否有多位歌手
    showMoreArtists(row, index) {
      return row.artists.length != 1 && index != row.artists.length - 1;
    },
    //获取背景
    getColor() {
      let img = this.$refs.cover;
      img.addEventListener("load", () => {
        let colorthief = new ColorThief();
        this.colors = colorthief.getPalette(img, 2);
        this.$refs.bg.style.background = `linear-gradient(to right bottom, 
                                                rgb(${this.colors[0][0]},${this.colors[0][1]},${this.colors[0][2]}), 
                                                rgb(${this.colors[1][0]},${this.colors[1][1]},${this.colors[1][2]}))`;
      });
    },
    // 获取歌词
    getLyric() {
      reqLyric(this.currentSong.id).then((res) => {
        let _this = this;
        this.$nextTick(() => {
          _this.getColor();
        });

        if (!Object.hasOwnProperty.call(res.data, "lrc")) {
          _this.hasLyric = false;
        } else {
          this.hasLyric = true;
          let lyricStr = res.data.lrc.lyric;
          let lyricList = lyricStr.split("\n");
          let lyric = [];
          for (let item of lyricList) {
            // 截取时间 去掉[]
            let end = item.indexOf("]");
            let time = item.slice(1, end);
            let currentTime = this.timeFormat(time);

            // 截取歌词,正则表达式去除[]及其包括的内容
            let lyricWords = item.replace(/\[.*?\]/g, "");
            // let lyricWords = item.slice(end+1).trim()
            if (lyricWords)
              lyric.push({
                currentTime,
                lyricWords,
              });
          }
          this.lyric = lyric;
        }
      });
    },
    timeFormat(time) {
      let minute = parseInt(time.split(":")[0]);
      let second = Math.ceil(time.split(":")[1]);
      let currentTime = minute * 60 + second;
      return currentTime;
    },
    lryicActive(time) {
      for (let i = 0; i < this.lyric.length; i++) {
        if (this.lyric[i].currentTime == Math.ceil(time)) {
          // console.log(`第${i}句，时间为${this.lyric[i].currentTime},${this.lyric[i].lyricWords}`)

          // let _view = document.querySelector(".lyric-wrap .el-scrollbar__view")
          // let top = parseInt(window.getComputedStyle(_view).top)
          // _view.style.transform = `translate3d(0,${80 - i * 73}px,0)` //还是会存在bug，歌词会自动滚动，滚动条不会，导致无法上拉显示已经放过的歌词。

          // 可实现歌词垂直居中
          let _p = document.querySelector(".active-lyric");
          let _pOffsetTop = _p.offsetTop;
          this.$refs["scroll"].wrap.scrollTop =
            _pOffsetTop - _p.offsetHeight * 3; //想滚到哪个高度，就写多少
          this.currentIndex = i;
        }
      }
    },
    // 跳转MV详情
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    // 跳转歌手详情
    toArtist(id) {
      this.$router.push(`/artist?id=${id}`);
    },
    // 跳转专辑详情
    toAlbum(id) {
      this.$router.push(`/album?id=${id}`);
    },
    ...mapMutations(["setPlayerShow", "setPlayingState"]),
    ...mapActions(["startSong", "addToPlaylist"]),
  },
  computed: {
    ...mapState(["currentSong", "currentTime", "playing", "isPlayerShow"]),
    ...mapGetters(["hasCurrentSong"]),
  },
  watch: {
    currentTime() {
      if (this.hasLyric)
        //解决没有歌词仍会滚动的bug
        this.lryicActive(this.currentTime);
    },
    currentSong(newSong) {
      if (newSong.id) {
        this.getLyric();
      }
    },
    $route: {
      deep: true,
      handler() {
        this.setPlayerShow(false);
        this.setPlayingState(false);
      },
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

.lyric-wrap .el-scrollbar__view {
  position: relative;
  padding: 100px 0 300px 0;
}


.song-detail {
  width: 100%;
  /* height: calc(100% - 60px); */

  /* 歌词界面全屏 */
  height: 100%;
  z-index: 3;

  /* background: linear-gradient(to left top, rgb(60, 50, 62), rgb(77, 70, 88)); */
  /* background: linear-gradient(to left top, rgb(133, 68, 62), rgb(181, 97, 131)); */
  position: fixed;
  top: 100%;
  color: #fff;

  animation-duration: 0.5s;
  animation-name: showWindow;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
}
@keyframes showWindow {
  from {
    top: 100%;
  }
  to {
    top: 0;
  }
}

@keyframes closeWindow {
  from {
    top: 0;
  }
  to {
    top: 100%;
  }
}

.closeWindow {
  animation-duration: 0.3s;
  animation-name: closeWindow;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
}

.song-detail i {
  margin: 10px;
  font-size: 23px;
  cursor: pointer;
  opacity: 0.28;
  padding: 5px;
  border-radius: 50%;
}

.song-detail i:hover {
  background-color: rgb(176, 174, 179);
}

.content {
  display: flex;
}

.content .img-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 120px;
}

.player-bar {
  position: absolute;
  left: 50%;
  top: -10px;
  z-index: 10;
  transform: rotate(-25deg);
  transform-origin: 12px 12px;
  transition: 1s;
}

.isplay {
  transform: rotate(0);
}

.running {
  animation-play-state: running;
}

.paused {
  animation-play-state: paused;
}

.img-wrap-rotate {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
}

.img-wrap-rotate::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
}

.img-wrap-rotate::before {
  content: "";
  position: absolute;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background-color: #000;
}

.img-wrap-rotate img {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  position: relative;

  animation-name: rotation;
  animation-duration: 30s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes rotation {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

span.song-info {
  margin: 5px 0 60px 0;
  font-size: 16px;
  opacity: 0.28;
}

.song-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 60vh;
}

.song-wrap .song-title {
  font-weight: normal;
  font-size: 28px;
  margin-left: 20px;
}

.song-wrap .song-artist {
  font-weight: normal;
  font-size: 20px;
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
  color: rgba(249, 246, 246, 0.826);
}

.lyric-wrap {
  height: 100%;
  width: 80%;
}

.lyric-wrap p {
  padding: 18px;
  font-size: 25px;
  opacity: 0.28;
  cursor: default;
  border-radius: 12px;
}

.lyric-wrap p:hover {
  background-color: rgb(176, 174, 179);
}

.active-lyric {
  font-weight: bold;
  font-size: 15px;
  opacity: 1 !important;
}
</style>