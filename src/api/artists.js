// 引入封装好的axios
import request from "@/utils/request";

// 与歌手相关的API 通过type来判断不同类型的请求
export const reqArtists=(params,type="")=>{
    let url = type=="" ? '/artists' : '/artist/'+type
    if(type == 'simi')
        url = '/simi/artist'
    return request({
        url,
        method:'get',
        params
    })     
}

// 专辑内容
// 传入专辑 id
export const reqAlbum = id => request.get(`/album?id=${id}`)