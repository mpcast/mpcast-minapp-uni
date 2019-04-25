import global from '../utils/global.js'
// import api from './api'
import Base from './base'

/**
 * 权限模块
 * 1 检测本地是否有 token
 * 2 检测本地是否有 openId 和 unionId
 * 3 调用 wx.login 获取 code 将 code 传回后台获取 openId 和 unionId
 * 之后的调用都要带上 openId 和 unionId
 */
export default class Auth extends Base {
    // 检查是否有uuid
    // static checkUUID () {
    //   return Boolean(superbridge.getUUID());
    // }
    static checkOpenId() {
        return Boolean(global.getOpenId());
    }

    static checkUnionId() {
        return Boolean(global.getUnionId());
    }

    static async login() {
        const token = await global.getToken()
        if (token) {
            try {
                const {result} = await this.checkToken()
                if (result && result === 'ok') {
                    return true
                }
                return false
            } catch (e) {
                console.warn('Check token fail', token)
                return await this.doLogin()
            }
        } else {
            console.warn('Token not exists', token)
            return await this.doLogin()
        }
    }

    /**
     * 获取用户信息
     */
    static async user(param = {block: false, redirect: false}, userInfo) {
        try {
            // 检查
            // if (this.hasConfig('user')) {
            //   return true
            // }
            // 检测并登录
            await this.login()
            // 获取用户信息
            // 如果手动授权未获取到用户信息，重新执行授权验证
            // const rawUser = userInfo !== undefined &&
            // userInfo !== null ? userInfo : await global.getUserInfo()
            // if (!rawUser) {
            //   return false
            // }
            // 检查是否通过 校验数据完整性
            await this.checkUserInfo(userInfo)
            // 解密信息
            const data = await this.decryptUserInfo(userInfo)
            // 保存登录信息
            // await this.setConfig('user', JSON.stringify(data))
            await global.setUser(data.result)
            return true
        } catch (error) {
            console.error('授权失败', error)
            if (param.block) {
                const url = `/pages/login?redirect=${param.redirect}`
                if (param.redirect) {
                    wx.redirectTo({
                        url: url
                    })
                } else {
                    wx.navigateTo({
                        url: url
                    })
                }
            }
            return false
        }
    }

    static async doLogin() {
        // 清理全部授权
        // await storage.clearAll()
        // await global.removeToken()
        const {code} = await this.wxlogin()
        const {token} = await this.getToken(code)

        await global.setToken(token)
        await this.login()
    }

    /**
     * 获取会话
     */
    static async getToken(jsCode) {
        const url = `${this.baseUrl}/wechat/${jsCode}`
        const res = await this.get(url)
        if (res.status === 'success') {
            return res.result
        }
    }

    /**
     * 检查登录情况
     */
    static async checkToken() {
        const url = `${this.baseUrl}/auth/check`

        const data = await this.post(url)
        // {status: "success", message: "检测 Token成功", result: "ok"}
        return data
    }

    /**
     * 服务端检查数据完整性
     */
    static async checkUserInfo(userInfo) {
        const url = `${this.baseUrl}/wechat/verify`
        // console.log(userInfo)
        const data = {
            // action: 'check_user_info',
            rawData: userInfo.rawData,
            signature: userInfo.signature
            // thirdSession: this.getConfig('third_session'),
            // app_code: this.getShopCode()
        }
        // await uni.request({
        //     url,
        //     data,
        //     method: 'POST',
        // url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
        // data: {
        //     name: 'name',
        //     age: 18
        // },
        // success: function(res) {
        //     console.log(res.data);
        // }
        // });

        return await this.post(url, data)
    }

    /**
     * 服务端解密用户信息
     */
    static async decryptUserInfo(userInfo) {
        const url = `${this.baseUrl}/wechat/decrypt`
        const param = {
            encryptedData: userInfo.encryptedData,
            iv: userInfo.iv
            // thirdSession: this.getConfig('third_session'),
            // app_code: this.getShopCode()
        }
        return await this.post(url, param)
    }

    //
    // WX LOGIN
    //
    // 检查微信session
    static checkSession() {
        return new Promise((success, fail) => {
            wx.checkSession({
                success,
                fail
            });
        });
    }

    // 调用微信api接口 登录
    static wxlogin() {
        return new Promise((resolve, reject) => {
            uni.login({
                provider: 'weixin',
                success(res) {
                    resolve(res);
                },
                fail: reject
            });
        });
        // uni.login({
        //     provider: 'weixin',
        //     success: loginRes => {
        //         return loginRes
        //         const code = loginRes.code
        // }
        // })
    }

    /**
     * 检查是否存在权限制
     */
    // static hasConfig(/key) {
    //   const value = this.getConfig(key)
    //   return value !== undefined && value !== null && value !== ''
    // }
    /**
     * 设置权限值
     */
    // static getConfig(key) {
    //   return wepy.$instance.globalData.auth[key]
    // }


    // 请求openId 和 unionId
    // static requestForOpenIdAndUnionId () {
    //   return account.login().then((res) => {
    //     return superbridge.getUserInfo().then((info) => {
    //       info.code = res.code;
    //       return info;
    //     });
    //   }).then((info) => {
    //     return superbridge.fetch('/brain/wx/login', {
    //       isForUser: true,
    //       showError: false,
    //       method: 'POST',
    //       body: {
    //         code: info.code,
    //         signature: info.signature,
    //         encryptedData: info.encryptedData,
    //         iv: info.iv
    //       }
    //     });
    //   }).then((res) => {
    //     let openId = res.data && res.data.openId || '';
    //     let unionId = res.data && res.data.unionId || '';
    //     superbridge.setOpenId(openId);
    //     superbridge.setUnionId(unionId);
    //     if (res.code !== 0) {
    //       console.log('获取openId unionId出错');
    //       // 跳转至检查网络错误页面
    //     }
    //   });
    // }
}
