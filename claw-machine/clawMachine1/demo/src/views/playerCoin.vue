<template>
    <div>
        <div class="main">
            <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                :key="item.coinInPlanId" @click="onInsertCoins(item, playerProfile)">
                <div class="coinPlan"
                    v-if="(coins >= item.coins && coins > 0) || (coinsBind >= item.coins && coinsBind > 0)">
                    <!-- <div>{{ item.fee }}元</div> -->
                    <div class='yuan'>{{ item.coins }}币</div>
                </div>
                <div class="coinPlan" v-if="coins < item.coins && coinsBind < item.coins">
                    <div>{{ toyuan(item.fee) }}元</div>
                    <div class='yuan'>{{ item.coins }}币</div>
                </div>
            </div>
            <div class="null" v-else>暂无投币套餐</div>
        </div>

    </div>

    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
</template>
<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import {
    v3PlayerProfileAPI, v3PlayerCoinInPlanAPI,
    v3PlayerMachineListAPI, v3PlayerCoinInAPI,
    v3PlayerPlaceOrderAPI
} from '../api/index'
const router = useRouter()
const route = useRoute()
const showLoading = ref(false)
const chooseMachine = ref('')
const nowmachineId = ref(null)
const extId = ref()
extId.value = localStorage.getItem('shop_sExtId');
if (extId.value == null || extId.value == 0 || extId.value == 'NaN' || extId.value == 'undefined') {
    extId.value = 0
}
const arrowicon = ref('arrow-down')

const avatar = ref(null)
const nickname = ref(null)
const playerId = ref(null)
const coinFee = ref(null)
const coins = ref(null)
const coinsBind = ref(null)
const addressId = ref(null)
const machineId = ref('')
const remark = ref(null)
const addressName = ref(null)
const payCtrlMode = ref(null)
const agencyId = ref(null)
const name = ref('')
const servicePhone = ref('')
console.log(route.query);

machineId.value = route.query.machineId
console.log(machineId.value);

// for (const key in route.query) {
//     if (route.query.hasOwnProperty(key)) {
//         concatenatedNumber += String(route.query[key]);
//     }
// }

// const machineId = ref(parseFloat(concatenatedNumber))
// console.log(machineId.value);

const toKefu = () => {
    location.href = 'tel:' + servicePhone.value;
}

// const playerProfile = ref({})
// 页面创建时加载玩家数据：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data.data);
            if (res.data.data.isOnLine == 0) {  //离线
                router.push({
                    path: '/hint'
                });
            }
            if (res.data.data.shopMode == 1) {
                sessionStorage.setItem('shopMode', 1);
                router.push({
                    path: '/hint'
                });
            } else {
                sessionStorage.setItem('shopMode', 0);
            }
            avatar.value = res.data.data.avatar
            nickname.value = res.data.data.nickname
            playerId.value = res.data.data.playerId
            coinFee.value = res.data.data.coinFee
            coins.value = Math.floor(res.data.data.coins / res.data.data.coinFee)
            coinsBind.value = Math.floor(res.data.data.coinsBind / res.data.data.coinFee)
            addressId.value = res.data.data.addressId
            // machineId.value = res.data.data.machineId
            remark.value = res.data.data.remark
            addressName.value = res.data.data.addressName
            payCtrlMode.value = res.data.data.payCtrlMode
            agencyId.value = res.data.data.agencyId
            servicePhone.value = res.data.data.servicePhone


            if (res.data.data.name) {
                name.value = res.data.data.name
            } else {
                name.value = "普通机器"
            }
            getCoinInPlan(res.data.data.addressId)
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}
getPost()

