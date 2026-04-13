<template>
    <van-nav-bar title="场地列表" left-text="返回" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="addressShop">
        <div class="item" v-for="(item, index) in addressIdList" :key="index">
            <div>
                <p>{{ item.addressName }}</p>
                <p>币：{{ item.coins }}</p>
                <p>赠送币：{{ item.coinsBind }}</p>
            </div>
            <van-button type="success" v-if="item.addressId != addressId"
                @click="activeMachine(item)">切换当前场地</van-button>
            <van-button type="default" v-if="item.addressId == addressId">当前场地</van-button>
        </div>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { v3PlayerCoinListAPI, v3PlayerChangeAddressAPI } from '../api/index'
import { ref, reactive, watch } from 'vue';
import { showToast, showConfirmDialog } from 'vant'
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const onClickLeft = () => history.back(-1);
const showLoading = ref(false)
// console.log(route.params);
const addressId = ref()
const coinFee = ref()
addressId.value = Number(route.params.addressId)
coinFee.value = Number(route.params.coinFee)
const addressIdList = ref([])
// 页面创建时加载场地金币详情/地址列表数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerCoinListAPI({
        pageSize: 100, //分页大小
        currentPage: 1,  //当前页码
        kw: '',  //搜索关键字
        isDeleted: 0, //是否已被删除
        status: -1  //状态
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data.data);
            for (let i = 0; i < res.data.data.length; i++) {
                res.data.data[i].coins = Math.floor(res.data.data[i].coins / coinFee.value);  //取整
                res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / coinFee.value);
            }
            addressIdList.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });
}
getPost()

// 手动切换当前场地：
const activeMachine = (item) => {
    if (item.addressId == addressId.value) {
        return;
    }
    showConfirmDialog({
        title: '温馨提示',
        message:
            '确定要切换<span style="color: rgb(7, 193, 96);">' + item.addressName + '</span>为当前场地？',
        allowHtml: true
    }).then(async () => {
        showLoading.value = true;
        await v3PlayerChangeAddressAPI({
            addressId: item.addressId
        }).then((res) => {
            showLoading.value = false;
            if (res.data.code == 200) {
                // console.log(res.data.data);
                showDialog({
                    title: '温馨提示',
                    message: '<span style="color: rgb(233, 70, 70);">要立即重新登录切换当前地址才能生效！</span>',
                    allowHtml: true
                }).then(() => {
                    location.href = `https://www.huanxizn.com/newGashapon/#/login/?machineId=null&extId=0`;
                });

            } else {
                showToast(res.data.message);
            }
        }).catch((error) => {
            showLoading.value = false;

        });

    }).catch(() => {
        // on cancel
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
        if (newurlStr == 'addressShop') {
            getPost()
        }
    },
    { immediate: true }
)

</script>
<style scoped lang="less">
.addressShop {
    .item {
        position: relative;
        background-color: #fff;
        border-radius: 15px;
        margin: 30px;
        display: flex;
        justify-content: space-between;
        padding: 30px;
        font-size: 36px;

        .van-button {
            position: absolute;
            right: 30px;
            top: 50px;
            height: 80px;
            font-size: 30px;
            border-radius: 50px;
        }
    }
}
</style>