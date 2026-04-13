<template>
    <div class="recharge">
        <!-- 列表 -->
        <div class="center">
            <div class="col">
                <van-row class="col-list" v-for="(item, index) of rechargeConfigList" :key="index"
                    @click="onshowShop(item)">
                    <van-col span="12">{{ item.fee }}元</van-col>
                    <van-col class="coins-bind" span="12">
                        <p>{{ item.coins }}币</p>
                        <p>赠送{{ item.coinsBind }}币</p>
                    </van-col>
                </van-row>
            </div>
            <div class="combo" v-if="rechargeConfigList.length <= 0">暂无充值套餐</div>
        </div>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { v3PlayerRechargeConfigListAPI, v3PlayerPlaceOrderAPI } from '../api/index'
import { ref, reactive, watch } from 'vue';
import { showToast, showConfirmDialog } from 'vant'
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const extId = ref()
extId.value = localStorage.getItem('sExtId');
const rechargeConfigList = ref([])
if (extId.value == null || extId.value == undefined || extId.value == '') {
    extId.value = 0
}
// 页面创建时加载充值套餐数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data.data);
            if (res.data.data) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].fee = toDecimal(res.data.data[i].fee / 100);
                    res.data.data[i].coins = Math.floor(res.data.data[i].coins / 100);  //取整
                    res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / 100);
                }
                rechargeConfigList.value = res.data.data
            } else {
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

// 点击充值：
const onshowShop = async (item) => {
    showLoading.value = true;
    if (extId.value == null || extId.value == undefined || extId.value == '') {
        extId.value = 0
    }
    await v3PlayerPlaceOrderAPI({
        rechargeConfigId: item.rechargeConfigId,  //ID
        rechargeType: 0,  //充值币
        extMode: extId.value,  //充值分支号
        rechargeDataSource: 0, //0默认充值  1及充启动
        frontUrl: 'https://www.huanxizn.com/newSinger/#/home/index' //支付完成后，前端跳转地址
    }).then((res) => {
        showLoading.value = false;
        console.log(res.data);
        if (res.data.code == 200) {
            // console.log(res.data);
            location.href = res.data.data;

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });

}


//制保留2位小数，如：2，会在2后面补上00.即2.00 
const toDecimal = (x) => {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}
const urlStr = ref('')
urlStr.value = location.href
let index = urlStr.value.lastIndexOf('\/');
urlStr.value = urlStr.value.substring(index + 1, urlStr.value.length);
watch(        //监测路由id的变化
    () => urlStr.value,
    (newurlStr) => {
        // console.log(newurlStr);
        if (newurlStr == 'recharge') {
            extId.value = localStorage.getItem('sExtId');
            getPost()
        }
    },
    { immediate: true }
)
</script>
<style scoped lang="less">
// 列表
.center {
    padding: 0.4rem 0.3rem;

    .col {
        padding: 0.1rem 0.2rem;

        .col-list {
            background: url(../static/img/coins6-1.png) no-repeat;
            background-size: 100% 100%;
            border-radius: 20px;
            // background-size: 100% 100%;
            text-align: center;
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-top: 0.45rem;
            font-size: 45px;
            padding: 0.2rem 0.16rem;
            color: #ffffff;
            font-weight: 900;

            .coins-bind {
                color: #474747;
            }
        }
    }

    .combo {
        text-align: center;
        color: #999;
        font-size: 40px;
    }
}
</style>