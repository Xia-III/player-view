<template>
    <div class="no-biz">
        <div class="topBox">
            <div class="machine">
                <p>
                    {{ name }}
                </p>
                <p>
                    机器ID: {{ machineId }}
                </p>
            </div>
        </div>
        <div class="middleBox">
            <img src="../assets/shebei.png" alt="">
            <p>该机器暂无线上业务</p>
            <div class="text">
                请尝试扫描其他机器的二维码
            </div>
            <button @click="onClick">扫一扫</button>
        </div>
        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { JsApiConfigAPI } from '../api/index'
import { showToast } from 'vant'
import wx from 'weixin-js-sdk'

const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const name = ref('')
const machineId = ref('')
name.value = route.query.name || ''
machineId.value = route.query.machineId || ''

// 微信扫一扫配置
const wxConfig = (_appid, _timestamp, _nonceStr, _signature) => {
    wx.config({
        debug: false,
        appId: _appid,
        timestamp: _timestamp,
        nonceStr: _nonceStr,
        signature: _signature,
        jsApiList: [
            'checkJsApi',
            'scanQRCode',// 微信扫一扫接口
            'openCard'
        ]
    });
    wx.error((res) => {
        alert("出错了：" + res.errMsg);
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
const getCode = ref('')
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
            isLoading.value = false; // 请求完成后将标志位还原
            if (res.data.code == 200) { // res 返回的签名等数据
                wxConfig(res.data.data.appId, res.data.data.timestamp, res.data.data.nonceStr, res.data.data.signature);
                /* 处理失败验证 */
                wx.error((res) => {
                    alert('配置验证失败: ' + res.errMsg);
                });
                wx.scanQRCode({
                    desc: 'scanQRCode desc',
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode"], // 扫二维码
                    success: (res) => {
                        let urlParams = getUrlParams(res.resultStr);
                        getCode.value = urlParams["machineId"];

                        machines.value = getCode.value
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
.no-biz {
    .topBox {
        background-color: rgb(251, 231, 206);
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .machine {
            margin-right: 25px;
            font-weight: 600;
            text-align: right;

            p:nth-child(1) {
                font-size: 30px;
            }

            p:nth-child(2) {
                font-size: 25px;
            }
        }
    }

    .middleBox {
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
}
</style>
