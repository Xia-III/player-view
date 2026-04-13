<template>
    <div>
        <div class="container">
            <div class="user">
                <div class="topmessage">
                    <div class="leftUserInfo">
                        <img :src="avatar" alt="">
                        <div>

                            <p>余额{{ coins / 100 }}</p>
                            <p>币数{{ coinsBind / coinFee }}</p>
                            <!-- <p>本机可玩{{ coins + coinsBind }}次</p> -->

                        </div>
                    </div>
                    <div class="rightvip" @click="vipPage">
                        <span> 会员中心</span>
                    </div>
                </div>
                <div class="bottommessage">
                    <div class="box1">
                        <div class="box2">
                            <!-- <div v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9]" class="box3">{{ item }}</div> -->
                            &nbsp; <van-button class="btn" v-for="(item, index) in deviceTypebtns" :key="index"
                                :plain="item.type !== 'danger'" :type="machineId == item.id ? 'danger' : 'default'"
                                @click="choiceDeviceType(index, item)">
                                {{ item.remark ? item.remark : item.id }}
                                <!-- {{ item.id }} -->

                                <!-- <p style="font-size: 18px;   font-weight: 700;
                           ">{{ item.id }} </p> -->
                            </van-button>
                        </div>
                    </div>
                    <div class="right" @click="machineCounts">
                        <span>共{{ deviceTypebtns.length }}台</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
            <div class="main">
                <div class="wwj">
                    <div class="jiazi">
                        <img src="../static/img/扭蛋.png" alt="">
                    </div>
                    <div class="frame">
                        <img src="../static/img/底框.png" alt="">

                    </div>
                    <div class="add">
                        <img src="../static/img/减.png" alt="" @click="countReduce">

                        <img src="../static/img/加.png" alt="" @click="countAdd">
                    </div>
                    <div class="count">
                        <div style="display: flex; justify-content:space-evenly; align-items: center;">
                            <span>投</span>{{ count }}<span>币</span>
                        </div>
                    </div>
                    <div class="start" @click="!isButtonDisabled && toggleImage(item, playerProfile)">
                        <img src="../static/img/正常按钮.png" alt="" v-if="userShow">
                        <img src="../static/img/按压状态.png" alt="" v-if="!userShow">
                        <div class="text">
                            <p>点击启动</p>
                            <!-- <p>1币/1次</p>/ -->
                        </div>
                        <!-- <div class="text" v-if="!userShow">
                            <p>启动状态</p>
                            <p>1币/1次</p>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="bottom" @click="showpopup" v-if="rechargeConfigList.length > 0"
                style=" position: fixed; bottom: 0;height: 60px; width: 100%; background-color: rgb(254, 226, 88); display: flex; align-items: center; justify-content: center; ">
                <div style="font-weight: 600;text-align: center;color: rgb(160, 100, 21);font-size: 25px;  ">
                    充值</div>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '50%' }">
        <div class="title">
            <span style="font-size: 18px; margin-left: 10px; margin-top: 10px;">会员充值</span>
            <div style="width: 30px; height: 30px;background-color:rgb(254, 226, 88);  position: relative;"
                @click="showBottom = false">
                <van-icon name="cross" class="icon" />
            </div>
        </div>
        <div class="coinsContent">
            <div class="coinPlan" v-for="(item, index) of rechargeConfigList" :key="index"
                v-if="rechargeConfigList.length > 0">
                <div class="coinPlan" @click="onshowShop(item)">
                    <div>{{ item.fee }}元</div>
                    <!-- <div class='yuan'>赠送{{ item.coinsBind }}币</div> -->
                    <div class='yuan'>得{{ item.coins }}元</div>
                </div>
            </div>
            <div class="null" v-else>暂无充值套餐</div>
        </div>
    </van-popup>
    <!-- 玩家直投弹框 -->
    <van-popup v-model:show="showplayer" position="bottom" :style="{ height: '50%' }">
        <div class="title">
            <span style="font-size: 18px; margin-left: 10px; margin-top: 10px;">玩家直投</span>
            <div style="width: 30px; height: 30px;background-color:rgb(254, 226, 88);  position: relative;"
                @click="showplayer = false">
                <van-icon name="cross" class="icon" />
            </div>
        </div>
        <div class="coinsContent">
            <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                :key="item.coinInPlanId" @click="onInsertCoins(item, playerProfile)">
                <div class="coinPlan">
                    <div>{{ toyuan(item.fee) }}元</div>
                    <div class='yuan'>{{ item.coins }}币</div>
                </div>
            </div>
            <div class="null" v-else>暂无投币套餐</div>
        </div>
    </van-popup>
    <van-popup v-model:show="showCounts" position="bottom" :style="{ height: '50%' }">
        <van-nav-bar title="请选择设备编号" />
        <div class="btns">
            <van-button class="btn" v-for="(item, index) in deviceTypebtns" :key="index" :plain="item.type !== 'danger'"
                :type="machineId == item.id ? 'danger' : 'default'" @click="choiceDeviceType(index, item)">
                {{ item.remark ? item.remark : item.id }}
                <!-- {{ item.id }} -->

                <!-- // <p style="font-size: 18px;font-weight: 700;">{{ item.id }} </p> -->
            </van-button>
        </div>
    </van-popup>
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

    <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }" />
    <!-- 币数不够弹框 -->
    <!-- <van-dialog v-model:show="showBuyCoins" title="余币不足" show-cancel-button confirmButtonText="玩家直投"
        confirmButtonColor="red" @confirm="BuyCoins()">
        <div style="text-align: center; font-size: 12px; margin-top: 5px;">(当前剩{{ coins + coinsBind }}币，不够玩1次)</div>
    </van-dialog> -->
    <!-- 
    <van-dialog v-model:show="showBuyCoins" title="请先买币，在投币" show-cancel-button confirmButtonText="充值买币"
        confirmButtonColor="red" @confirm="BuyCoins">
        <div style="font-size: 300px; height: 250px; border: 2px solid #ccc; margin-left: 5px;">
            <img src="../static/img/jinbi.png" alt="">

        </div>
    </van-dialog> -->
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
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
const showBottom = ref(false)
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
const rechargeConfigList = ref([])
const showBuyCoins = ref(false)
const showplayer = ref(false)
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

