<template>
    <div class="complain-page">
        <van-nav-bar title="投诉列表" left-text="返回" left-arrow @click-left="onBack" />

        <div class="summary">投诉总数：{{ arrList.length }}条</div>

        <!-- 输入框 -->
        <div class="input-area">
            <van-field v-model="newContent" placeholder="请输入您的投诉内容" type="textarea" rows="2" autosize border />
            <van-button type="primary" block @click="submitComplain" :disabled="!newContent.trim()">
                发布投诉
            </van-button>
        </div>

        <!-- 投诉列表 -->
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多"
                @load="getPost">
                <div v-for="(item, index) in arrList" :key="index" class="complain-item">
                    <div class="content"><span>投诉内容：</span>{{ item.content }}</div>
                    <div class="time">{{ item.creationTime }}</div>
                </div>
            </van-list>
        </van-pull-refresh>
        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import {
    GetComplaintMessagePageListAPI, SaveComplaintMessageAPI
} from '../api/index'
const router = useRouter()
const route = useRoute()

const totalPage = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const showLoading = ref(false)
const addressId = ref(1)
const machineId = ref()
addressId.value = route.query.addressId
machineId.value = route.query.machineId



const onBack = () => router.back()
const arrList = ref([])
const getPost = async () => {
    if (refreshing.value) {
        arrList.value = []
        refreshing.value = false;
    }
    if (finished.value == false && loading.value == false) {
        loading.value = true
        await GetComplaintMessagePageListAPI({
            pageSize: pageSize.value,
            currentPage: currentPage.value,
            kw: "",
            isDeleted: 0,
            status: 0
        }).then((res) => {
            loading.value = false;
            if (res.data.code == 200) {
                console.log(res.data, "asds");
                totalPage.value = res.data.totalCount;
                let moremachinesList = ref([])
                moremachinesList.value = res.data.data
                arrList.value = [...arrList.value, ...moremachinesList.value]
                currentPage.value++;
                if (currentPage.value > Math.ceil(totalPage.value / pageSize.value)) {
                    finished.value = true;
                }
            } else {
                finished.value = true;
            }
        }).catch((error) => {
            loading.value = false;
            finished.value = true;
        })
    }

}

getPost()

// 新投诉输入
const newContent = ref('')
// 发布投诉
const submitComplain = async () => {
    const content = newContent.value.trim()
    showLoading.value = true;
    await SaveComplaintMessageAPI({
        addressId: addressId.value,
        machineId: machineId.value,
        content: content
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            newContent.value = ''
            onRefresh()
            showToast('投诉已提交')

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    })
}

const onRefresh = () => {
    arrList.value = []
    refreshing.value = true;
    totalPage.value = 0;
    currentPage.value = 1;
    finished.value = false;
    getPost()
}


</script>

<style scoped lang="less">
.complain-page {
    background: #f6f6f6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.summary {
    padding: 12px 16px;
    background: #fff7e3;
    font-size: 25px;
    color: #333;
}

.input-area {
    background: #fff;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.complain-item {
    background: #fff;
    margin: 10px 12px;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    font-size: 28px;
    color: #333;
}

.content {
    margin-bottom: 6px;

    span {
        font-weight: 600;
    }
}

.time {
    font-size: 23px;
    color: #999;
    text-align: right;
}
</style>