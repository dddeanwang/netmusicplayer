import axios from 'axios'
import {
    Message
} from 'element-ui'

// API请求的地址头
// let baseURL = "http://api.bestfe.top"
// let baseURL = "http://47.96.91.10:3000"
let baseURL = "http://localhost:3000"
const request = axios.create({
    baseURL,
    timeout: 5000
})
//响应拦截器
request.interceptors.response.use(
    response => {
        if (response.status == 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        error && Message({
            type: 'error',
            message: '网络连接出问题了~',
            showClose: true
        })
    }
)

export default request