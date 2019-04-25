<template>
    <div class="index">
        <img src="/static/images/banner.svg" class="banner"/>
        <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" withCredentials="true"
                class="c-btn c-btn--primary c-btn--small" v-if="!isAuth">
            授权登录
        </button>
        <button></button>
        <img src="/static/images/footer.png" class="background"/>
    </div>
</template>

<script>
    // import {wxLogin, setStorage, jumpTo, showLoading, hideLoading, modal, toast} from '../utils/wechatUtils';
    import auth from '@/api/auth';
    // import userApi from '@/api/users';
    import authApi from '@/api/auth';

    export default {
        data() {
            return {
                isAuth: false,
                sessionKey: '',
                openId: '',
                nickName: null,
                avatarUrl: null,
                isCanUse: uni.getStorageSync('isCanUse') || true
            };
        },
        methods: {
            async bindGetUserInfo(res) {
                if (!res.detail.iv) {
                    uni.showToast({
                        title: '您取消了授权，登录失败'
                    });
                    return false;
                }
                this.isAuth = await auth.user({block: false, redirect: true}, res.mp.detail)
                if (this.isAuth) {
                    uni.switchTab({
                        url: '/pages/featured'
                    })
                }
                // uni.getUserInfo({
                //     provider: 'weixin',
                //     success: info => {
                //         console.log(info);
                //         try {
                //             uni.setStorageSync('isCanUse', false);
                //         } catch (e) {
                //         }
                //     },
                //     fail(res) {
                //     }
                // });
            },
            async login() {
                uni.showLoading({
                    title: '登录中...'
                });

                // 1 获取登录用户 code
                uni.login({
                    provider: 'weixin',
                    success: loginRes => {
                        const code = loginRes.code;
                        if (!this.isCanUse) {
                            // 非第一次授权获取用户信息
                            uni.getUserInfo({
                                provider: 'weixin',
                                success: info => {
                                    console.log(info);
                                }
                            });
                        }
                        // this.isAuth = await auth.user({ block: false, redirect: true }, e.mp.detail);

                        // 2 将用户登录 code 传递到后台置换 sessionKey, openId 等信息
                        uni.request({
                            url: 'http://localhost:5000/wechat/' + code,
                            method: 'GET',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: res => {
                                // openId 或 sessionKey 存储
                                uni.hideLoading();
                            }
                        });
                    }
                });
            },
            updateUserInfo() {
                uni.request({
                    url: 'url',
                    data: {
                        appKey: '',
                        customerId: this.customerId,
                        nickName: this.nickName,
                        headUrl: this.avatarUrl
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: res => {
                        if (res.data.state === 'success') {
                            uni.reLaunch({
                                url: '/pages/index'
                            });
                        }
                    }
                });
            },
            onLoad() {
                const login = authApi.login()
                if (login) {
                    uni.switchTab({
                        url: '/pages/featured'
                    })
                } else {
                    this.isAuth = false
                }
                // const me = await userApi.me();
                // if (me) {
                //     console.log('show me...')
                // } else {
                //     this.isAuth = false
                // }
            }
        }
    };
</script>

<style lang="scss">
    $problemFontColor: #33270c;

    .banner {
        position: absolute;
        top: 300 rpx;
        width: 750 rpx;
        height: 266 rpx;
    }

    .background {
        width: 464 rpx;
        height: 269 rpx;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: absolute;
        bottom: 0;
        z-index: 1;
    }

    .index {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /*position: fixed;*/

        button:after {
            border: none;
        }
    }
</style>
