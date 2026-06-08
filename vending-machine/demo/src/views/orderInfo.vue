<template>
    <!-- <van-nav-bar title="订单详情" /> -->
    <div class="orderInfo" v-if="!errorMessage">
        <van-cell-group inset title="订单信息">
            <van-cell title="订单编号" :label="orderData.orderId" />
            <van-cell title="机器编号" :value="orderData.machineId" />
            <van-cell title="场地名称" :value="orderData.addressName" />
            <van-cell title="取货序号" :value="orderData.deviceOrderSeq" />
            <van-cell title="订单金额" :value="'¥' + totalFee" value-class="price-red" />
        </van-cell-group>

        <div class="section-title">商品明细</div>
        <div class="goods-list">
            <div class="goods-item" v-for="(line, index) in orderData.lines" :key="index">
                <img class="goods-pic" :src="picBaseUrl + line.picUrl" :alt="line.goodsName" />
                <div class="goods-info">
                    <p class="goods-name">{{ line.goodsName }}</p>
                    <p class="goods-price">¥{{ (line.unitPriceFen / 100).toFixed(2) }}</p>
                    <p class="goods-qty">数量：{{ line.buyQty }}</p>
                </div>
                <div class="goods-amount">
                    <span>¥{{ ((line.unitPriceFen * line.buyQty) / 100).toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <div class="footer" v-if="!orderData.lines || orderData.lines.length == 0">暂无商品信息</div>
    </div>
    <div class="bottom-btn" v-if="!errorMessage">
        <van-button type="danger" block round size="large" @click="onPay">
            立即支付（¥{{ totalFee }}）
        </van-button>
    </div>
    <div class="error-page" v-else>
        <van-icon name="warning-o" size="0.8rem" color="#ee0a24" />
        <p class="error-text">{{ errorMessage }}</p>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { VendingQrOrderInfoAPI, v3AuthPlayerAuthAPI, v3PlayerPlaceOrderAPI } from '../api/index'
import { ref, computed, onMounted } from 'vue';
import { showToast } from 'vant'
import { useRoute, useRouter } from "vue-router"
import { setStorageExpire, getStorageExpire } from '../utils/storage'
import ap from '../utils/alipayjsapi.min.js'
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const orderData = ref({ lines: [] })
const errorMessage = ref('')
const picBaseUrl = 'https://www.huanxizn.com/'
const APPID = "wx7f23f819116cc247"

const getUrlParam = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

// 登录后调起支付
const placeOrder = async () => {
    showLoading.value = true;
    await v3PlayerPlaceOrderAPI({
        orderId: orderData.value.orderId,
        frontUrl: "https://www.huanxizn.com/newadmin/#/login"
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            const payUrl = res.data.data
            if (payUrl) {
                window.location.href = payUrl
            } else {
                showToast('支付成功')
            }
        } else {
            showToast(res.data.message || '支付失败')
        }
    }).catch((error) => {
        showLoading.value = false;
        showToast('支付失败，请重试')
    });
}

// 登录成功后的回调：登录 + 支付
const loginAndPay = async (code) => {
    showLoading.value = true;
    const machineId = orderData.value.machineId || ''
    await v3AuthPlayerAuthAPI({
        code: code,
        machineId: machineId
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            localStorage.setItem('shop_heardTokenStarter', res.data.data);
            setStorageExpire('shop_tokenStarter', res.data.data, 1440);
            placeOrder()
        } else {
            showToast(res.data.message || '登录失败');
        }
    }).catch((error) => {
        showLoading.value = false;
        showToast('登录失败，请重试');
    });
}

// 微信授权
const wxGetCodeForPay = () => {
    let code = getUrlParam('code');
    const local = window.location.href;
    if (code == null || code === '') {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
            '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
    } else {
        loginAndPay(code)
    }
}

// 支付宝授权
const apGetCodeForPay = () => {
    ap.getAuthCode({
        appId: '2021004118610049',
        scopes: ['auth_user']
    }, (res) => {
        if (res.error == 11) {
            showToast(res.errorMessage);
        } else {
            loginAndPay(res.authCode);
        }
    })
}

// 点击立即支付
const onPay = () => {
    const token = getStorageExpire('shop_tokenStarter')
    if (token) {
        placeOrder()
    } else {
        const ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            wxGetCodeForPay()
        } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
            apGetCodeForPay()
        } else {
            showToast("请用支付宝或者微信打开本页面")
        }
    }
}

const totalFee = computed(() => {
    return (orderData.value.totalFeeFen / 100).toFixed(2)
})

const getOrderInfo = async () => {
    showLoading.value = true;
    await VendingQrOrderInfoAPI({
        orderId: route.query.orderId
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            orderData.value = res.data.data
            // 本地没有机器编号则存储
            const storedMachineId = localStorage.getItem('shop_starterMachineId')
            if (!storedMachineId || storedMachineId == 'null') {
                localStorage.setItem('shop_starterMachineId', res.data.data.machineId)
            }
        } else {
            errorMessage.value = res.data.message || '获取订单信息失败';
        }
    }).catch((error) => {
        showLoading.value = false;
        errorMessage.value = '网络错误，获取订单信息失败';
    });
}
getOrderInfo()

// 页面加载时检测微信OAuth回调（code参数）
onMounted(() => {
    const code = getUrlParam('code')
    if (code && !getStorageExpire('shop_tokenStarter')) {
        loginAndPay(code)
    }
})
</script>
<style scoped lang="less">
.section-title {
    padding: 0.32rem 0.32rem 0.16rem;
    font-size: 0.36rem;
    font-weight: bold;
    color: #666;
}

.goods-list {
    padding: 0 0.16rem;
}

.goods-item {
    display: flex;
    align-items: center;
    padding: 0.24rem 0.16rem;
    margin-bottom: 0.16rem;
    background: #fff;
    border-radius: 0.12rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.goods-pic {
    width: 1.44rem;
    height: 1.44rem;
    object-fit: cover;
    border-radius: 0.08rem;
    flex-shrink: 0;
}

.goods-info {
    flex: 1;
    padding: 0 0.24rem;
    min-width: 0;
}

.goods-name {
    font-size: 0.34rem;
    font-weight: bold;
    color: #333;
    margin: 0 0 0.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.goods-price {
    font-size: 0.29rem;
    color: #999;
    margin: 0 0 0.06rem;
}

.goods-qty {
    font-size: 0.29rem;
    color: #999;
    margin: 0;
}

.goods-amount {
    font-size: 0.34rem;
    font-weight: bold;
    color: #f60;
    flex-shrink: 0;
}

.footer {
    padding: 0.82rem;
    text-align: center;
    color: #888;
    font-size: 0.32rem;
}

.bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.24rem 0.32rem;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

.orderInfo {
    padding-bottom: 1.6rem;
}

.error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 2rem;
}

.error-text {
    margin-top: 0.3rem;
    font-size: 0.3rem;
    color: #666;
}
</style>
<style>
.price-red {
    color: #ee0a24 !important;
    font-weight: bold;
}
</style>
