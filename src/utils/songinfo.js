/**
 * 获取音乐相关信息
 */
import {
    reqMvUrl,
    reqSongUrl,
    reqAlbum
} from "@/api"
import {
    notify,
    durationTransformItem,
    isDef
} from './common';
export function createSong(song) {
    const {
        id,
        name,
        artists,
        duration,
        dt,
    } = song
    return {
        id,
        name,
        img: albumPic(song),
        artists: song.ar || song.artists,
        albumId: getAlbumId(song),
        albumName: getAlbumName(song),
        url: genSongPlayUrl(song.id),
        artistsText: artistsInfo(artists),
        duration: durationTransform(song),
        durationSecond: duration / 1000||dt/1000,
        mvId: song.mv || song.mvid,
    }
}

//歌手信息
export function artistsInfo(artists) {
    return (artists || []).map(({
        name
    }) => name).join('/')
}

// 获取歌曲url
function genSongPlayUrl(id) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 请求是获取到的promise???没法return出数据
/* export async function genSongPlayUrl(id) {
    const {
        data
    } = await reqSongUrl(id)
    console.log(data)
    const {        
        data: [
             { url }]      
    } = data
    console.log(url)
    return url
}
 */

// 获取歌曲封面地址
export function albumPic(row) {
    return row.al ? row.al.picUrl : row.album.picUrl;
}

export async function getSongImg(albumId) {
    const {
        data
    } = await reqAlbum(albumId)
    const {
        album: {
            picUrl
        }
    } = data
    return picUrl
}
// 是否有多位歌手
export function showMoreArtists(row, index) {
    if (row.ar) {
        return row.ar.length != 1 && index != row.ar.length - 1;
    } else {
        return row.artists.length != 1 && index != row.artists.length - 1;
    }
}
// 专辑ID
export function getAlbumId(row) {
    return row.al ? row.al.id : row.album.id;
}
// 专辑名字
export function getAlbumName(row) {
    return row.al ? row.al.name : row.album.name;
}
// 时长转换
export function durationTransform(row) {
    return durationTransformItem(row);
}


// 有时候虽然有mvId 但是请求却404 所以跳转前先请求一把
export async function goMvWithCheck(id) {
    try {
        await reqMvUrl(id)
        goMv(id)
    } catch (error) {
        notify("mv获取失败")
    }
}