// 页面创建时加载投币列表数据：
const coinInPlanList = ref([])
const getCoinInPlan = async (addressId) => {
    showLoading.value = true;
    await v3PlayerCoinInPlanAPI({
        addressId: addressId
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            // console.log(res.data);
            coinInPlanList.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}

// 点击加载机器列表
const showBottom = ref(false)
const machineList = ref([])
const showchooseM = async () => {
    showLoading.value = true;
    await v3PlayerMachineListAPI({
        addressId: addressId.value
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data);
            machineList.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
    showBottom.value = true
    arrowicon.value = "arrow-up"
}
// 选择机器：
const checked = ref(0)
const changeCheck = (item) => {
    checked.value = item.machineId
    // console.log(item);
    showBottom.value = false
    name.value = item.name
    machineId.value = item.machineId
    arrowicon.value = "arrow-down"
}
// 投币：
const onInsertCoins = (item) => {
    // console.log(item);
    if (machineId == null) {
        showToast('请先选择要投币的机器');
        return false;
    }
    console.log(machineId.value);

    showConfirmDialog({
        title: '温馨提示',
        message:
            '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '</span>前</span>',
        allowHtml: true
    })
        .then(async () => {
            // on confirm
            // console.log(coins.value);
            if ((coins.value >= item.coins && coins.value > 0) || (coinsBind.value >= item.coins && coinsBind.value > 0)) { //默认投币
                showLoading.value = true;
                console.log('余币多');
                console.log(machineId.value);
                console.log(extId.value);
                console.log(item.coins);
                await v3PlayerCoinInAPI({
                    machineId: machineId.value,
                    extId: extId.value,
                    coins: item.coins
                }).then((res) => {
                    showLoading.value = false;
                    if (res.data.code == 200) {
                        // console.log(res.data);
                        coins.value = Math.floor(res.data.data.coins / coinFee.value);
                        coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
                        showDialog({
                            message: name.value + machineId.value + '投' + item.coins + '币成功',
                        }).then(() => {
                            // on close
                        });

                    } else {
                        showDialog({
                            title: '错误提示',
                            message: res.data.message,
                            confirmButtonText: '我知道了'
                        }).then(() => {

                        });
                    }
                }).catch((error) => {
                    showLoading.value = false;

                });
            }
            else if (coins.value < item.coins && coinsBind.value < item.coins) { //即充即投
                showLoading.value = true;
                console.log(123);
                console.log('余币不足');
                console.log(machineId.value);
                console.log(extId.value);
                console.log(item.coins);
                await v3PlayerPlaceOrderAPI({
                    machineId: machineId.value,
                    rechargeConfigId: item.coinInPlanId,//ID
                    rechargeType: 0,//充值币
                    extMode: extId.value,//充值分支号
                    rechargeDataSource: 1,//0默认充值  1及充启动
                    frontUrl: 'https://www.huanxizn.com/newclawcrane/#/home/index'//支付完成后，前端跳转地址
                }).then((res) => {
                    showLoading.value = false;
                    if (res.data.code == 200) {
                        // console.log(res.data);
                        location.href = res.data.data

                    } else {
                        showToast(res.data.message);
                    }
                }).catch((error) => {
                    showLoading.value = false;

                });
            }
        })
        .catch(() => {
            // on cancel
        });
}


// 分转化成元：
const toyuan = (points) => {
    var exchangeRate = 0.01; // 1分对应的元数，此处为0.01元
    var currency = points * exchangeRate; // 计算转化后的金额
    return currency;
}


const getIfOnLine = async () => {  //判断是否离线
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            if (res.data.data.isOnLine == 0) {  //离线
                router.push({
                    path: '/hint'
                });
            }
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    })
}

onBeforeRouteLeave((to, from, next) => {
    // 导航守卫===》导航离开该组件的对应路由时调用
    /* to:即将要进入的目标 路由对象
        from: 当前导航正要离开的路由
        next:执行的效果，next(false): 中断当前的导航  next({ path: '/' }): 跳转到一个不同的地址
    */
    if (to.name == "toLogin") {
        next(false);
        showToast("不能再返回了");
    } else {
        next();
    }
})

const urlStr = ref('')
urlStr.value = location.href
let index = urlStr.value.lastIndexOf('\/');
urlStr.value = urlStr.value.substring(index + 1, urlStr.value.length);
watch(        //监测路由id的变化
    () => urlStr.value,
    (newurlStr) => {
        // console.log(newurlStr);
        if (newurlStr == 'index') {
            extId.value = localStorage.getItem('shop_sExtId');
            if (extId.value == null || extId.value == 0 || extId.value == 'NaN' || extId.value == 'undefined') {
                extId.value = 0
            }
            getIfOnLine()
        }
    },
    { immediate: true }
)

</script>
<style scoped lang="less">
.user {
    margin: 0px 0px 20px 0px;
    width: 100%;
    height: 250px;
    background: url(../static/img/top.png) no-repeat;
    background-size: 100% 100%;
    // border-radius: 20px;
    color: #fff;
    padding-top: 30px;

    .topmachine {
        width: 90%;
        height: 65px;
        border-radius: 10px;
        line-height: 65px;
        background-color: #fff;
        margin: 0px auto;
        color: #000;
        font-size: 32px;
        display: flex;
        justify-content: space-around;

        .id {
            color: #0378d5;
        }

        .span1 {
            font-size: 40px;
            color: #006aff;
            font-weight: 400;
            line-height: 20px;
            margin-right: 20px;
        }

        .van-icon {
            font-size: 40px;
            color: #006aff;
            font-weight: 900;
            line-height: 60px;
        }
    }

    ul {
        display: flex;
        justify-content: space-between;
        position: relative;

        li {
            margin: 15px;
            display: flex;
            justify-content: space-between;
            font-size: 30px;

            div {
                margin: 15px 40px 0 10px;

                p {
                    margin: 10px;
                }
            }

            .yellow {
                color: #fff000;
            }
        }

        // .van-button {
        //     position: absolute;
        //     width: 260px;
        //     height: 120px;
        //     right: 10px;
        //     top: 40px;
        //     // background-color: linear-gradient(to right, #ff6034, #ee0a24);
        //     color: #000;
        // }


    }

    img {
        width: 130px;
        height: 130px;
        margin-left: 20px;
        margin-right: 0px;
        border-radius: 50%;
        vertical-align: middle;
    }
}

.showmachine {

    .van-radio-group {
        margin-top: 30px;
    }
}

.main {
    background-color: rgb(255, 255, 255);
    width: 70%;
    // height: 750px;
    // text-align: center;
    margin-left: 8%;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    padding: 50px;

    .coinPlan {
        font-size: 40px;
        width: 240px;
        height: 185px;
        color: #fff;
        background: linear-gradient(to bottom, #2fb2ff, #b7e4ff);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin: 10px;
        font-weight: 900;
    }

    .yuan {
        color: #474747;
    }

    // line-height: 50%;
    .null {
        // margin-top: 250px;
        line-height: 400px;

    }
}

.swipe {
    .my-swipe .van-swipe-item {
        color: #fff;
        font-size: 50px;
        line-height: 300px;
        text-align: center;
        background-color: #39a9ed;
    }
}
</style>