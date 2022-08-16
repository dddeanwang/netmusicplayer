<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="input-box">
      <el-input
        placeholder="搜索"
        v-model="searchValue"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
        @focus="getSearchHot"
        @blur="showHot = false"
      >
      </el-input>
    </div>
    <!-- 热搜 -->
    <div
      class="search-hot"
      v-show="showHot"
      ref="hot"
      @mousedown.stop="prevent"
    >
      <!-- .stop阻止冒泡 -->
      <el-scrollbar style="height: 100%">
        <div class="history" v-if="history.length">
          <span
            class="hot-title"
            style="display: inline-block; margin-right: 5px"
            >搜索历史</span
          >
          <span
            class="iconfont icon-lajitong"
            style="cursor: pointer"
            title="清空搜索历史"
            @mousedown="deleteHistory(0, true)"
          ></span>
          <div class="history-wrap">
            <div
              class="history-item"
              v-for="(item, index) in history"
              :key="index"
              @mousedown="toSearch(item)"
            >
              {{ item }}
              <span
                class="delete-btn"
                title="删除"
                @mousedown.stop="deleteHistory(index, false)"
                >×</span
              >
            </div>
          </div>
        </div>

        <div class="hot-title">热搜榜</div>
        <ul>
          <li
            style="cursor: pointer"
            class="hot-item"
            v-for="(item, index) in hotData"
            :key="index"
            @mousedown.prevent="toSearch(item.searchWord)"
          >
            <div class="hot-index">{{ index + 1 }}</div>
            <div class="hot-info">
              <div class="hot-top">
                <div class="hot-name">{{ item.searchWord }}</div>
                <div class="hot-score">{{ item.score }}</div>
                <img
                  class="hot-icon"
                  v-show="item.iconUrl && item.iconType != 0"
                  v-lazy="item.iconUrl"
                />
              </div>
              <div class="hot-content">{{ item.content }}</div>
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { reqSearchHot, reqSearchSuggest } from "@/api";
export default {
  name: "search",
  data() {
    return {
      //搜索框输入的值
      searchValue: "",
      // 是否展示热搜框
      showHot: false,
      // 热搜数据
      hotData: [],
      //  历史搜索数据
      history: [],
    };
  },
  methods: {
    search() {
      if (this.isNull(this.searchValue)) {
        //  如果为空,弹出错误提示信息
        this.$message({
          showClose: true,
          message: "请输入搜索内容",
          type: "error",
        });
      } else {
        //  不为空,去搜索结果页面
        this.$router.push({ path: `/result?keywords=${this.searchValue}` });
        // 把本次搜索关键字加入历史搜索列表
        if (!this.history.includes(this.searchValue)) {
          this.history.push(this.searchValue);
        }
      }
    },
    // 判断输入是否为空 光判断是空字符串还不够 因为输入空格不算空
    isNull(str) {
      if (str == "") return true;
      let re = new RegExp("^[ ]+$");
      return re.test(str);
    },
    // 获取热搜数据
    getSearchHot() {
      this.showHot = true;
      if (this.hotData.length == 0)
        reqSearchHot().then((res) => {
          this.hotData = res.data.data;
        });
    },
    // 跳转到搜索
    toSearch(value) {
      this.searchValue = value;
      this.search();
    },
    //阻止blur事件 也可以用@mousedown.prevent; mousedown的优先级高于blur
    //event.preventDefault();
    deleteHistory(index, all) {
      if (all) this.history = [];
      else
        for (let i = 0; i < this.history.length; i++) {
          if (i == index) this.history.splice(i, 1);
        }
      event.preventDefault();
    },
    prevent() {
      event.preventDefault();
    },
  },
};
</script>

<style>
/* 搜索框 */
.input-box {
  display: flex;
  align-items: center;
  width: 200px;
  height: 14px;
  margin: 20px 30px;
}

.input-box input {
  border-radius: 5px;
  background-color: #ededed;
  border: none;
  outline: none;
  font-size: 14px;
  color: #645254;
}

.el-input__icon {
  color: #645254;
}

.search-hot {
  width: 300px;
  height: 500px;
  /* border: 1px solid #333; */
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  top: 55px;
  right: 30px;
  padding: 10px 10px;
  box-sizing: border-box;
}

.hot-title {
  margin: 10px 0;
  font-weight: bold;
}

.hot-item {
  height: 40px;
  display: flex;
  align-items: center;
 
}

.hot-item:hover {
  background-color: seashell;
}

.hot-index {
  font-size: 20px;
  color: rgb(236, 65, 65);
  margin-right: 15px;
}

.hot-info {
  flex: 1;
  font-size: 12px;
  color: slategray;
}

.hot-top {
  display: flex;
  align-items: center;
}

.hot-name {
  font-size: 16px;
  margin-right: 15px;
  color: #000;
}

.hot-icon {
  width: 30px;
  /* height: 15px; */
  margin-left: 5px;
}

.hot-content{
  /* 只显示一行文字 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.history-item {
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer;
  margin: 5px;
}

.history-item:hover {
  background-color: #f5f7fa;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn {
  cursor: pointer;
  opacity: 0;
}
</style>