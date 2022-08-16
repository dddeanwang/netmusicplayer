// 引入封装好的axios
import request from "@/utils/request";
//歌单相关


//歌单列表 精品歌单  `limit`: 取出歌单数量 , 
// 默认为 20 `cat`: 歌单的标签，可选值

export const reqHighqualityList = (params) => request({
    url: "/top/playlist/highquality",
    method: "get",
    params
})

// 歌单列表 普通歌单
// **可选参数 :** 
// 1. `limit`:获取的个数
// 2. `offset`: 偏移数量 , 用于分页 , 如 :( 页数 -1)*20, 其中 20 为 limit 的值
// 3. `cat`: 歌单的标签
export const reqSongList = (params) => request({
    url: '/top/playlist',
    method: 'get',
    params
})


// 获取相似歌单
// 传入歌曲 id,
export const reqSimiPlaylists = (id) => request.get(`/simi/playlist?id=${id}`)

//歌单详情
export const reqListDetail = (params) => request.get('/playlist/detail', { params })

//获取歌单所有歌曲
export const reqListAll = (params) => request.get('/playlist/track/all', { params })
