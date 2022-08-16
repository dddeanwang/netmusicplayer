
import { isDef } from './common';
import { throttle } from 'lodash-es'
export { debounce, throttle } from 'lodash-es'

export const playModeMap = {
    sequence: {
      code: 'sequence',
      icon: 'sequence',
      name: '顺序播放'
    },
    loop: {
      code: 'loop',
      icon: 'loop',
      name: '单曲循环'
    },
    random: {
      code: 'random',
      icon: 'random',
      name: '随机播放'
    }
  }
  

  // 存储播放记录
  export const PLAY_HISTORY_KEY = '__play_history__'
  
  // 用户id
  export const UID_KEY = '__uid__'
  
  // 音量
export const VOLUME_KEY = '__volume__'
  

export function hasParent(dom, parentDom) {
	parentDom = Array.isArray(parentDom) ? parentDom: [parentDom]
	while(dom) {
		if (parentDom.find(p => p === dom)) {
			return true
		}else {
			dom = dom.parentNode
		}
	}
} 

// 样式相关
// 根据基准字号计算
// 用于静态样式
export const remBase = 14
export function toRem(px) {
    return `${px / remBase}rem`
}

//动态调整字体
let htmlFontSize
!(function() {
  const calc = function() {
    const maxFontSize = 18
    const minFontSize = 14
    const html = document.getElementsByTagName('html')[0]
    const width = html.clientWidth
    let size = remBase * (width / 1440)
    size = Math.min(maxFontSize, size)
    size = Math.max(minFontSize, size)
    html.style.fontSize = size + 'px'
    htmlFontSize = size
  }
  calc()
  window.addEventListener('resize', throttle(calc, 500))
})()
  // 根据当前的html根字体大小计算
// 用于某些js的动态计算
export function toCurrentRem(px) {
    return `${px / htmlFontSize}rem`
  }
  
  export function hasClass(el, className) {
    return el.classList.contains(className)
  }
  
  export function addClass(el, className) {
    el.classList.add(className)
  }
  
  export function getData(el, name, val) {
    const prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
  }

  let elementStyle = document.createElement('div').style

  let vendor = ( () => {
    let transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    }
  
    for (let key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
        return key
      }
    }
  
    return false
  })()
  
export function prefixStyle(style) {
	if (vendor === false) {
		return false
	}

	if (vendor === 'standard') {
		return style
	}

	return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
  
