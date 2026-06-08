<template>
    <div class="toLogin">
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const showLoading = ref(true)
const agencyId = route.query.agencyId || ''
sessionStorage.setItem('shopMode', 0);
if (agencyId) {
    sessionStorage.setItem('agencyId', agencyId);
}
onMounted(() => {
    router.replace({
        path: '/home',
        query: agencyId ? { agencyId } : undefined
    });
});

</script>
<style scoped lang="less"></style>
  
  