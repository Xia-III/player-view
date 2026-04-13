<template>
    <div class="top">
        <div class="portrait">
            <img :src="playerProfile.avatar" alt="">
        </div>
        <ul class="list">
            <li>{{ playerProfile.nickname }}</li>
            <li>会员编号：<span>{{ playerProfile.playerId }}</span></li>
            <li>余额：{{ Math.floor(playerProfile.coinsTotal1 / 100) }}</li>
            <li>总币数：{{ Math.floor(playerProfile.coinsBindTotal1 / playerProfile.coinFee) }}</li>
            <li>当前地址：{{ playerProfile.addressName }}</li>
        </ul>
    </div>
    <div>
        <van-cell title="币详情" size="large" value="可切换当前场地" @click="toAddress()" is-link>
            <template #icon>
                <div>
                    <van-icon :style="{ color: 'red', fontSize: '26px', marginRight: '10px' }" name="shop-collect" />
                </div>
            </template>
        </van-cell>
        <van-cell title="充值记录" size="large" is-link @click="toRechargeRecord">
            <template #icon>
                <div>
                    <van-icon :style="{ color: 'red', fontSize: '24px', marginRight: '10px' }" name="after-sale" />
                </div>
            </template>
        </van-cell>
        <!-- <van-cell icon="shop-o" size="large" title="积分兑换" is-link arrow-direction="down" value="内容" /> -->
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { v3PlayerProfileAPI } from '../api/index'
import { ref, reactive, watch } from 'vue';
import { showToast, showConfirmDialog } from 'vant'
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const playerProfile = ref({})
// 页面创建时加载场地分类数据和设备类型数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data.data);
            playerProfile.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}
getPost()
// 前往币详情：
const toAddress = () => {
    if (playerProfile.value.coinFee == undefined || playerProfile.value.coinFee == "undefined") {
        playerProfile.value.coinFee = 100;
    }
    router.push({
        name: 'addressShop',
        params: {
            addressId: playerProfile.value.addressId,
            coinFee: playerProfile.value.coinFee
        }
    });
}
// 前往充值记录：
const toRechargeRecord = () => {
    if (playerProfile.value.coinFee == undefined || playerProfile.value.coinFee == "undefined") {
        playerProfile.value.coinFee = 100;
    }
    router.push({
        name: 'rechargeRecord',
        params: {
            coinFee: playerProfile.value.coinFee
        }
    });
}

const urlStr = ref('')
urlStr.value = location.href
let index = urlStr.value.lastIndexOf('\/');
urlStr.value = urlStr.value.substring(index + 1, urlStr.value.length);
watch(        //监测路由id的变化
    () => urlStr.value,
    (newurlStr) => {
        // console.log(newurlStr);
        if (newurlStr == 'account') {
            getPost()
        }
    },
    { immediate: true }
)
</script>
<style scoped lang="less">
.top {
    display: flex;
    padding: 15px;
    background-color: #fff;

    .portrait {
        img {
            width: 150px;
            height: 150px;
            border-radius: 15px;
            margin: 20px;
        }
    }

    .list {
        li {
            font-size: 26px;
            color: #757575;

            span {
                color: #07c160;
            }
        }

        >li:first-child {
            font-size: 50px;
            color: #1989fa;
        }
    }
}
</style>