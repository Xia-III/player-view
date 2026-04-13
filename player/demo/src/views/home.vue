<template>
    <div class="main">
        <div class="middle">
            <router-view></router-view>
        </div>
        <van-tabbar v-model="active" @change="onChange" route class="tabbar">
            <van-tabbar-item replace to="/home/index" icon="wap-home">首页</van-tabbar-item>
            <van-tabbar-item replace to="/home/recharge" v-if="rechargeConfigList.length > 0 && isNewPage === false">
                <p :class="isrecharge == true ? 'recharge' : 'active-dynamic recharge'">点击充值</p>
                <template #icon>
                    <div class="recharges">
                        <img src="../static/img/inTecharge.png" alt="">
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item replace @click="btnBind" v-if="isNewPage === true">
                <p :class="isrecharge == true ? 'recharge' : 'active-dynamic recharge'">扫一扫</p>
                <template #icon>
                    <div class="scanCodes">
                        <img src="../static/img/sao.png" alt="">
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item replace to="/home/account" icon="manager">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { v3PlayerRechargeConfigListAPI, JsApiConfigAPI, v3PlayerProfileAPI } from '../api/index'
import wx from 'weixin-js-sdk'

const router = useRouter()
const route = useRoute()
const isrecharge = ref(false)
const active = ref(0)
const showLoading = ref(false)
const onChange = (value) => {
    if (value == 1) {
        isrecharge.value = true
    } else {
        isrecharge.value = false
    }
}
const rechargeConfigList = ref([])
// 页面创建时加载充值套餐数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data.data);
            rechargeConfigList.value = res.data.data
            console.log(rechargeConfigList.value, 11111);
            if (rechargeConfigList.value === null) {
                rechargeConfigList.value = [];
            }
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });

}
getPost()

// 判断是否为新页面
const isNewPage = ref(false)
// 页面创建时加载玩家数据：
const getData = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data.data);
            isNewPage.value = res.data.data.isNewPage
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}
getData()


// 扫一扫
const btnBind = () => {
    scanCode();
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
const scanCode = async () => {//页面点击扫码按钮
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
            // alert(res)
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
.tabbar {

    // position: relative;
    .recharges {
        img {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
            z-index: 999;
        }
    }

    .scanCodes {
        img {
            width: 1rem;
            height: 1rem;
            // margin-bottom: 10px;
            z-index: 999;
        }
    }


    .recharge {
        position: absolute;
        top: -80px;
        left: 41.5%;
        background-color: #008ffe;
        padding: 15px;
        color: #fff;
        border-radius: 10px;
    }

    .recharge::after {
        content: '';
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        width: 0px;
        height: 0px;
        border: 20px solid transparent;
        border-top: 20px solid #008ffe;
    }

    .active-dynamic {
        animation-iteration-count: infinite;
        animation-name: pulse;
        animation-duration: 1.5s;
        animation-fill-mode: both;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.5)
        }

        50% {
            transform: scale(1)
        }

        100% {
            transform: scale(0.5)
        }
    }

}
</style>