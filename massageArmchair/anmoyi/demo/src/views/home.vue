<template>
    <div class="main">
        <div class="middle">
            <router-view></router-view>
        </div>
        <van-tabbar v-model="active" @change="onChange" route class="tabbar">
            <van-tabbar-item replace to="/home/index" icon="wap-home">首页</van-tabbar-item>
            <!-- <van-tabbar-item replace to="/home/recharge">
                <p :class="isrecharge == true ? 'recharge' : 'active-dynamic recharge'">点击充值</p>
                <template #icon>
                    <div>
                        <img src="../static/img/inTecharge.png" alt="">
                    </div>
                </template>
            </van-tabbar-item> -->
            <van-tabbar-item replace to="/home/account" icon="manager">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
const isrecharge = ref(false)
const active = ref(0)
const onChange = (value) => {
    if (value == 1) {
        isrecharge.value = true
    } else {
        isrecharge.value = false
    }
}

</script>
  
  
<style scoped lang="less">
.tabbar {

    // position: relative;
    img {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
        z-index: 999;
    }

    .recharge {
        position: absolute;
        top: -80px;
        left: 41.5%;
        background-color: rgb(252, 121, 88);
        padding: 15px;
        color: #fff;
        border-radius: 10px;
    }

    .recharge::after {
        content: '';
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        width: 0px;
        height: 0px;
        border: 20px solid transparent;
        border-top: 20px solid rgb(252, 121, 88);
    }

    .active-dynamic {
        animation-iteration-count: infinite;
        animation-name: pulse;
        animation-duration: 1.5s;
        animation-fill-mode: both;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.5)
        }

        50% {
            transform: scale(1)
        }

        100% {
            transform: scale(0.5)
        }
    }

}


// img:after {
//     content: "点击充值";
//     background-color: yellow;
//     color: red;
//     font-weight: bold;
//     position: absolute;
//     left: 20px;
//     top: 100px
// }
</style>
  