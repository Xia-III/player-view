<template>
    <div class="hint">
        <div class="topBox">
            <div class="address">
                <p>
                    场地：
                </p>
                <p>
                    {{ addressName }}
                </p>
            </div>
            <div class="machine">
                <p>
                    机器ID:
                </p>
                <p>
                    {{ machineId }}
                </p>
            </div>

        </div>
        <div class="middleBox">
            <img src="../assets/shebei.png" alt="">
            <p>设备离线</p>
            <div class="text">
                请尝试线下投币的方式使用设备

            </div>
            <div class="shebei">
                (若设备支持)，或换一台设备
            </div>

            <button @click="onClick">扫一扫</button>
        </div>
        <div class="bottomBox">
            <div class="user">
                <img :src="avatar" alt="">
                <div class="info">
                    <p @click="vipInfo">{{ nickname }}&nbsp;></p>
                    <div class="copy">
                        <p>玩家ID:{{ playerId }}</p>
                    </div>

                </div>

            </div>
            <div class="coins">余币:{{ coins + coinsBind }}</div>
        </div>
        <div style="position: fixed;right: 10px;bottom: 20%; text-align: center;">
            <img src="../assets/kefus.png" style="width:40px;height:auto;" @click="toKefu">
            <p style="color: #666; font-size: 13px; text-align: center;">客服电话</p>
        </div>
        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"

import {
    v3PlayerProfileAPI, JsApiConfigAPI
} from '../api/index'
import wx from 'weixin-js-sdk'
const offLine = ref(false)
const router = useRouter()

const avatar = ref(null)
const nickname = ref(null)
const playerId = ref(null)
const coinFee = ref(null)
const coins = ref(null)
const coinsBind = ref(null)
const addressId = ref(null)
const machineId = ref(null)
const remark = ref(null)
const addressName = ref(null)
const payCtrlMode = ref(null)
const agencyId = ref(null)
const name = ref('')
const servicePhone = ref('')
const showLoading = ref(false)


// 页面创建时加载玩家数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data.data);
            avatar.value = res.data.data.avatar
            nickname.value = res.data.data.nickname
            playerId.value = res.data.data.playerId
            coinFee.value = res.data.data.coinFee
            coins.value = Math.floor(res.data.data.coins / res.data.data.coinFee)
            coinsBind.value = Math.floor(res.data.data.coinsBind / res.data.data.coinFee)
            addressId.value = res.data.data.addressId
            machineId.value = res.data.data.machineId
            remark.value = res.data.data.remark
            addressName.value = res.data.data.addressName
            payCtrlMode.value = res.data.data.payCtrlMode
            agencyId.value = res.data.data.agencyId
            servicePhone.value = res.data.data.servicePhone
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}
getPost()

const vipInfo = () => {
    router.push({
        path: '/users'
    })
}

const toKefu = () => {
    location.href = 'tel:' + servicePhone.value;
}


const getCode = ref('')
// 微信扫一扫配置
const wxConfig = (_appid, _timestamp, _nonceStr, _signature) => {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值  
        appId: _appid, // 必填，公众号的唯一标识
        timestamp: _timestamp, // 必填，生成签名的时间戳
        nonceStr: _nonceStr, // 必填，生成签名的随机串
        signature: _signature,// 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'startRecord',
            'stopRecord',
            'translateVoice',
            'scanQRCode',// 微信扫一扫接口
            'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 
    });
    wx.error((res) => {
        alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
    });

    wx.ready(() => {
        wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: (res) => {

            },
            fail: (res) => {
                alert(res);
            }
        });
    });
}


