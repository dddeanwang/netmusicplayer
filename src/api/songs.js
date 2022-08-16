// 引入封装好的axios
import request from "@/utils/request";
// 音乐相关

// 最新音乐
// `type`: 地区类型 id,对应以下:
// 全部:0华语:7欧美:96日本:8韩国:16
export const reqNewSongs = (params) => request({
    url: '/top/song',
    method: 'get',
    params
})

// 获取音乐url
export const reqSongUrl = id => request.get(`/song/url?id=${id}`)

// 获取音乐详情
// 传入音乐 id(支持多个 id, 用 , 隔开),
export const reqSongDetail = ids => request.get(`/song/detail?ids=${ids}`)

// 相似音乐
export const reqSimiSongs = (id) =>
  request.get(`/simi/song?id=${id}`)

// 歌词
export const reqLyric = id => request.get(`/lyric?id=${id}`)

