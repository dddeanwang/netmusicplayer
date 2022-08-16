<template>
  <div class="mvs-container" v-loading="loading">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li
            class="tab"
            v-for="(area, index) in areaTabs"
            :key="index"
            @click="changeActiveAreaTab(area)"
          >
            <span :class="area == activeAreaTab ? 'title active' : 'title'">
              {{ area }}
            </span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li
            class="tab"
            v-for="(type, index) in typeTabs"
            :key="index"
            @click="changeActiveTypeTab(type)"
          >
            <span :class="type == activeTypeTab ? 'title active' : 'title'">
              {{ type }}
            </span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li
            class="tab"
            v-for="(sort, index) in sortTabs"
            :key="index"
            @click="changeActiveSortTab(sort)"
          >
            <span :class="sort == activeSortTab ? 'title active' : 'title'">
              {{ sort }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div
          class="item"
          v-for="(mv, index) in mvList"
          :key="index"
          @click="toMvDetail(mv.id)"
        >
          <div class="img-wrap">
            <img v-lazy="mv.cover" />
            <p class="iconfont icon-play play"></p>
            <div class="num-wrap">
              <!-- 这里的两个icon-play有冲突 所以起个别名 -->
              <div class="iconfont icon-play small-play"></div>
              <div class="num">{{ mv.playCount }}</div>
            </div>
            <div class="mv-duration">{{ mv.duration }}</div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ mv.name }}</div>
            <div class="singer">{{ mv.artists[0].name }}</div>
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
  </div>
</template>

<script>
import { reqMvList } from "@/api";
import { durationTransform, playCountTransform } from "@/utils";
export default {
  name: "mvs",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 页容量
      limit: 16,
      //地区标签
      areaTabs: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      // 当前选中地区标签
      activeAreaTab: "全部",
      //类型标签
      typeTabs: ["全部", "官方版", "原声", "现场版", "网易出品"],
      activeTypeTab: "全部",
      // 排序标签
      sortTabs: ["上升最快", "最热", "最新"],
      activeSortTab: "上升最快",
      //MV列表
      mvList: [],
      loading: false,
    };
  },
  created() {
    this.getMvList();
  },

  methods: {
    //改变活动标签
    changeActiveAreaTab(area) {
      this.activeAreaTab = area;
      this.getMvList();
    },
    changeActiveTypeTab(type) {
      this.activeTypeTab = type;
      this.getMvList();
    },
    changeActiveSortTab(sort) {
      this.activeSortTab = sort;
      this.getMvList();
    },
    //去mv详情页
    toMvDetail(mvid) {
      this.$router.push(`/mv?id=${mvid}`);
    },
    // 获取MV数据
    //参数名字一定要写对!不然就请求不到正确的结果
    async getMvList() {
      this.loading = true;
      let params = {
        area: this.activeAreaTab,
        type: this.activeTypeTab,
        order: this.activeSortTab,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
      await reqMvList(params).then((res) => {
        //只有第一次请求才获取total
        if (this.page == 1) this.total = res.data.count;
        this.mvList = res.data.data;
        durationTransform(this.mvList);
        playCountTransform(this.mvList);
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    // 分页器处理逻辑
    handleCurrentChange(page) {
      this.page = page;
      this.getMvList();
    },
  },
};
</script>

<style >
.mvs-container {
  padding-top: 20px;
}

.mvs-container .filter-wrap > div {
  margin-bottom: 30px;
  vertical-align: baseline;
  display: flex;
  align-items: center;
}

.mvs-container .filter-wrap > div span {
  font-size: 14px;
  height: 100%;
}

.mvs-container .filter-wrap > div span.title {
  margin: 20px;
  color: gray;
  cursor: pointer;
  padding: 5px 20px;
}

.mvs-container .filter-wrap > div span.title.active {
  color: #dd6d60;
  background-color: #fcf6f5;
  border-radius: 20px;
}

.mvs-container .filter-wrap > div span.title::before {
  content: "", pos;
}

.mvs-container .filter-wrap > div ul {
  display: flex;
}

.mvs-container .filter-wrap > div ul li {
  line-height: 20px;
}
.mvs-container .filter-wrap > div ul li:not(:last-child) {
  border-right: 1px solid #f2f2f1;
}

.mvs-container .mvs .items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.mvs-container .mvs .items .item {
  width: 250px;
  /* 固定了高也可以让显示效果更稳定 不会有的高有的低 */
  height: 200px;
  cursor: pointer;
  margin-right: 25px;
  margin-bottom: 20px;
}

.mvs-container .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.mvs-container .mvs .items .item .img-wrap img {
  width: 100%;
  /* 不设置高度的话就会先占满元素再缩回 影响体验 */
  height: 140px;
  border-radius: 5px;
}

.mvs-container .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 16px;
  padding-right: 10px;
  padding-top: 5px;
}
.mvs-container .mvs .items .item .img-wrap .mv-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: white;
  font-size: 16px;
}
/* 小播放按钮 */
.mvs-container .mvs .items .item .img-wrap .num-wrap .small-play {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

/* mv的播放按钮 不和小播放按钮冲突 start */
.mvs-container .mvs .items .item .img-wrap {
  position: relative;
}

.mvs-container .mvs .items .item .img-wrap .play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 以上三句让图标居中 */
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
/* 让圆形中的播放按钮居中! */
.mvs-container .mvs .items .item .img-wrap .play::before {
  transform: translateX(3px);
}
/* 鼠标放上去才显示 */
.mvs-container .mvs .items .item .img-wrap:hover .play {
  opacity: 1;
}
/* mv的播放按钮 end */

.mvs-container .mvs .items .item .info-wrap .name {
  font-size: 15px;
  /* 只显示两行文字 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mvs-container .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}
</style>