const machines = ref()
const isLoading = ref(false)// 标志位，表示请求是否正在进行
const onClick = async () => {//页面点击扫码按钮
    if (isLoading.value) {
        return; // 如果请求正在进行，不执行重复请求
    }
    isLoading.value = true
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { // 是微信端
        // 获取微信签名
        showLoading.value = true;
        await JsApiConfigAPI({
            url: location.href   // 这里是当前页面的url，一定要 location.href 获取，不然签名会无效。
        }).then((res) => {
            showLoading.value = false;
            // console.log(res);
            isLoading.value = false; // 请求完成后将标志位还原
            if (res.data.code == 200) { // res 返回的签名等数据
                wxConfig(res.data.data.appId, res.data.data.timestamp, res.data.data.nonceStr, res.data.data.signature);
                /* 处理失败验证 */
                wx.error((res) => {
                    // config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
                    alert('配置验证失败: ' + res.errMsg);
                });
                wx.scanQRCode({
                    desc: 'scanQRCode desc',
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode"], // 扫二维码
                    success: (res) => {
                        let urlParams = getUrlParams(res.resultStr);
                        getCode.value = urlParams["machineId"];
                        // alert(urlParams)

                        // alert(getCode.value)

                        machines.value = getCode.value
                        // insertCoins.value = true
                        // checked.value = getCode.value.substring(4)
                        router.push({
                            path: '/paycoins',
                            query: {
                                machines: machines.value,
                                flag: true
                            }
                        });

                    },
                    fail: (res) => {
                        // scanCode()
                    },
                    error: (res) => {
                        if (res.errMsg.indexOf('function_not_exist') > 0) {
                            showToast('版本过低请升级');
                        }
                    }
                });
            } else {
                showToast(res.data.message);
            }
        }, (err) => {
            showLoading.value = false;
            isLoading.value = false; // 请求完成后将标志位还原
        });
        return;
    } else {
        showToast('请在微信客户端打开');
        return;
    }
}

const getUrlParams = (val) => {
    let url = val; //获取url中"?"符后的字串 
    let urlParams = new Object();
    if (url.indexOf("?") != -1) { //找到?，这样后面才可能有参数
        url = url.replace(/\?/g, '&'); //?号替换成&号
        let strs = url.split("&"); //分割成等号=键-值对
        for (let i = 0; i < strs.length; i++) {
            if (strs[i].indexOf("=") != -1) {
                let substrs = strs[i].split("=");
                urlParams[substrs[0]] = unescape(substrs[1]);
            }
        }
    }
    return urlParams;
}

</script>

<style scoped lang="less">
.hint {
    .topBox {
        // margin-top: 60px;
        background-color: rgb(251, 231, 206);
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .address {
            margin-left: 25px;

            p:nth-child(1) {
                font-weight: 600;
                font-size: 30px;
            }

            p:nth-child(2) {
                font-weight: 600;
                font-size: 25px;
            }
        }

        .machine {
            margin-right: 25px;
            font-weight: 600;

            p:nth-child(1) {

                font-size: 30px;

            }

            p:nth-child(2) {
                font-size: 25px;
            }
        }

    }

    .middleBox {
        // background-color: pink;
        height: 400px;
        margin-top: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
            width: 100px;
            height: 100px;
        }

        p {
            margin-top: 20px;
            font-size: 30px;
            font-weight: 600;
        }

        .text {
            margin-top: 10px;
            font-size: 30px;
            color: rgb(198, 198, 198);
        }

        .shebei {
            font-size: 30px;
            color: rgb(198, 198, 198);
        }

        button {
            margin-top: 30px;
            border: none;
            width: 400px;
            height: 80px;
            border-radius: 30px;
            background-color: rgb(251, 83, 34);
            color: #fff;
            font-size: 30px;
        }
    }

    .bottomBox {
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: rgb(251, 231, 206);
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: space-between;

        .user {
            display: flex;
            align-items: center;
            // justify-content: space-around;
            // background-color: aquamarine;
            width: 55%;
            height: 120px;
            font-size: 32px;
            margin-left: 20px;

            img {
                width: 75px;
                height: 75px;
                margin-right: 0px;
                border-radius: 50%;
                vertical-align: middle;
            }

            .info {
                margin-left: 15px;
            }

            .copy {
                display: flex;

                button {
                    margin-left: 10px;
                    font-size: 20px;
                    width: 120px;
                    height: 46px;
                    border: none;
                    border-radius: 30px;
                    background-color: rgb(251, 240, 238);
                    color: rgb(251, 83, 34);
                }
            }


        }

        .coins {
            line-height: 120px;
            margin-right: 50px;
            font-size: 35px;
        }

    }

}
</style>