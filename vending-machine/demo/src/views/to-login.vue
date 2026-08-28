<template>
    <div class="toLogin">
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { MachineBizTypeAPI } from '../api/index'
import { ref } from 'vue';
import { useRouter } from "vue-router"
import { showToast } from 'vant'
const router = useRouter()
const showLoading = ref(false)
sessionStorage.setItem('shopMode', 0);

// 读取机器ID（去掉前4位前缀，与登录接口传参格式保持一致）
const getMachineId = () => {
    const storedMachineId = localStorage.getItem('shop_starterMachineId')
    return storedMachineId ? storedMachineId.substring(4) : ''
}

// 登录后查询机器业务类型，根据 isLease 决定跳转
const checkMachineBizType = async () => {
    const machineId = getMachineId()
    showLoading.value = true;
    await MachineBizTypeAPI({ machineId }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            const data = res.data.data
            if (data.isLease === true) {
                // 有线上业务，正常进入首页
                router.replace({ path: '/home' })
            } else {
                // 无线上业务，跳转提示页
                router.replace({
                    path: '/noBiz',
                    query: {
                        name: data.name,
                        machineId: data.machineId
                    }
                })
            }
        } else {
            showToast(res.data.message);
            router.replace({ path: '/home' })
        }
    }).catch((error) => {
        showLoading.value = false;
        router.replace({ path: '/home' })
    });
}
checkMachineBizType()

</script>
<style scoped lang="less"></style>
  
  