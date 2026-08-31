<template>
    <div>
        <div class="user">
            <!-- 暂时隐藏：顶部机器信息栏
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
            -->
            <div class="userCard">
                <img :src="avatar" alt="">
                <div class="info">
                    <p class="playerId">会员：{{ playerId }}</p>
                    <p class="address">场地：{{ addressName }}</p>
                </div>
                <div class="coins" v-if="isCoin == true">
                    <p class="yellow">余币：{{ Math.floor((coins + coinsBind) / 100) }}</p>
                </div>
            </div>
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
        <!-- 外设租赁：借 -->
        <div class="leaseBox" v-if="leaseMode !== ''">
            <div class="cheap">
                <span>选择要租赁的设备</span>
            </div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <div class="leaseGrid" v-if="leaseAisles.length > 0">
                    <div class="leaseItem" v-for="item in leaseAisles" :key="item.leaseAisleId"
                        :class="{ occupied: item.occupied }"
                        @click="onLeaseAisle(item)">
                        <span v-if="item.aisleName" class="aisleName">{{ item.aisleName }}</span>
                        <img :src="item.picUrl || zuLinImg" @error="handleImgError" alt="">
                        <p class="goodsName">{{ item.goodsName }}</p>
                        <p class="rent">￥{{ toyuan(item.rentPricePerMinute) }}/分钟</p>
                        <p class="deposit">定金￥{{ toyuan(item.depositFee) }}</p>
                    </div>
                </div>
                <div class="null" v-else>暂无可租设备</div>
            </van-pull-refresh>
        </div>
        <!-- 旧页面投币启动 -->
        <div class="main" v-if="isNewPage === false && leaseMode === ''">
            <!-- <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                :key="item.coinInPlanId" @click="onInsertCoins(item, playerProfile)">
                <div class="coinPlan">
                    <div>{{ toyuan(item.fee) }}元</div>
                    <div class='yuan'>{{ item.coins }}币</div>
                </div>
            </div>
            <div class="null" v-else>暂无投币套餐</div> -->
            <div class="cheap">
                <span>购买后可直接启动设备</span>
            </div>
            <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                :key="item.coinInPlanId" @click="!isButtonDisabled && onInsertCoins(item, playerProfile)">
                <div class="prices">
                    <div>{{ toyuan(item.fee) }}元 = {{ item.coins }}币 </div>
                </div>
                <div class="start"><span>点击启动</span></div>
            </div>
            <div class="null" v-else>暂无投币套餐</div>

        </div>
        <!-- 新页面投币启动 -->
        <div class="gameLaunch" v-if="isNewPage === true && leaseMode === ''">
            <div class="cheap">
                <span>投币启动</span>
            </div>
            <div class="add">
                <img src="../static/img/subtract.png" alt="" @click="countReduce">
                <div class="coins">投币数：
                    <input v-model="count" min="1" class="input" type="number">个
                </div>
                <img src="../static/img/add.png" alt="" @click="countAdd">
            </div>
            <div class="button" @click="toggleImage">
                <p>开始投币</p>
                <p>点击即可启动机器</p>
            </div>
        </div>
        <!-- 新页面套餐充值 -->
        <div class="bigBox" v-if="isNewPage === true && leaseMode === ''">
            <div class="cheap">
                <span>套餐充值</span>
            </div>
            <div class="titles">
                <p>套餐充值更优惠，游戏币全场通用。</p>
                <!-- <p>游戏币全场通用。</p> -->
            </div>
            <div class="discounts">
                <div class="coinPlan" v-for="(item, index) of rechargeConfigLists" :key="index"
                    @click="onshowShop(item)" v-if="rechargeConfigLists.length > 0">
                    <div class="money">充￥{{ item.fee }}</div>
                    <div class="moneys" v-if="isCoin === false">得{{ item.coins }}元</div>
                    <div class="moneys" v-else>得{{ item.coins }}币</div>
                </div>
                <div class="null" v-if="rechargeConfigLists.length <= 0">暂无充值套餐</div>
            </div>
        </div>
        <!-- 玩家直投弹框 -->
        <van-popup v-model:show="showplayer" position="bottom" :style="{ height: '50%' }">
            <div class="title">
                <span style="font-size: 18px; margin-left: 10px; margin-top: 10px;">玩家直投</span>
                <div style="width: 30px; height: 30px;background-color:rgb(93, 195, 255);  position: relative;"
                    @click="showplayer = false">
                    <van-icon name="cross" class="icon" />
                </div>
            </div>
            <div class="coinsContent">
                <div class="coinPlan" v-if="coinInPlanList.length > 0" v-for="item in coinInPlanList"
                    :key="item.coinInPlanId" @click="onInsertCoin(item, playerProfile)">
                    <div class="coinPlan">
                        <div>{{ toyuan(item.fee) }}元</div>
                        <div class='yuan'>{{ item.coins }}币</div>
                    </div>
                </div>
                <div class="null" v-else>暂无投币套餐</div>
            </div>
        </van-popup>
    </div>
    <div style="position: fixed;right: 10px;bottom: 20%; text-align: center;">
        <img src="../static/img/kefu.png" style="width:40px;height:auto;" @click="toKefu">
        <p style="color: #666; font-size: 13px; text-align: center;">客服电话</p>
    </div>
    <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
        v-model:show="showLoading">
        <van-loading type="spinner" />
    </van-popup>
    <!-- 底部导航：借 / 还 -->
    <van-tabbar route v-if="leaseMode !== ''">
        <van-tabbar-item replace to="/home/index" icon="shop-o">租借</van-tabbar-item>
        <van-tabbar-item replace to="/home/leaseReturn" icon="logistics">归还</van-tabbar-item>
    </van-tabbar>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import {
    v3PlayerProfileAPI, v3PlayerMachineListAPI,
    v3PlayerCoinInAPI, v3PlayerPlaceOrderAPI,
    v3PlayerRechargeConfigListAPI,
    LeaseEntryAPI, CreateLeaseOrderAPI
} from '../api/index'
import zuLinImg from '../static/img/ZuLin.jpg'
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
const isNewPage = ref(false) // 判断是否为新页面
const isCoin = ref(false) // 判断是否为充币
// 外设租赁相关：
const leaseMode = ref('') // ''非租赁机器 / 'borrow'借
const leaseAisles = ref([]) // 全部货道
// 租赁商品图片加载失败时使用默认图：
const handleImgError = (e) => {
    e.target.src = zuLinImg
}


