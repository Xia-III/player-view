<template>
    <div class="coinSucess">
        <div class="main">

            <div class="bug">
                <div class="box">
                    <div>
                        <span> 购买游戏币</span>
                        <span style="color: brown;">1个</span>
                    </div>
                    <p>已安排出币，请留意取币口，有异常请联系机台客服</p>
                </div>


            </div>
            <div class="bottomBox">
                <div>
                    <span>ID:{{ machineId }}</span>

                </div>
            </div>

        </div>
        <div class="buyCoins">
            <div @click="toKefu">
                <img src="../assets/ke.png" alt="">
                <p>客服</p>
            </div>
            <div @click="buys">再次买币</div>
        </div>
        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import {
    v3PlayerProfileAPI
} from '../api/index'
const router = useRouter()
const route = useRoute()
const avatar = ref(null)
const nickname = ref(null)
const playerId = ref(null)
const coinFee = ref(null)
const coins = ref(null)
const coinsBind = ref(null)
const addressId = ref(null)
const machineId = ref(null)
const remark = ref(null)
const addressName = ref(null)
const payCtrlMode = ref(null)
const agencyId = ref(null)
const name = ref('')
const servicePhone = ref('')
const showLoading = ref(false)
// 页面创建时加载玩家数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data.data);
            avatar.value = res.data.data.avatar
            nickname.value = res.data.data.nickname
            playerId.value = res.data.data.playerId
            coinFee.value = res.data.data.coinFee
            coins.value = Math.floor(res.data.data.coins / res.data.data.coinFee)
            coinsBind.value = Math.floor(res.data.data.coinsBind / res.data.data.coinFee)
            addressId.value = res.data.data.addressId
            machineId.value = res.data.data.machineId
            remark.value = res.data.data.remark
            addressName.value = res.data.data.addressName
            payCtrlMode.value = res.data.data.payCtrlMode
            agencyId.value = res.data.data.agencyId
            servicePhone.value = res.data.data.servicePhone
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}
getPost()
const toKefu = () => {
    location.href = 'tel:' + servicePhone.value;
}

const buys = () => {
    router.push({
        path: '/home/index'
    })

}

const urlStr = ref('')
urlStr.value = location.href
let index = urlStr.value.lastIndexOf('\/');
urlStr.value = urlStr.value.substring(index + 1, urlStr.value.length);
watch(        //监测路由id的变化
    () => urlStr.value,
    (newurlStr) => {
        // console.log(newurlStr);
        if (newurlStr == 'coinSuccess') {
            getPost()
        }
    },
    { immediate: true }
)


</script>
  
  
<style scoped lang="less">
.coinSucess {
    // background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .main {
        margin-top: 50px;
        width: 580px;
        height: 500px;
        border: 10px solid rgb(57, 145, 251);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        // position: absolute;
        // top: 10%;
        // left: 50%;
        // transform: translate(-50%, -10%);
        .bug {
            width: 100%;
            height: 250px;
            // background-color: aquamarine;
            border-bottom: 10px dotted rgb(57, 145, 251);
            font-weight: 600;

            .box {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                // background-color: bisque;
                margin: 20px 0 0 20px;


                span:nth-child(1) {

                    font-size: 35px;
                    margin-right: 30px;
                }

                span:nth-child(2) {
                    font-size: 38px;

                }

                p {
                    margin-bottom: 20px;
                    font-size: 23px;
                    color: rgb(144, 144, 144);
                }
            }

        }

        .bottomBox {
            text-align: center;
            width: 100%;
            height: 220px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            color: rgb(207, 204, 204);

            span {
                font-size: 30px;
            }
        }
    }

    .buyCoins {
        width: 7.95rem;
        height: 100px;
        background-color: rgb(57, 145, 251);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        display: flex;


        div:nth-child(1) {
            font-size: 36px;
            // text-align: center;
            width: 2.4rem;
            height: 0.9rem;
            border-radius: 25px;
            // background-color: aquamarine;
            border: 3px solid #fff;
            margin: 10px 50px 0 70px;
            line-height: 0.9rem;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                line-height: 20px;

            }

            img {
                width: 50px;
                height: 50px;

            }
        }

        div:nth-child(2) {
            font-size: 36px;
            text-align: center;
            width: 3.4rem;
            height: 1rem;
            border-radius: 25px;
            background-color: rgb(254, 205, 51);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            margin-top: 10px;
            line-height: 1rem;
            color: rgb(132, 66, 4);
            font-weight: 600;
        }
    }
}
</style>