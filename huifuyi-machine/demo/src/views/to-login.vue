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
const agencyId = route.query.agencyId || ''
sessionStorage.setItem('shopMode', 0);
if (agencyId) {
    sessionStorage.setItem('agencyId', agencyId);
}
router.replace({
    path: '/home',
    query: agencyId ? { agencyId } : undefined
});

</script>
<style scoped lang="less"></style>
  
  