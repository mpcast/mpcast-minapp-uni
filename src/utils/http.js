// import fly from '@/utils/request'
import tips from './tips'
import global from './global.js'
// HTTP 请求工具类
export default class http {
    static async request(method, url, data) {
        const requestOptions = {
            header: {
                'Authorization': `Bearer ${global.getToken()}`,
                'content-type': 'application/json'
            },
            url,
            data,
            method
        }
        tips.loading()

        const [error, res] = await uni.request(requestOptions)
        if (this.isSuccess(res)) {
            return res.data
        } else {
            throw this.requestException(res)
        }
    }

    /**
     * 判断请求是否成功
     */
    static isSuccess(res) {
        // const wxCode = res.statusCode
        // 微信请求错误
        // if (wxCode !== 200) {
        //   return false
        // }
        // const wxData = res.data
        return !(res !== undefined && res && res.errno !== 0 && res.statusCode !== 200 && res.statusCode !== 201)
    }

    /**
     * 异常
     */
    static requestException(res) {
        const error = {}
        error.statusCode = res.statusCode
        const wxData = res.data
        const serverData = wxData.data
        if (serverData) {
            error.serverCode = wxData.code
            error.message = serverData.message
            error.serverData = serverData
        }
        return error
    }

    // method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

    static get(url, data) {
        return this.request('GET', url, data)
    }

    static put(url, data) {
        return this.request('PUT', url, data)
    }

    static post(url, data) {
        return this.request('POST', url, data)
    }

    static delete(url, data) {
        return this.request('DELETE', url, data)
    }
}
