<template>
    <div>
        <div class="user">
            <div class="topmachine" @click="showchooseM">
                <p class="id">ID :{{ agencyId }}</p>
                <p>{{ (remark == null || remark == '') ? '普通机器' : remark
                    }}</p>
                <p>{{ machineId }}<span
                        v-if="extId + 1 != null && extId + 1 != 0 && extId + 1 != 'NaN' && extId != 'undefined'">-{{
                Number(extId) + 1 }}</span></p>
                <div>
                    <span class="span1">|</span>
                    <van-icon :name="arrowicon" />
                </div>
            </div>
            <ul>
                <li>
                    <img :src="avatar" alt="">
                    <div>
                        <p>会员：{{ playerId }}</p>
                        <p>场地：{{ addressName }}</p>
                    </div>
                    <div>
                        <p class="yellow">余额：{{ coins / 100 }}</p>
                        <p>币数：{{ coinsBind / coinFee }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <van-popup class="showmachine" @click-overlay="arrowicon = 'arrow-down'" v-model:show="showBottom"
            position="bottom" :style="{ height: '50%' }">
            <van-divider :style="{ color: '#188aff', borderColor: '#1989fa', padding: '0 16px' }">
                总共{{ machineList.length }}台-请选择机器
            </van-divider>
            <van-radio-group v-model="checked">
                <van-cell-group inset>
                    <van-cell
                        :title="((item.name == null || item.name == '') ? '普通机器' : item.name) + ' - ' + item.machineId"
                        clickable @click="changeCheck(item)" v-for="(item, index) in machineList" :key="item.machineId">
                        <template #right-icon>
                            <van-radio :name="item.machineId" />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </van-popup>
        <div class="main">
            <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                :key="item.coinInPlanId" @click="onInsertCoins(item, playerProfile)">
                <div class="coinPlan">
                    <div>{{ toyuan(item.fee) }}元</div>
                    <div class='yuan'>{{ item.coins }}币</div>
                </div>
            </div>
            <div class="null" v-else>暂无投币套餐</div>
        </div>
    </div>
    <div style="position: fixed;right: 10px;bottom: 20%; text-align: center;">
        <div style="position: relative;">
            <div @click="openComplain">
                <img src="../static/img/tousu.png">
                <p style="color: #666; font-size: 13px; text-align: center;">留言投诉</p>
            </div>
            <div v-if="showPopup" class="popup-box" @click.stop>
                <p class="popup-text" @click="toKefu">客服电话</p>
                <p class="popup-text" @click="returnBack">意见反馈</p>
            </div>
        </div>
        <!-- 点击其他区域关闭弹窗（可选） -->
        <div v-if="showPopup" class="overlay" @click="showPopup = false"></div>
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
const machineId = ref(null)
const remark = ref(null)
const addressName = ref(null)
const payCtrlMode = ref(null)
const agencyId = ref(null)
const name = ref('')
const servicePhone = ref('')

const showPopup = ref(false)
const openComplain = () => {
    showPopup.value = !showPopup.value
}
const toKefu = () => {
    location.href = 'tel:' + servicePhone.value;
}

// 意见反馈
const returnBack = () => {
    router.push({
        path: '/messageBoard',
        query: {
            addressId: addressId.value,
            machineId: machineId.value
        }
    });
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
            coins.value = res.data.data.coins
            coinsBind.value = res.data.data.coinsBind
            addressId.value = res.data.data.addressId
            machineId.value = res.data.data.machineId
            remark.value = res.data.data.remark
            addressName.value = res.data.data.addressName
            payCtrlMode.value = res.data.data.payCtrlMode
            agencyId.value = res.data.data.agencyId
            servicePhone.value = res.data.data.servicePhone
            name.value = res.data.data.name



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
            console.log(res.data, 'wanjiazhitou');
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

const isButtonDisabled = ref(false);   // 控制按钮状态
// 投币：
const onInsertCoins = (item) => {
    console.log(item);
    if (isButtonDisabled.value) return;
    isButtonDisabled.value = true;  //禁用
    if (machineId == null) {
        isButtonDisabled.value = false; // 恢复状态
        showToast('请先选择要投币的机器');
        return false;
    }
    var flag = (coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0);
    showConfirmDialog({
        title: flag ? '当前使用余额或者余币支付' : '在线支付',
        message:
            '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
        allowHtml: true
    }).then(async () => {
        // console.log(coins.value);
        if ((coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0)) { //默认投币
            showLoading.value = true;
            console.log('余币多');
            console.log(machineId.value);
            console.log(extId.value);
            console.log(item.coins);
            await v3PlayerCoinInAPI({
                machineId: machineId.value,
                extId: extId.value,
                coins: item.coins,
                coinInPlanId: item.coinInPlanId
            }).then((res) => {
                showLoading.value = false;
                if (res.data.code == 200) {
                    // console.log(res.data);
                    // coins.value = Math.floor(res.data.data.coins / coinFee.value);
                    // coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
                    showDialog({
                        message: name.value + machineId.value + '投' + item.coins + '币成功',
                    }).then(() => {
                        // on close
                        isButtonDisabled.value = false; // 恢复状态

                    });

                } else {
                    showDialog({
                        title: '错误提示',
                        message: res.data.message,
                        confirmButtonText: '我知道了'
                    }).then(() => {
                        isButtonDisabled.value = false; // 恢复状态

                    });
                }
            }).catch((error) => {
                showLoading.value = false;
                isButtonDisabled.value = false; // 恢复状态

            }).finally(() => {
                isButtonDisabled.value = false; // 无论成功或失败，启用按钮

            })
        }
        else { //即充即投
            isButtonDisabled.value = false; // 无论成功或失败，启用按钮
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
                frontUrl: 'https://www.huanxizn.com/newkidstoy/#/home/index'//支付完成后，前端跳转地址
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
            isButtonDisabled.value = false; // 无论成功或失败，启用按钮

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
        // showToast("不能再返回了");
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
    height: 260px;
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
            font-size: 26px;

            div {
                margin: 15px 50px 0 10px;

                p {
                    margin: 10px 10px 18px 10px;
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
        width: 120px;
        height: 120px;
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

.popup-box {
    position: absolute;
    right: 2rem;
    top: -22%;
    width: 3.2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: .2rem;
    z-index: 1001;
}

.popup-text {
    font-size: .4rem;
    color: #333;
    margin: .3rem;
}

.popup-text:nth-child(1) {
    margin-bottom: .5rem;
}

.popup-text:hover {
    color: #333;
    cursor: pointer;
}



.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}
</style>