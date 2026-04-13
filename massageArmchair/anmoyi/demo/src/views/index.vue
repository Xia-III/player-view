<template>
    <div class="gongxiangjieji">
        <div class="top">
        </div>
        <div class="middle">
            <span>余额:<i>{{ coins / 100 }}</i></span>
            <span>剩余时间:<i>{{ coinsBind / coinFee }}</i></span>
            <span>设备编号:<i>{{ machineId }}</i></span>
        </div>

        <div class="bigBox">
            <div class="cheap">
                <span>优惠套餐</span>
            </div>
            <div class="discounts">
                <div class="coinPlan" @click="onshowShops(item)" v-for="(item, index) in rechargeConfigList"
                    :key="index">
                    <div class="money">充￥{{ item.fee }}</div>
                    <div class="moneys">得{{ item.coins }}元</div>
                </div>
                <div class="null" v-if="rechargeConfigList.length <= 0">暂无充值套餐</div>
            </div>
        </div>

        <div class="mainBox">
            <div class="cheap">
                <span>请选择单次购买套餐</span>
            </div>
            <div class="discounts">
                <div class="coinPlan" @click="onInsertCoins(item, playerProfile)" v-if="coinInPlanList.length > 0"
                    v-for="item in coinInPlanList" :key="item.coinInPlanId">
                    <div class="prices">
                        <p>{{ item.name }}</p>
                        <p>{{ item.description }}</p>
                    </div>

                    <span class="price">￥{{ item.originalFee / 100 }}</span>
                    <span class="cheapPrice">￥{{ item.fee / 100 }}</span>

                </div>
                <div class="null" v-else>暂无投币套餐</div>

            </div>
        </div>
    </div>
    <!-- 投诉按钮 -->
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import {
    v3PlayerProfileAPI, v3PlayerCoinInPlanAPI,
    v3PlayerMachineListAPI, v3PlayerCoinInAPI,
    v3PlayerPlaceOrderAPI, v3PlayerRechargeConfigListAPI
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
            console.log(res.data.data);
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


            if (res.data.data.name) {
                name.value = "按摩椅"
            } else {
                name.value = "按摩椅"
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
const rechargeConfigList = ref([])
// 页面创建时加载充值套餐数据：
const onshowShop = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        showLoading.value = false;
        console.log(res);
        if (res.data.code == 200) {
            console.log(res.data.data, "充值套餐");
            if (res.data.data) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].fee = toDecimal(res.data.data[i].fee / 100);
                    res.data.data[i].coins = Math.floor(res.data.data[i].coins / 100);  //取整
                    res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / 100);
                }
                rechargeConfigList.value = res.data.data
                console.log(rechargeConfigList.value, 11111);
            } else {
                rechargeConfigList.value = [];
            }

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });
}
onshowShop()

// 页面创建时加载投币列表数据：
const coinInPlanList = ref([])
const getCoinInPlan = async (addressId) => {
    showLoading.value = true;
    await v3PlayerCoinInPlanAPI({
        addressId: addressId
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data);
            coinInPlanList.value = res.data.data

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}

// 点击充值：
const onshowShops = async (item) => {
    showLoading.value = true;
    if (extId.value == null || extId.value == undefined || extId.value == '') {
        extId.value = 0
    }
    await v3PlayerPlaceOrderAPI({
        rechargeConfigId: item.rechargeConfigId,  //ID
        rechargeType: 0,  //充值币
        extMode: extId.value,  //充值分支号
        rechargeDataSource: 0, //0默认充值  1及充启动
        frontUrl: 'https://www.huanxizn.com/newSinger/#/home/index' //支付完成后，前端跳转地址
    }).then((res) => {
        showLoading.value = false;
        console.log(res.data);
        if (res.data.code == 200) {
            // console.log(res.data);
            location.href = res.data.data;

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });

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
            '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + '设备' + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
        allowHtml: true
    })
        .then(async () => {
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
                    console.log(res);
                    showLoading.value = false;
                    if (res.data.code == 200) {
                        console.log(res.data);
                        // coins.value = Math.floor(res.data.data.coins / coinFee.value);
                        // coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
                        getPost()
                        showDialog({
                            message: '设备' + machineId.value + '成功',
                        }).then(() => {
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
                    frontUrl: 'https://www.huanxizn.com/newSinger/#/home/index'//支付完成后，前端跳转地址
                }).then((res) => {
                    showLoading.value = false;
                    if (res.data.code == 200) {
                        console.log(res.data);
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
            isButtonDisabled.value = false; // 恢复状态

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

//制保留2位小数，如：2，会在2后面补上.00即2.00 
const toDecimal = (x) => {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
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
.gongxiangjieji {
    position: relative;

    .top {
        width: 100%;
        height: 270px;
        background: url(../static/img/gxjieji.jpg) no-repeat;
        background-size: 100% 100%;
        // img {
        //     width: 100%;
        //     height: 270px;
        // }

    }

    .middle {
        position: absolute;
        left: 0;
        top: 195px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 80px;
        color: #4f0808;
        // color: #fff;

        span {
            padding: 20px;
            font-size: 30px;
        }
    }

    .bigBox {
        background-color: #cfcdc9;
        margin-top: 3%;
        padding: 30px;
        width: 85%;
        margin-left: 4%;
        border-radius: 15px;

        .cheap {
            width: 3rem;
            margin-left: 235px;

            span {
                font-size: 42px;
                border-bottom: 1px solid #d00d02;
                text-align: center;
                color: #d00d02;
                font-weight: 600;

            }
        }

        .discounts {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;

            .coinPlan {
                font-size: 38px;
                width: 300px;
                height: 110px;
                color: #fff;
                background: linear-gradient(to bottom, rgb(255, 137, 90), rgb(254, 89, 75));
                border-radius: 15px;
                margin-top: 15px;
                font-weight: 700;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

                .money {
                    padding: 3px;
                    color: #700600;
                    font-size: 32px;
                    border-bottom: 1px solid #700600;
                    margin-top: 5px;
                    margin-left: 10px;
                }

                .moneys {
                    margin-right: 10px;

                    display: flex;
                    justify-content: flex-end;
                }
            }

            .yuan {
                color: #474747;
            }

            .null {
                text-align: center;
                line-height: 600px;

            }
        }
    }

    .mainBox {
        background-color: #cfcdc9;
        margin-top: 3%;
        padding: 30px;
        width: 85%;
        margin-left: 4%;
        border-radius: 15px;
        padding-bottom: 1.43333rem;

        .cheap {
            font-size: 40px;
            text-align: center;
            color: #d00d02;
            font-weight: 600;
        }

        .discounts {
            .coinPlan {
                background: linear-gradient(to bottom, rgb(251, 245, 231), rgb(241, 226, 197));
                margin: 10px;
                height: 90px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                font-size: 30px;

                .price {
                    text-decoration: line-through;
                    text-decoration-style: solid;
                    text-decoration-color: #421e17;
                }

                .cheapPrice {
                    color: #e22622;
                    font-weight: 600;
                    font-size: 40px;
                }

                .prices {
                    font-size: 28px;
                    color: #421e17;

                    p:nth-child(1) {
                        font-weight: 600;
                    }

                    p:nth-child(2) {
                        font-size: 24px;
                        color: rgb(199, 181, 181);
                    }

                    span {
                        margin: 0;
                        margin-left: 17px;
                        font-size: 28px;
                        color: #fff;

                    }
                }
            }

            .yuan {
                color: #474747;
            }

            .null {
                text-align: center;
                line-height: 600px;

            }
        }
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
