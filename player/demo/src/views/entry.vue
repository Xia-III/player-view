<template>
    <div class="test">
        <van-popup v-model:show="showLoading" style="background: none;" :overlay="false" class="van-popup-load">
            <van-loading size="24px" color="#1989fa" vertical>加载中...</van-loading>
        </van-popup>
    </div>
</template>
<script setup>
import { v3AuthScanQRCodeAPI } from '../api/index'
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { showToast, showConfirmDialog } from 'vant'
import { getStorageExpire } from '../utils/storage'
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const urlParams = ref([]);
const extId = ref('');
const fee = ref('');

const starterMachineId = ref('')
const flag = ref(null)
const machines = ref(null)
machines.value = route.query.machines
flag.value = route.query.flag
const getDataFee = async () => {
    urlParams.value = getUrlParams();
    if (urlParams.value["machineId"] == '' || urlParams.value["machineId"] == undefined || urlParams.value["machineId"] == null) {



        if (localStorage.getItem('shop_starterMachineId') == '' || localStorage.getItem('shop_starterMachineId') == undefined || localStorage.getItem('shop_starterMachineId') == null) {
            showToast('暂无设备记录，请先扫描机器二维码');
        } else {
            starterMachineId.value = localStorage.getItem('shop_starterMachineId')
            extId.value = localStorage.getItem('extId')
            fee.value = localStorage.getItem('shop_sFee')
            console.log(fee.value);

        }

    } else {
        starterMachineId.value = urlParams.value["machineId"];
        extId.value = urlParams.value["extId"];
        fee.value = urlParams.value["fee"];
        localStorage.setItem('shop_starterMachineId', starterMachineId.value);
        localStorage.setItem('shop_sExtId', extId.value);
        localStorage.setItem('shop_sFee', fee.value);
        if (urlParams.value["fee"] == '' || urlParams.value["fee"] == undefined || urlParams.value["fee"] == null) {
            localStorage.setItem('shop_sFee', 0);
        }
    }

    if (flag.value) {
        starterMachineId.value = machines.value
        localStorage.setItem('shop_starterMachineId', starterMachineId.value);
        extId.value = urlParams.value["extId"];
        localStorage.setItem('shop_sExtId', extId.value);
        fee.value = urlParams.value["fee"];
        localStorage.setItem('shop_sFee', fee.value);
        if (urlParams.value["fee"] == '' || urlParams.value["fee"] == undefined || urlParams.value["fee"] == null) {
            localStorage.setItem('shop_sFee', 0);
        }
    }
    showLoading.value = true;
    await v3AuthScanQRCodeAPI({
        machineId: starterMachineId.value.substring(4)
    }).then((res) => {
        showLoading.value = false;
        console.log(res.data, "跳转页面");
        if (res.data.code == 200) {
            window.location.href = res.data.data + '/index.html#/login'
            // router.push({
            //     path: '/login'
            // })
            console.log('进入投币页面');
        } else if (res.data.code == 201) {
            console.log('进入测试页面');
            window.location.href = res.data.data + '/index.html#/testCoin'
            // router.push({
            //     path: '/testCoin'
            // })
        } else if (res.data.code == 202) {
            showToast('该场地已被禁用，请联系工作人员');
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;
    });
}

const getUrlParams = () => {
    let url = location.href; //获取url中"?"符后的字串 
    // console.log(url);
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
};
getUrlParams()
// console.log(getUrlParams());
onMounted(() => {
    // 调用方法
    getDataFee();
})
</script>
<style scoped lang="less"></style>