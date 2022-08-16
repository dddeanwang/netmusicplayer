<template>
  <div class="songs-container" v-loading="loading">
    <!-- 标签栏 -->
    <div class="tab-bar">
      <span
        v-for="(tag, index) in tabs"
        :class="tag.title == tabActive ? 'item active' : 'item'"
        :key="index"
        @click="changeActive(index)"
      >
        {{ tag.title }}
      </span>
    </div>
    <!-- 底部的table -->
    <SongTable
      :songTable="newSongs"
      :showImg="true"
      :showIndex="true"
      :showAlbum="true"
      :isCreated="false"
    />
  </div>
</template>

<script>
import { reqNewSongs } from "@/api";
export default {
  name: "songs",
  data() {
    return {
      //当前活动标签
      tabActive: "全部",
      tabActiveType: "0",
      //所有标签
      tabs: [
        { title: "全部", type: 0 },
        { title: "华语", type: 7 },
        { title: "欧美", type: 96 },
        { title: "日本", type: 8 },
        { title: "韩国", type: 16 },
      ],
      // 获取到的最新音乐
      newSongs: [],
      loading: false,
    };
  },
  created() {
    this.getNewSongs();
  },
  methods: {
    //改变当前活动标签
    changeActive(index) {
      this.tabActive = this.tabs[index].title;
      this.tabActiveType = this.tabs[index].type;
      this.getNewSongs();
    },
    //获取最新音乐
    getNewSongs() {
      this.loading = true;
      let params = {
        type: this.tabActiveType,
      };
      reqNewSongs(params)
        .then((res) => {
          this.newSongs = res.data.data;
        })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 0);
        });
    },
  },
};
</script>

<style >
.songs-container .tab-bar {
  display: flex;
  justify-content: flex-start;
  margin: 20px 0px;
}

.songs-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.songs-container .tab-bar .item.active {
  color: #dd6d60;
}
</style>
