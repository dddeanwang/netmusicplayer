<template>
  <div>
    <!-- 精彩评论 -->
    <div class="comment-wrap" v-if="hotComments.length != 0">
      <p class="title">
        精彩评论<span class="number">({{ hotComments.length }})</span>
      </p>
      <div class="comments-wrap">
        <div class="item" v-for="(item, index) in hotComments" :key="index">
          <div class="icon-wrap">
            <img v-lazy="`${item.user.avatarUrl}?param=50y50`" alt="" />
          </div>
          <div class="content-wrap">
            <div class="content">
              <span class="name">{{ item.user.nickname }}：</span>
              <span class="comment">{{ item.content }}</span>
            </div>
            <div class="re-content" v-if="item.beReplied.length != 0">
              <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
              <span class="comment">{{ item.beReplied[0].content }}</span>
            </div>
            <div class="date">{{ formatDateFully(item)}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 最新评论 -->
    <div class="comment-wrap" ref="comment">
      <p class="title">
        最新评论<span class="number">({{ total }})</span>
      </p>
      <div class="comments-wrap">
        <div class="item" v-for="(item, index) in comments" :key="index">
          <div class="icon-wrap">
            <img v-lazy="`${item.user.avatarUrl}?param=50y50`" alt="" />
          </div>
          <div class="content-wrap">
            <div class="content">
              <span class="name">{{ item.user.nickname }}：</span>
              <span class="comment">{{ item.content }}</span>
            </div>
            <div class="re-content" v-if="item.beReplied.length != 0">
              <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
              <span class="comment">{{ item.beReplied[0].content }}</span>
            </div>
            <div class="date">{{ formatDateFully(item) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDateFully} from '@/utils'
export default {
  name: "Comment",
  data() {
    return {
      // 默认用户头像
      defaultUserAvatar:
        "http://p3.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=50y50",
    };
  },
  props: ["comments", "hotComments", "total"],
  methods:{
      formatDateFully(item){
          return formatDateFully(item)
      }
  }
};
</script>

<style>
.comment-wrap {
  margin-bottom: 70px;
}

.comment-wrap .title {
  font-size: 25px;
}

.comment-wrap .title .number {
  color: black;
  font-size: 20px;
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
  font-size: 15px;
}

.comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 15px;
}

.comment-wrap .item .content-wrap .comment {
  font-size: 15px;
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
</style>