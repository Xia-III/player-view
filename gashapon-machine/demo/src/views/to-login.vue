<template>
    <div class="toLogin">
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { v3PlayerProfileAPI } from '../api/index'
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
sessionStorage.setItem('shopMode', 0);
if (localStorage.getItem('shop_sFee') && localStorage.getItem('shop_sFee') !== null && localStorage.getItem('shop_sFee') !== undefined && localStorage.getItem('shop_sFee') !== '' && localStorage.getItem('shop_sFee') > 0) {
    router.push({
        path: '/homeView'
    })
} else {
    router.push({
        path: '/home/index'
    })
}
// router.replace({
//     path: '/home'
// });

</script>
<style scoped lang="less"></style>