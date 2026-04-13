<template>
    <div class="testCoin">
        <div class="btn">
            <div class="mach">设备编号：{{ starterMachineId }}</div>
            <div class="btn-on" @click="onBtn()">
                <p class="ceshi">测试出币</p>
            </div>
        </div>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
  
<script setup>
import { ref, onMounted, watch } from 'vue';
import { OnlineCoinInTestAPI, GetTestMachineCoinsAPI } from '../api/index'
import { useRoute, useRouter } from "vue-router"
import { showToast, showConfirmDialog } from 'vant'
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const machineId = ref('');
const extId = ref('');
let coins = ref(0);
const starterMachineId = ref('')
starterMachineId.value = localStorage.getItem('shop_starterMachineId')
extId.value = localStorage.getItem('extId')
// 获取剩余测试币数：
const getCoins = async () => {
    showLoading.value = true;
    await GetTestMachineCoinsAPI({
        machineId: starterMachineId.value.substring(4)
    }).then((res) => {
        // console.log(res.data);
        showLoading.value = false;
        if (res.data.code == 200) {
            coins.value = res.data.data;
        } else {
            coins.value = 0;
        }
    }).catch((error) => {
        showLoading.value = false;

    })
}
// 测试投币：
const onBtn = async () => {
    // if (coins.value < 1) {
    //     showToast("币数已用完，投币失败");
    //     return;
    // }
    showLoading.value = true;
    await OnlineCoinInTestAPI({
        extId: extId.value,
        machineId: starterMachineId.value.substring(4),
        qty: 1
    }).then((res) => {
        // console.log(res.data);
        showLoading.value = false;
        if (res.data.code == 200) {
            coins.value -= 1;
            showToast(`投1币成功`);
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    })
};
// onMounted(() => {
//     // 调用方法
//     getCoins();
// })
</script>
  
  
<style scoped lang="less">
.btn {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -80%);

    .mach {
        font-size: 38px;
        text-align: center;
        padding-bottom: 20px;
    }

    .btn-on {
        width: 340px;
        height: 340px;
        border-radius: 50%;
        margin: 0 auto;
        background: url(../assets/btn-img.png) no-repeat;
        background-size: 100% 100%;
        color: #fff;
        text-align: center;
        font-size: 38px;

        .ceshi {
            font-size: 40px;
            padding-top: 105px;
        }

        p {
            margin: 8px;
        }
    }
}
</style>
  