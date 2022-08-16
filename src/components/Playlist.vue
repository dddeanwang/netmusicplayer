<template>
  <Toggle
    :reserveDoms="reserveDoms"
    :show="isPlaylistShow"
    @update:show="setPlaylistShow(false)"
  >
    <div class="playlist" ref="playlist" v-show="isPlaylistShow">
      <div class="playlist-tab">
        <span
          v-for="(tab, index) in tabs"
          :class="
            index == activeTab ? 'playlist-tabitem active' : 'playlist-tabitem'
          "
          :key="index"
          @click="tabClick(index)"
        >
          {{ tab }}
        </span>
      </div>
      <div class="header">
        <p class="total">总共{{ dataSource.length }}首</p>
        <div @click="clear" class="remove" v-if="dataSource.length">
          <Icon type="remove" />
          <span class="text">清空</span>
        </div>
      </div>
      <template>
        <div class="song-table-wrap" v-if="dataSource.length">
          <SongTable
            :songTable="dataSource"
            :showImg="false"
            :showIndex="false"
            :showAlbum="false"
            :isCreated="true"
          />
        </div>
        <div class="empty" v-else>你还没有添加任何歌曲</div>
      </template>
    </div>
  </Toggle>
</template>

<script>
import { mapState, mapMutations, mapActions } from "@/store/helper/music";
export default {
  mounted() {
    // 点击需要保留播放器的dom
    this.reserveDoms = [document.getElementById("mini-player")];
  },
  data() {
    this.tabs = ["播放列表", "历史记录"];
    this.LIST_TAB = 0;
    this.HISTORY_TAB = 1;
    return {
      activeTab: this.LIST_TAB,
      reserveDoms: null,
    };
  },
  methods: {
    tabClick(index) {
      this.activeTab = index;
    },
    clear() {
      if (this.isPlaylist) {
        this.clearPlaylist();
      } else {
        this.clearHistory();
      }
    },
    ...mapMutations(["setPlaylistShow", "setPlaylist"]),
    ...mapActions(["clearCurrentSong", "clearPlaylist", "clearHistory"]),
  },
  computed: {
    dataSource() {
      return this.isPlaylist ? this.playlist : this.playHistory;
    },
    isPlaylist() {
      return this.activeTab === this.LIST_TAB;
    },
    ...mapState(["isPlaylistShow", "playlist", "playHistory"]),
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  background: #fff;
  z-index: 5;
  @include box-shadow;

  .playlist-tab {
    text-align: center;
    margin-top: 10px;
    font-size: 15px;

    .playlist-tabitem {
      margin: 0 15px;
      cursor: pointer;
    }
    .active {
      color: #696969;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    margin: 0 20px;
    border-bottom: 1px solid #3f3f3f;

    .total {
      font-size: 15px;
    }

    .remove {
      @include flex-center;
      cursor: pointer;
      font-size: 15px;

      .text {
        display: inline-block;
        margin-left: 4px;
      }
    }
  }

  .song-table-wrap {
    font-size: 14px;
    flex: 1;
    margin-left: 9px;
    overflow-y: auto;
  }

  .empty {
    @include flex-center();
    flex: 1;
  }
}
</style>
