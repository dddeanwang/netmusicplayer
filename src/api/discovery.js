// 引入封装好的axios
import request from "@/utils/request";
//导航-首页发现音乐

//轮播图
export const reqBanner = () => request.get("/banner")

//推荐歌单**可选参数 :** `limit`: 获取数量 , 默认为 30 (不支持 offset)
export const reqRecommendList = (params) => request({
    url: "/personalized",
    method: "get",
    params
})

// 推荐最新音乐
export const reqRecommendNewSong = (params) => request({
    url: "/personalized/newsong",
    method: "get",
    params
})


// 推荐mv
export const reqRecommendMv = () => request({
    url: "/personalized/mv",
    method: "get"
})