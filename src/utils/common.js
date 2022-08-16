import { Notification } from 'element-ui'
  
  //毫秒转换为分钟和秒

  export const durationTransformItem = (item) => {
      let time = item.duration || item.dt;
      //padStart把给定字符串变成给定长度2,不够的补充0
      let min = parseInt(time / 60000).toString().padStart(2, '0')
      let second = parseInt((time - min * 60000) / 1000).toString().padStart(2, '0')
      return `${min}:${second}`
}
  
export function formatTime(interval) {
    interval = interval | 0
    const minute = pad((interval / 60) | 0)
    const second = pad(interval % 60)
    return `${minute}:${second}`
  }

  export const durationTransform = (songs) => {
      for (let item of songs) {
          let time = item.duration || item.dt;
          //padStart把给定字符串变成给定长度2,不够的补充0
          let min = parseInt(time / 60000).toString().padStart(2, '0')
          let second = parseInt((time - min * 60000) / 1000).toString().padStart(2, '0')
          item.duration = `${min}:${second}`
      }
  }
  //播放量转换为万为单位
  export const playCountTransform = (playlists) => {
      for (let item of playlists) {
          if (item.playCount >= 100000) {
              let count = Math.floor(item.playCount / 10000);
              item.playCount = `${count}万`;
          }

      }
  }

  //时间转换
  export const formatDate = (time) => {
      let now = new Date(time)
      let year = now.getFullYear(); //取得4位数的年份
      let month = (now.getMonth() + 1).toString().padStart(2, '0'); //取得日期中的月份，其中0表示1月，11表示12月
      let date = now.getDate().toString().padStart(2, '0'); //返回日期月份中的天数（1到31）
      return year + "-" + month + "-" + date;
  }


  export const formatDateFully = (item) => {
      let now = new Date(item.time)
      let year = now.getFullYear(); //取得4位数的年份
      let month = (now.getMonth() + 1).toString().padStart(2, '0'); //取得日期中的月份，其中0表示1月，11表示12月
      let date = now.getDate().toString().padStart(2, '0'); //返回日期月份中的天数（1到31）
      let hour = now.getHours().toString().padStart(2, '0'); //返回日期中的小时数（0到23）
      let minute = now.getMinutes().toString().padStart(2, '0'); //返回日期中的分钟数（0到59）
      let second = now.getSeconds().toString().padStart(2, '0'); //返回日期中的秒数（0到59）
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  }

  // dom滚动 注意这里不要用箭头函数 因为传入的参数有this指向问题
//而且一定要操作dom元素才行 像el-table什么的都是vm元素 无法获取这个方法 
export function scrollInto(dom) {
      dom.scrollIntoView({
          behavior: "smooth"
      })
}
  



//比较
export function shallowEqual(a, b, compareKey) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      let compareA = a[i]
      let compareB = b[i]
      if (compareKey) {
        compareA = compareA[compareKey]
        compareB = compareB[compareKey]
      }
      if (!Object.is(a[i], b[i])) {
        return false
      }
    }
    return true
}
  
//设置图片大小
export function genImgUrl(url, w, h) {
    if (!h) {
      h = w
    }
    url += `?param=${w}y${h}`
    return url
}


//消息提醒
export function notify(message, type) {
  const params = {
    message,
    duration: 1500
  }
  const fn = type ? Notification[type] : Notification
  return fn(params)
}
['success', 'warning', 'info', 'error'].forEach(key => {
  notify[key] = (message) => {
    return notify(message, key)
  }
})


// 全屏
export function requestFullScreen(element) {
  const docElm = element;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
}

// 退出全屏
export function exitFullscreen() {
  const de = window.parent.document;

  if (de.exitFullscreen) {
    de.exitFullscreen();
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen();
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen();
  } else if (de.msExitFullscreen) {
    de.msExitFullscreen()
  }
}


// 判断是否全屏
export function isFullscreen() {
  return document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen
}
  
//判断是否定义了该变量
export const isDef = (v) => {
  return v!==undefined&&v!==null
}

export function isUndef(v) {
return v === undefined || v === null
}
export function isTrue(v) {
return v === true
}

export function isFalse(v) {
return v === false
}

//补齐2位 时间
export function pad(num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

// 判断类名
export function hasClass(el, className) {
	return el.classList.contains(className)
}

export function addClass(el, className) {
	el.classList.add(className)
}