const toKefu = () => {
    location.href = 'tel:' + servicePhone.value;
}

onMounted(() => {
    getPost()
    getRecharge()
})
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
            isNewPage.value = res.data.data.isNewPage
            isCoin.value = res.data.data.isCoin
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
            getLeaseEntry(res.data.data.machineId)
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    });
}

const rechargeConfigLists = ref([])
// 页面创建时加载充值套餐数据：
const getRecharge = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        showLoading.value = false;
        console.log(res);
        if (res.data.code == 200) {
            console.log(res.data.data);
            if (res.data.data) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].fee = res.data.data[i].fee / 100;
                    res.data.data[i].coins = Math.floor(res.data.data[i].coins / 100);  //取整
                    res.data.data[i].coinsBind = Math.floor(res.data.data[i].coinsBind / 100);
                }
                console.log(res.data.data);
                rechargeConfigLists.value = res.data.data
            } else {
                rechargeConfigLists.value = [];
            }

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });
}


// 页面创建时加载租赁入口数据：
const coinInPlanList = ref([])
const getLeaseEntry = async (machineId, withLoading = true) => {
    if (withLoading) showLoading.value = true;
    await LeaseEntryAPI({
        machineId: machineId
    }).then((res) => {
        if (withLoading) showLoading.value = false;
        if (res.data.code == 200) {
            const data = res.data.data
            // 借：显示可租设备列表（归还已拆分到独立页面）
            leaseMode.value = 'borrow'
            leaseAisles.value = data.aisles || []
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        if (withLoading) showLoading.value = false;
    });
}
// 下拉刷新租赁设备列表：
const refreshing = ref(false)
const onRefresh = () => {
    getLeaseEntry(machineId.value, false).finally(() => {
        refreshing.value = false;
    });
}
// 点击货道：先弹确认框，确认后创建租赁订单：
const onLeaseAisle = (item) => {
    if (item.occupied) {
        showToast('设备已经借租，请选择其他设备');
        return;
    }
    showConfirmDialog({
        title: '租赁确认',
        message:
            '<div style="line-height: 26px;">' +
            '<div>商品：' + item.goodsName + '</div>' +
            '<div>定金：<span style="color:#d00d02;">￥' + toyuan(item.depositFee) + '</span></div>' +
            '<div>租金：<span style="color:#d00d02;">￥' + toyuan(item.rentPricePerMinute) + '/分钟</span></div>' +
            '</div>',
        allowHtml: true
    }).then(() => {
        createLeaseOrder(item)
    }).catch(() => {
        // 用户取消
    });
}
// 创建租赁订单：
const createLeaseOrder = async (item) => {
    showLoading.value = true;
    await CreateLeaseOrderAPI({
        machineId: machineId.value,
        leaseAisleId: item.leaseAisleId,
        frontUrl: 'https://www.huanxizn.com/newVending/#/home/index'
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            location.href = res.data.data.payUrl
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;
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
console.log(isButtonDisabled.value);
// 旧页面投币：
const onInsertCoins = async (item) => {
    console.log(item);
    if (isButtonDisabled.value) return;
    isButtonDisabled.value = true;  //禁用
    if (machineId == null) {
        isButtonDisabled.value = false; // 恢复状态
        showToast('请先选择要投币的机器');
        return false;
    }
    if (isCoin.value === false) {    //根据金额
        console.log('根据金额');

        var flag = (coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0);
        showConfirmDialog({
            title: flag ? '当前使用余额或者余币支付' : '在线支付',
            message:
                '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + remark.value + machineId.value + '</span>前</span>',
            allowHtml: true
        })
            .then(async () => {
                showLoading.value = true;
                if ((coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0)) {
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
                            getPost()
                            showDialog({
                                message: remark.value + machineId.value + '投' + item.coins + '币成功',
                            }).then(() => {
                                // on close
                                isButtonDisabled.value = false;    // 恢复状态
                                console.log(isButtonDisabled.value, 22222);
                            });

                        } else {
                            showDialog({
                                title: '错误提示',
                                message: res.data.message,
                                confirmButtonText: '我知道了'
                            }).then(() => {
                                isButtonDisabled.value = false;  // 恢复状态
                                console.log(isButtonDisabled.value, 4444);
                            });
                        }
                    }).catch((error) => {
                        showLoading.value = false;

                    }).finally(() => {
                        isButtonDisabled.value = false; // 无论成功或失败，启用按钮
                        console.log(isButtonDisabled.value, 33333);

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
                        frontUrl: 'https://www.huanxizn.com/newVending/#/home/index'//支付完成后，前端跳转地址
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
                isButtonDisabled.value = false;  // 恢复状态
            });
    } else {   //根据币数
        console.log('根据币数');

        if ((coins.value + coinsBind.value >= item.coins && coins.value > 0) || (coinsBind.value + coins.value >= item.coins && coinsBind.value > 0)) { //默认投币
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
                    coins.value = Math.floor(res.data.data.coins);
                    coinsBind.value = Math.floor(res.data.data.coinsBind);
                    showDialog({
                        message: remark.value + machineId.value + '投' + item.coins + '币成功',
                    }).then(() => {
                        isButtonDisabled.value = false;    // 恢复状态
                    });

                } else {
                    showDialog({
                        title: '错误提示',
                        message: res.data.message,
                        confirmButtonText: '我知道了'
                    }).then(() => {
                        isButtonDisabled.value = false;    // 恢复状态
                    });
                }
            }).catch((error) => {
                showLoading.value = false;
                isButtonDisabled.value = false;    // 恢复状态
            }).finally(() => {
                isButtonDisabled.value = false; // 无论成功或失败，启用按钮

            })
        }
        else if (coins.value < item.coins && coinsBind.value < item.coins) { //即充即投
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
                frontUrl: 'https://www.huanxizn.com/newVending/#/home/index'//支付完成后，前端跳转地址
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
    }

}

const count = ref(1)
// 减
const countReduce = () => {
    count.value--
    if (count.value <= 1) {
        count.value = 1
    }
}

// 加
const countAdd = () => {
    count.value++
}

const showplayer = ref(false)
const isButton = ref(false);   // 控制按钮状态

// 新页面投币：
const toggleImage = () => {
    if (isButton.value) return;
    isButton.value = true;  //禁用按钮
    if (machineId == null) {
        isButton.value = false;
        showToast('请先选择要投币的机器');
        return false;
    }

    console.log(coins.value);

    if (isCoin.value === false) {  //根据金额
        console.log('根据金额');
        if ((coinsBind.value / coinFee.value >= count.value && coinsBind.value > 0) || (coins.value / coinFee.value >= count.value && coins.value > 0)) { //默认投币
            showConfirmDialog({
                title: '在线支付',
                message:
                    '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + remark.value + machineId.value + '</span>前</span>',
                allowHtml: true
            }).then(async () => {
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
                        console.log(res.data);
                        getPost()
                        showDialog({
                            message: remark.value + machineId.value + '投' + count.value + '币成功',
                        }).then(() => {
                            isButton.value = false;    // 恢复状态
                        });

                    } else {
                        showDialog({
                            title: '错误提示',
                            message: res.data.message,
                            confirmButtonText: '我知道了'
                        }).then(() => {
                            isButton.value = false;    // 恢复状态

                        });

                    }
                }).catch((error) => {
                    showLoading.value = false;
                    isButton.value = false;

                }).finally(() => {
                    isButton.value = false; // 无论成功或失败，启用按钮

                })
            })
                .catch(() => {
                    isButton.value = false;  // 恢复状态

                });

        }
        else { //即充即投
            isButton.value = false;  // 恢复状态
            console.log('余币不足');
            console.log(machineId.value);
            console.log(extId.value);
            console.log(count.value);
            showToast('余币不足');
            showplayer.value = true
        }
    } else {  //根据币数
        console.log('根据币数');
        if ((coins.value + coinsBind.value >= count.value && coins.value + coinsBind.value > 0)) { //默认投币

            showConfirmDialog({
                title: '温馨提示',
                message:
                    '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + remark.value + machineId.value + '</span>前</span>',
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
                        coins: count.value
                    }).then((res) => {
                        showLoading.value = false;
                        if (res.data.code == 200) {
                            console.log(res.data);

                            showDialog({
                                message: remark.value + machineId.value + '投' + count.value + '币成功',
                            }).then(() => {
                                isButton.value = false;  // 恢复状态

                            });
                            coins.value = Math.floor(res.data.data.coins);
                            coinsBind.value = Math.floor(res.data.data.coinsBind);

                        } else {
                            showDialog({
                                title: '错误提示',
                                message: res.data.message,
                                confirmButtonText: '我知道了'
                            }).then(() => {
                                isButton.value = false;  // 恢复状态

                            });

                        }
                    }).catch((error) => {
                        showLoading.value = false;
                        isButton.value = false;  // 恢复状态

                    }).finally(() => {
                        isButton.value = false; // 无论成功或失败，启用按钮
                    })
                })
                .catch(() => {
                    isButton.value = false;  // 恢复状态

                });

        }
        else if (coins.value + coinsBind.value < count.value) { //即充即投
            isButton.value = false;  // 恢复状态
            console.log(123);
            console.log('余币不足');
            console.log(machineId.value);
            console.log(extId.value);
            console.log(count.value);
            showToast('余币不足');
            showplayer.value = true


        }
    }


}