const count = ref(1)
const countReduce = () => {
    count.value--
    if (count.value <= 1) {
        count.value = 1
    }
}

const countAdd = () => {
    count.value++
}



onMounted(() => {
    // myButton.value.click()
    getPost()
    showchooseM()

})
// 页面创建时加载充值套餐数据：
const getRecharge = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        console.log(1111);
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data.data);
            if (res.data.data) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].fee = toDecimal(res.data.data[i].fee / 100);
                    res.data.data[i].coins = Math.floor(res.data.data[i].coins / 100);  //取整
                    res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / 100);
                }
                rechargeConfigList.value = res.data.data
                console.log(rechargeConfigList.value);

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
getRecharge()
// 点击
const showpopup = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        console.log(1111);
        showLoading.value = false;
        if (res.data.code == 200) {
            showBottom.value = true
            console.log(res.data.data);
            if (res.data.data) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].fee = toDecimal(res.data.data[i].fee / 100);
                    res.data.data[i].coins = Math.floor(res.data.data[i].coins / 100);  //取整
                    res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / 100);
                }
                rechargeConfigList.value = res.data.data
                console.log(rechargeConfigList.value);

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


// 玩家直投：
const onInsertCoins = (item) => {
    // console.log(item);
    if (machineId == null) {
        showToast('请先选择要投币的机器');
        return false;
    }
    var flag = (coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0);
    showConfirmDialog({
        title: flag ? '当前使用余额或者余币支付' : '在线支付',
        message:
            '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
        allowHtml: true
    })
        .then(async () => {
            // on confirm
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
                        getPost()
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
            else { //即充即投
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
                    frontUrl: 'https://www.huanxizn.com/newGashapon/#/home/index'//支付完成后，前端跳转地址
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


// 点击充值：
const onshowShop = async (item) => {
    showLoading.value = true;
    if (extId.value == null || extId.value == undefined || extId.value == '') {
        extId.value = 0
    }
    await v3PlayerPlaceOrderAPI({
        rechargeConfigId: item.rechargeConfigId,  //ID
        rechargeType: 0,  //充值币
        extMode: extId.value,  //充值分支号
        rechargeDataSource: 0, //0默认充值  1及充启动
        frontUrl: 'https://www.huanxizn.com/newGashapon/#/home/index' //支付完成后，前端跳转地址
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

const deviceTypebtns = ref([
    // { text: '1号机', type: 'warning', id: 2 },
    // { text: '2号机', type: 'default', id: 3 },
    // { text: '3号机', type: 'default', id: 4 },
    // { text: '4号机', type: 'default', id: 5 }
])
const showchooseM = async () => {
    showLoading.value = true;
    await v3PlayerMachineListAPI({
        addressId: addressId.value
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data);
            deviceTypebtns.value = res.data.data.map((item) => {
                return {
                    text: "号机",
                    type: 'default',
                    id: item.machineId,
                    remark: item.remark
                }
            })
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = true;

    });

}

const checked = ref(0)
// let all = ref(null)
// console.log(all);
const remarks = ref('')
const choiceDeviceType = (index, item) => {
    console.log(item);

    var all = item
    console.log(all);
    machineId.value = item.id
    // remarks.value = item.remark

    console.log(machineId.value);

}

// const BuyCoins = (item) => {
//     // showLoading.value = true
//     showBottom.value = true
//     // showLoading.value = false
//     //   const value = ref({})

//     // item = machineId.value
//     // console.log(item);
//     router.push({
//         path: '/playerCoin',
//         query: item
//     })


// }

const playerCoin = () => {


}
const vipPage = () => {
    router.push({
        path: '/home/account'
    })
}


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
                // name.value = res.data.data.name
                name.value = "扭蛋机"
            } else {
                name.value = "扭蛋机"
            }
            getCoinInPlan(res.data.data.addressId)
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}


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

// 点击启动投币：
const userShow = ref(false)
const isButtonDisabled = ref(false);

const toggleImage = (item) => {
    console.log(isButtonDisabled.value, 99999);
    userShow.value = !userShow.value
    if (isButtonDisabled.value) return;
    isButtonDisabled.value = true;
    if (machineId == null) {
        isButtonDisabled.value = false; // 恢复状态
        showToast('请先选择要投币的机器');
        return false;
    }
    console.log(coins.value);
    // var flag = (coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= count.value && coinsBind.value > 0);
    if ((coinsBind.value / coinFee.value >= count.value && coinsBind.value > 0) || (coins.value / coinFee.value >= count.value && coins.value > 0)) { //默认投币
        //默认投币

        showConfirmDialog({
            title: '在线支付',
            message:
                '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
            allowHtml: true
        })
            .then(async () => {
                showLoading.value = true;
                console.log('余币多');
                console.log(machineId.value);
                console.log(extId.value);
                console.log(count.value);
                console.log(coins.value);
                await v3PlayerCoinInAPI({
                    machineId: machineId.value,
                    extId: extId.value,
                    coins: count.value,
                    coinInPlanId: 0
                }).then((res) => {
                    showLoading.value = false;
                    if (res.data.code == 200) {
                        // userShow.value = true
                        console.log(res.data);
                        // coins.value = Math.floor(res.data.data.coins / coinFee.value);
                        // coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
                        getPost()

                        showDialog({
                            message: name.value + machineId.value + '投' + count.value + '币成功',
                        }).then(() => {
                            isButtonDisabled.value = false;
                            console.log(isButtonDisabled.value, 22222);
                        });


                    } else {
                        showDialog({
                            title: '错误提示',
                            message: res.data.message,
                            confirmButtonText: '我知道了'
                        }).then(() => {
                            isButtonDisabled.value = false;
                            console.log(isButtonDisabled.value, 6666);
                        });
                        userShow.value = true

                    }
                }).catch((error) => {
                    showLoading.value = false;

                }).finally(() => {
                    isButtonDisabled.value = false; // 无论成功或失败，启用按钮
                    console.log(isButtonDisabled.value, 33333);

                })
            })
            .catch(() => {
                console.log(isButtonDisabled.value, 7777777);
                isButtonDisabled.value = false;
            });

    }
    else { //即充即投
        userShow.value = true
        isButtonDisabled.value = false; // 无论成功或失败，启用按钮

        console.log(123);
        console.log('余币不足');
        console.log(machineId.value);
        console.log(extId.value);
        console.log(count.value);
        // showBuyCoins.value = true
        showToast('余币不足');
        // router.push({
        //     path: '/playerCoin',
        //     query: { machineId: machineId.value }
        // })
        showplayer.value = true


    }

}



const showCounts = ref(false)
const machineCounts = () => {
    showCounts.value = true
}
const show = ref(false);
// const myButton = ref(null)

//制保留2位小数，如：2，会在2后面补上00.即2.00 
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
* {
    margin: 0;
    padding: 0;
}

.user {

    width: 100%;
    height: 250px;

    background-color: rgb(254, 226, 88);

    color: rgb(115, 75, 23);

    box-shadow: 30px 15px 20px rgb(250, 221, 170);
    margin-bottom: 16px;

    .topmessage {
        height: 100px;
        background-color: rgb(203, 198, 163);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .leftUserInfo {
            height: 65px;
            background-color: rgba(0, 0, 0, 0.1);
            width: 250px;
            border-radius: 30px;

            display: flex;
            align-items: center;
            margin-left: 15px;


            img {
                width: 65px;
                height: 65px;
                margin-left: 20px;
                margin-right: 0px;
                border-radius: 50%;
                vertical-align: middle;
            }

            p {
                font-weight: 700;
                font-size: 22px;
                margin-left: 5px;
            }


        }

        .rightvip {
            height: 68px;
            background-color: rgb(254, 226, 88);
            display: flex;
            width: 165px;
            border-radius: 30px;
            margin-right: 15px;

            span {
                font-size: 28px;
                color: rgb(160, 100, 21);
                font-weight: 700;
                padding-top: 15px;
                padding-left: 15px;

                width: 150px;
                height: 65px;

            }
        }
    }




}

::-webkit-scrollbar {
    display: none;
}

.bottommessage {
    display: flex;
    align-items: center;

    // width: 680px;
    // height: 100px;
    .box1 {

        height: 140px;
        width: 635px;
        overflow: hidden;

        background-color: rgb(254, 226, 88);

        overflow-x: scroll;

    }

    .box2 {
        display: flex;
        // align-items: center;
        // width: auto;
        width: 560px;
        height: 50px;
        white-space: nowrap;
        margin-top: 10px;
    }
}




// height: 100px;
.right {
    display: flex;
    align-items: center;
    flex: 1;
    // background-color: pink;
    height: 150px;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);

    span {
        font-size: 22px;
        // text-align: center;
        font-weight: 700;
        // margin-bottom: 10px;
        margin-left: 10px;
        color: rgb(160, 100, 21);

    }
}


.btn {
    font-size: 30px;
    height: 130px;
    margin-right: 15px;
    color: rgb(160, 100, 21);
    // width: 2.4rem;
    font-weight: 700;
    padding: 0 7px;
}

.van-icon {
    margin-top: 10px;
    font-size: 26px;
    color: rgb(160, 100, 21);

    font-weight: 700;
    line-height: 60px;
}


.showmachine {

    .van-radio-group {
        margin-top: 30px;
    }
}


.main {
    background-color: #4a3a93;

    width: 100%;
    height: 1150px;

    .wwj {
        position: relative;


        .jiazi img {
            padding-top: 150px;
            width: 75%;
            margin-left: 100px;


        }

        .start {
            img {
                width: 220px;
                height: 75px;
                position: absolute;
                bottom: 160px;
                left: 280px;
            }

            .text {
                position: absolute;
                bottom: 200px;
                left: 331px;
                color: #fff;
            }

            p:nth-of-type(1) {
                font-size: 28px;
                font-weight: 700;


            }

            p:last-child {
                font-size: 20px;
                font-weight: 700;
                padding-left: 20px;
            }
        }

        .count {
            font-size: 24px;
            color: #f8f8ed;
            width: 40px;
            position: absolute;
            left: 357px;
            bottom: 65px;
        }

    }



    .frame {



        img {
            position: absolute;
            bottom: 63px;
            left: 290px;
            width: 200px;
            height: 36px;
        }



    }

    .add {
        img {
            width: 40px;
            height: 40px;
        }

        img:first-child {
            position: absolute;
            left: 260px;
            bottom: 63px;
        }

        img:last-child {
            position: absolute;
            left: 460px;
            bottom: 63px;
        }
    }



}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    // background-color: #ccc;

    .icon {
        position: absolute;
        left: 9px;
        bottom: 0;
        font-size: 40px;
        text-align: center;
        // padding-bottom: 15px;
        // padding-left: 10px;

    }
}

.coinsContent {
    width: 700px;
    height: 450px;
    // background-color: #4a3a93;
    margin-left: 25px;
    margin-top: 15px;
    // width: 70%;
    // height: 750px;
    // text-align: center;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;

    .coinPlan {
        font-size: 40px;
        width: 210px;
        height: 180px;
        color: rgb(254, 226, 88);
        // background: linear-gradient(to bottom, rgb(254, 226, 88), rgb(250, 221, 170));

        border: 2px solid rgb(254, 226, 88);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin: 5px;
        font-weight: 900;
    }

}

.yuan {
    color: #474747;
}

// line-height: 50%;
.null {
    line-height: 400px;

}


.btns {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    width: 630px;
    height: 50px;
    // white-space: nowrap;

    margin-left: 8%;

    .btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 5px;
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