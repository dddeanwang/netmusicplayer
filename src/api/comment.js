import request from '@/utils/request'

// 歌曲评论
export const reqSongComment = params =>
  request.get(`/comment/music`, {
    params
  })
// 专辑评论
export const reqAlbumComment = params =>
  request.get(`/comment/album`, {
    params
  })
// 歌单评论
export const reqPlaylistComment = params =>
  request.get(`/comment/playlist`, {
    params
  })
// 热门评论
export const reqHotComment = params =>
  request.get(`/comment/hot`, {
    params
  })
// mv评论
export const reqMvComment = params =>
  request.get('/comment/mv', {
    params
  })