// 新页面玩家直投：
const onInsertCoin = (item) => {
    // console.log(item);
    if (machineId == null) {
        showToast('请先选择要投币的机器');
        return false;
    }

    if (isCoin.value === false) {  //根据金额
        console.log('根据金额');

        var flag = (coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0);
        showConfirmDialog({
            title: flag ? '当前使用余额或者余币支付' : '在线支付',
            message:
                '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + remark.value + machineId.value + '</span>前</span>',
            allowHtml: true
        })
            .then(async () => {
                if ((coins.value >= item.fee && coins.value > 0) || (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0)) {
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
                            getPost()
                            showDialog({
                                message: remark.value + machineId.value + '投' + item.coins + '币成功',
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
                        frontUrl: 'https://www.huanxizn.com/newVending/#/home/index'//支付完成后，前端跳转地址
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
    } else {  //根据币数
        console.log('根据币数');

        showConfirmDialog({
            title: '温馨提示',
            message:
                '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + remark.value + machineId.value + '</span>前</span>',
            allowHtml: true
        })
            .then(async () => {
                // on confirm
                // console.log(coins.value);
                if ((coins.value + coinsBind.value >= item.coins && coins.value > 0)) { //默认投币
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
                            coins.value = Math.floor(res.data.data.coins);
                            coinsBind.value = Math.floor(res.data.data.coinsBind);
                            showDialog({
                                message: remark.value + machineId.value + '投' + item.coins + '币成功',
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
                        frontUrl: 'https://www.huanxizn.com/newVending/#/home/index'//支付完成后，前端跳转地址
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

}

// 新页面点击充值：
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
        frontUrl: 'https://www.huanxizn.com/newVending/#/home/index' //支付完成后，前端跳转地址
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
// 分转化成元：
const toyuan = (points) => {
    var exchangeRate = 0.01; // 1分对应的元数，此处为0.01元
    var currency = points * exchangeRate; // 计算转化后的金额
    return currency;
}
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
    padding: 20px;

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

    // 会员信息卡片
    .userCard {
        background-color: #fff;
        border-radius: 15px;
        padding: 30px;
        display: flex;
        align-items: center;

        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .info {
            flex: 1;
            margin-left: 25px;

            p {
                font-size: 28px;
                color: #333;
                margin: 10px 0;
            }

            .playerId {
                font-size: 34px;
                font-weight: 600;
                color: #1989fa;
            }

            .address {
                color: #757575;
            }
        }

        .coins {
            flex-shrink: 0;

            .yellow {
                font-size: 30px;
                color: #d00d02;
                font-weight: 600;
            }
        }
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

    // .coinPlan {
    //     font-size: 40px;
    //     width: 240px;
    //     height: 185px;
    //     color: #fff;
    //     background: linear-gradient(to bottom, #2fb2ff, #b7e4ff);
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //     justify-content: center;
    //     border-radius: 15px;
    //     margin: 10px;
    //     font-weight: 900;
    // }

    .cheap {
        font-size: 35px;
        text-align: center;
        color: #2fb2ff;
        font-weight: 600;
    }

    .coinPlan {
        font-size: 38px;
        width: 500px;
        height: 110px;
        color: #fff;
        background: linear-gradient(to bottom, #2fb2ff, #b7e4ff);
        border-radius: 15px;
        margin-top: 15px;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .prices {
            margin-left: 20px;

        }

        .start {
            display: flex;
            justify-content: flex-end;
            color: #474747;
            margin-right: 20px;
            font-size: 30px;
        }

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

.gameLaunch {
    background-color: rgb(255, 255, 255);
    width: 80%;
    // height: 750px;
    // text-align: center;
    margin-left: 4%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */

    padding: 50px;
    padding-top: 20px;

    .cheap {
        // width: 3rem;
        // margin-left: 220px;

        span {
            font-size: 40px;
            border-bottom: 1px solid rgb(82, 177, 255);
            text-align: center;
            color: rgb(82, 177, 255);
            font-weight: 600;

        }
    }

    .input {
        height: 0.8rem;
        width: 1rem;
        text-align: center;
        background-color: rgb(242, 242, 242);
        border: none;
        color: #d00d02;
        font-weight: 600;

    }

    .add {
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding-top: 30px;

        .coins {
            font-size: 30px;
        }

        img {
            width: 60px;
            height: 60px;
            margin: 0 40px;
        }
    }

    .button {
        width: 400px;
        height: 90px;
        background: linear-gradient(to bottom, #69BFFF, #38A1FF);
        border-radius: 20px;
        box-shadow: 0px 10px 0px #FFA200, 0px 14px 10px rgba(0, 0, 0, 0.2);
        border: 3px solid #FFA200;
        padding-top: 10px;
        text-align: center;
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .button:active {
        box-shadow: 0px 5px 0px #FFA200, 0px 7px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(5px);
    }

    .null {
        line-height: 400px;

    }
}

// .bigBox {
//     background-color: #fff;
//     margin-top: 3%;
//     padding: 30px;
//     width: 85%;
//     margin-left: 4%;
//     border-radius: 15px;

//     .cheap {
//         width: 3.2rem;
//         margin-left: 220px;

//         span {
//             font-size: 40px;
//             border-bottom: 1px solid rgb(82, 177, 255);
//             text-align: center;
//             color: rgb(82, 177, 255);
//             font-weight: 600;

//         }
//     }

//     .discounts {
//         display: flex;
//         flex-wrap: wrap;
//         align-items: center;
//         justify-content: space-around;

//         .coinPlan {
//             font-size: 38px;
//             width: 300px;
//             height: 120px;
//             color: #fff;
//             background-color: rgb(242, 242, 242);
//             border-radius: 15px;
//             margin-top: 15px;
//             font-weight: 700;

//             .money {

//                 margin-left: 20px;

//                 span {
//                     padding: 3px;
//                     color: #700600;
//                     font-size: .7rem;
//                     margin-top: 5px;
//                     margin-left: 10px;
//                     vertical-align: middle;
//                 }

//                 img {
//                     width: 60px;
//                     height: 60px;
//                     vertical-align: middle;
//                 }
//             }

//             .moneys {
//                 display: flex;
//                 display: flex;
//                 justify-content: flex-end;
//                 color: rgb(255, 57, 61);
//                 font-size: 40px;


//                 margin-right: 30px;

//                 .cheapPrice {
//                     font-weight: 600;

//                 }
//             }
//         }

//         .yuan {
//             color: #474747;
//         }

//         .null {
//             text-align: center;
//             line-height: 500px;

//         }
//     }
// }

.bigBox {
    background-color: #fff;
    margin-top: 3%;
    padding: 30px;
    width: 85%;
    margin-left: 4%;
    border-radius: 15px;

    .cheap {
        // width: 3rem;
        // margin-left: 235px;

        span {
            font-size: 40px;
            border-bottom: 1px solid rgb(82, 177, 255);
            text-align: center;
            color: rgb(82, 177, 255);
            font-weight: 600;

        }
    }

    .titles {
        margin-top: 15px;

        p {
            font-size: 32px;
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
            // background: linear-gradient(to bottom, rgb(255, 137, 90), rgb(254, 89, 75));
            background: linear-gradient(to bottom, #69BFFF, #38A1FF);

            border-radius: 15px;
            margin-top: 15px;
            font-weight: 700;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

            .money {
                padding: 3px;
                color: #fff;
                font-size: 32px;
                border-bottom: 1px solid rgb(rgb(255, 162, 0));
                margin-top: 5px;
                margin-left: 10px;
            }

            .moneys {
                margin-right: 10px;
                color: rgb(255, 162, 0);
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


.leaseBox {
    background-color: #fff;
    margin-top: 3%;
    margin-bottom: 100px;
    padding: 30px;
    width: 85%;
    margin-left: 4%;
    border-radius: 15px;

    .cheap {
        span {
            font-size: 40px;
            border-bottom: 1px solid rgb(82, 177, 255);
            text-align: center;
            color: rgb(82, 177, 255);
            font-weight: 600;
        }
    }

    .null {
        text-align: center;
        line-height: 100px;
        font-size: 28px;
        color: #969799;
    }

    .leaseGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 15px;

        .leaseItem {
            position: relative;
            border: 2px solid rgb(93, 195, 255);
            border-radius: 15px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .aisleName {
                position: absolute;
                top: 6px;
                left: 6px;
                max-width: 70%;
                padding: 2px 8px;
                font-size: 20px;
                color: #fff;
                background-color: rgb(93, 195, 255);
                border-radius: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            img {
                width: 90px;
                height: 90px;
                border-radius: 10px;
            }

            .goodsName {
                font-size: 26px;
                font-weight: 600;
                margin-top: 8px;
                color: #000;
            }

            .rent {
                font-size: 24px;
                color: #d00d02;
                font-weight: 600;
                margin-top: 6px;
            }

            .deposit {
                font-size: 22px;
                color: #757575;
                margin-top: 6px;
            }
        }

        // 被他人借租的货道：灰色显示
        .leaseItem.occupied {
            background-color: #f5f5f5;
            border-color: #dcdcdc;

            img {
                filter: grayscale(100%);
            }

            .goodsName,
            .rent,
            .deposit {
                color: #bbb;
            }

            .aisleName {
                background-color: #dcdcdc;
                color: #999;
            }
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
        // color: rgb(93, 195, 255);
        // color: #fff;
        // background: linear-gradient(to bottom, rgb(254, 226, 88), rgb(250, 221, 170));

        border: 2px solid rgb(93, 195, 255);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin: 5px;
        font-weight: 900;
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