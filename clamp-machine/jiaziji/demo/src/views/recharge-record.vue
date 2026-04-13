<template>
    <div class="rechargeRecord">
        <van-nav-bar title="充值记录" left-text="返回" left-arrow @click-left="onClickLeft">
            <template #right>
                <van-icon name="wap-home-o" size="0.44rem" @click="goHome" />
            </template>
        </van-nav-bar>
        <div class="item" v-for="(item, index) in rechargeList" :key="index">
            <van-cell-group inset>
                <van-cell title="充值方式" :value="item.rechargeDataSource == 0 ? '充值投币' : '线上投币'" />
                <van-cell title="商户单号" v-if="item.channelTradeNo != null" :value="item.channelTradeNo" />
                <van-cell title="充值金额" :value="'￥' + item.fee" />
                <van-cell title="获得" :value="item.coinsGet + '币'" />
                <van-cell title="充值前" :value="item.coinsBefore + '币'" />
                <van-cell title="充值后" v-if="item.rechargeDataSource == 0" :value="item.coinsGet + item.coinsBefore + '币'" />
                <van-cell title="充值时间" :value="item.createTime" />
            </van-cell-group>
        </div>
        <div class="footer" v-if="rechargeList.length == 0">暂无充值记录</div>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { v3PlayerRechargeAPI } from '../api/index'
import { ref, reactive, watch } from 'vue';
import { showToast, showConfirmDialog } from 'vant'
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const coinFee = ref()
const onClickLeft = () => history.back(-1);
const goHome = () => {
    router.push({
        path: '/home/index'
    })
}
// console.log(route.params);
coinFee.value = Number(route.params.coinFee)
const rechargeList = ref([])
// 页面创建时加载充值记录数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerRechargeAPI({
        pageSize: 1000, //分页大小
        currentPage: 1,  //当前页码
        kw: '',  //搜索关键字
        isDeleted: 0, //是否已被删除
        status: -1  //状态
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data.data);
            for (let i = 0; i < res.data.data.length; i++) {
                res.data.data[i].fee = toDecimal(res.data.data[i].fee / 100);
                res.data.data[i].coinsGet = Math.floor(res.data.data[i].coinsGet / coinFee.value);  //取整
                res.data.data[i].coinsBefore = Math.floor(res.data.data[i].coinsBefore / coinFee.value);
            }
            rechargeList.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });
}
getPost()
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
        if (newurlStr == 'rechargeRecord') {
            coinFee.value = Number(route.params.coinFee)
            getPost()
        }
    },
    { immediate: true }
)

</script>
<style scoped lang="less">
.item {
    margin: 20px 0
}

.footer {
    padding: 0.82rem;
    text-align: center;
    color: #888;
    font-size: 0.32rem;
}
</style>
  
  