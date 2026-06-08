<template>
    <div class="washingBox">
        <div class="top">
            <img :src="topImageSrc" @error="onTopImageError" alt="">
        </div>
        <div class="middle">
            <span>机器编号:<i>{{ machineId }}</i></span>
            <span>余额:<i>{{ coins / 100 }}</i></span>
            <span>剩余次数:<i>{{ coinsBind / coinFee }}</i></span>
        </div>
        <div class="bottom" :style="{ background: `url(${bgImage}) no-repeat center center / cover` }">

            <div class="btn">
                <div class="btn-on" @click="toggleImage" :style="{ background: `url(${btnBgImage}) no-repeat center center / 100% 100%` }">
                    <p class="qidong">启动</p>
                </div>
            </div>
        </div>
        <div class="explain">
            <img src="../assets/shuoming.png" alt="" @click="show = true">
            <p style="color: #666; font-size: 13px; text-align: center;">保护方法</p>
        </div>
        <div class="chongzhi" :style="{ backgroundColor: chongzhiBg }" @click="showpopup" v-if="rechargeConfigList.length > 0">
            <p>充&nbsp;值</p>
        </div>
        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
        <!-- 保护方法弹框 -->
        <van-dialog v-model:show="show" title="说明" confirmButtonText="我知道了" cancelButtonColor="rgb(25, 137, 250)">
            <table>
                <thead>
                    <tr>
                        <th>保护眼睛就是保护视力，常用的的方法有：</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1、做好眼部卫生：保持眼睛清洁，及时清洗眼睛，避免过度揉搓眼睛，不要用脏手触摸眼睛。</td>
                    </tr>
                    <tr>
                        <td>2、注意用眼姿势，避免趴着、躺着、走路、坐车的时候读写。</td>
                    </tr>
                    <tr>
                        <td>3、控制用眼时间，持续用眼40-50分钟休息5-10分钟，可以闭眼或者远眺。长时间注视电脑、手机等电子设备会导致眼睛疲劳，需要适当休息，缓解眼部疲劳。</td>

                    </tr>
                    <tr>
                        <td>4、睡眠充足：睡眠对眼睛健康非常重要，每晚睡眠7至8小时，保持足够的睡眠质量。</td>

                    </tr>
                    <tr>
                        <td>5、注意饮食：保持均衡的饮食，多摄入富含维生素A、C和E、叶黄素和欧米伽-3脂肪酸等营养素的食物，如绿叶蔬菜、水果、坚果、鱼类、蛋类等，有助于保护眼部健康。</td>

                    </tr>
                    <tr>
                        <td>6、户外活动：户外活动可以增加眼睛对远处的适应能力，有助于减轻眼睛疲劳，减小近视的发生率。</td>

                    </tr>
                    <tr>
                        <td>7、眼保健操：进行眼部按摩、眼球转动、眼睛闭合等眼保健操可以帮助增加眼睛的血液循环和放松眼睛。</td>

                    </tr>
                </tbody>
            </table>
        </van-dialog>
        <!-- 充值弹出层 -->
        <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '50%' }">
            <div class="title">
                <span style="font-size: 18px; margin-left: 10px; margin-top: 10px;">充值</span>
                <div style="width: 30px; height: 30px; position: relative;" @click="showBottom = false">
                    <van-icon name="cross" class="icon" />
                </div>
            </div>
            <div class="coinsContent">
                <div class="coinPlan" v-for="(item, index) of rechargeConfigList" :key="index"
                    v-if="rechargeConfigList.length > 0">
                    <div class="coinPlan" @click="onshowShop(item)">
                        <div>{{ item.fee }}元</div>
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
                    <!-- <div class="coinPlan"
                        v-if="(coins >= item.coins && coins > 0) || (coinsBind >= item.coins && coinsBind > 0)">
                        <div class='yuan'>{{ item.coins }}次</div>
                    </div> -->
                    <div class="coinPlan">
                        <div>{{ toyuan(item.fee) }}元</div>
                        <div class='yuan'>{{ item.coins }}次</div>
                    </div>
                </div>
                <div class="null" v-else>暂无套餐</div>
            </div>
        </van-popup>
    </div>
</template>
<script setup>
document.querySelector('body').setAttribute('style', 'background-color:#eff6f9')
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import {
    v3PlayerProfileAPI, v3PlayerCoinInPlanAPI, v3PlayerCoinInAPI,
    v3PlayerPlaceOrderAPI, v3PlayerRechargeConfigListAPI
} from '../api/index'
import btnImgDefault from '../assets/btn-img.png'
import btnImg444 from '../assets/444-btn-img.png'
const router = useRouter()
const route = useRoute()
const machineId = ref(null)
const purchase = ref(false)
const showLoading = ref(false)
const show = ref(false);
const showBottom = ref(false)
const rechargeConfigList = ref([])


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

const remark = ref(null)
const addressName = ref(null)
const payCtrlMode = ref(null)
const agencyId = ref(route.query.agencyId || sessionStorage.getItem('agencyId') || null)
const name = ref('')
const servicePhone = ref('')

const showBuyCoins = ref(false)
const showplayer = ref(false)
const bgImage = ref(agencyId.value === '444' ? './static/img/444-yanjing.jpg' : './static/img/yanjing.jpg')
// 背景图：优先预加载 webp，成功则替换，失败保留 jpg
if (agencyId.value === '444') {
    const img = new Image()
    img.onload = () => { bgImage.value = 'https://static.huanxizn.com/customerService/444-yanjing.webp' }
    img.onerror = () => { /* 保持 jpg 回退 */ }
    img.src = 'https://static.huanxizn.com/customerService/444-yanjing.webp'
}
const btnBgImage = ref(agencyId.value === '444' ? btnImg444 : btnImgDefault)
const chongzhiBg = ref(agencyId.value === '444' ? 'rgb(183, 225, 249)' : 'rgb(12, 149, 255)')

// 顶部图片：优先加载 webp，失败回退 jpg
const topImageSrc = computed(() => {
    return agencyId.value === '444'
        ? 'https://static.huanxizn.com/customerService/444-huifu.webp'
        : './static/img/huifu.jpg'
})
const onTopImageError = (e) => {
    if (e.target.src && e.target.src.includes('444-huifu.webp')) {
        e.target.src = './static/img/444-huifu.jpg'
    }
}

onMounted(() => {
    // myButton.value.click()
    getPost()

})
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
            if (agencyId.value == null) {
                agencyId.value = res.data.data.agencyId
            }
            servicePhone.value = res.data.data.servicePhone


            if (res.data.data.name) {
                // name.value = res.data.data.name
                name.value = "恢复仪"
            } else {
                name.value = "恢复仪"
            }
            getCoinInPlan(res.data.data.addressId)
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });
}

// 投币：


const count = ref(1)  //默认投一币
const isButtonDisabled = ref(false);   // 控制按钮状态

const toggleImage = () => {
    if (isButtonDisabled.value) return;
    isButtonDisabled.value = true;  //禁用
    if (machineId == null) {
        isButtonDisabled.value = false; // 恢复状态
        showToast('请先选择要投币的机器');
        return false;
    }
    // on confirm
    console.log(coins.value);
    showConfirmDialog({
        title: '在线支付',
        message:
            '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
        allowHtml: true
    })
        .then(async () => {
            if ((coinsBind.value / coinFee.value >= count.value && coinsBind.value > 0) || (coins.value / coinFee.value >= count.value && coins.value > 0)) { //默认投币
                //默认投币
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
                            message: name.value + machineId.value + '投' + count.value + '成功',
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

            } else { //即充即投
                isButtonDisabled.value = false;  // 恢复状态
                console.log(123);
                console.log('余币不足');
                console.log(machineId.value);
                console.log(extId.value);
                console.log(count.value);
                showToast('余币不足');
                showplayer.value = true


            }

        })
        .catch(() => {
            isButtonDisabled.value = false;  // 恢复状态

        });

}



// 分转化成元：
const toyuan = (points) => {
    var exchangeRate = 0.01; // 1分对应的元数，此处为0.01元
    var currency = points * exchangeRate; // 计算转化后的金额
    return currency;
}

// 投币：
const onInsertCoins = async (item) => {
    showLoading.value = true
    await v3PlayerPlaceOrderAPI({
        machineId: machineId.value,
        rechargeConfigId: item.coinInPlanId,//ID
        rechargeType: 0,//充值币
        extMode: extId.value,//充值分支号
        rechargeDataSource: 1,//0默认充值  1及充启动
        frontUrl: 'https://www.huanxizn.com/newwashing/#/home/index'//支付完成后，前端跳转地址
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

// 点击充值：
const onshowShop = async (item) => {
    // console.log(item);
    showLoading.value = true;
    if (extId.value == null || extId.value == undefined || extId.value == '') {
        extId.value = 0
    }
    await v3PlayerPlaceOrderAPI({
        rechargeConfigId: item.rechargeConfigId,  //ID
        rechargeType: 0,  //充值币
        extMode: extId.value,  //充值分支号
        rechargeDataSource: 0, //0默认充值  1及充启动
        frontUrl: 'https://www.huanxizn.com/newwashing/#/home/index?agencyId=' + agencyId.value //支付完成后，前端跳转地址
    }).then((res) => {
        showLoading.value = false;
        console.log(res.data);
        if (res.data.code == 200) {
            console.log(res.data,"跳转支付");
            location.href = res.data.data;

        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;

    });

}

// 页面创建时加载充值套餐数据：
const getRecharge = async () => {
    showLoading.value = true;
    await v3PlayerRechargeConfigListAPI().then((res) => {
        console.log(res, 1111);
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
        console.log(res, 1111);
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
// 页面创建时加载投币列表数据：
const coinInPlanList = ref([])
const getCoinInPlan = async (addressId) => {
    showLoading.value = true;
    await v3PlayerCoinInPlanAPI({
        addressId: addressId
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            console.log(res.data, 1111);
            coinInPlanList.value = res.data.data
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        // showLoading.value = false;

    })
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
.washingBox {

    .top {
        height: 500px;

        img {
            width: 100%;
            height: 500px;
        }

    }

    .bottom {
        height: 850px;

        .btn {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            position: fixed;
            left: 50%;
            top: 70%;
            transform: translate(-50%, -80%);

            .btn-on {
                width: 340px;
                height: 340px;
                border-radius: 50%;
                margin: 0 auto;
                color: #fff;
                text-align: center;
                font-size: 38px;

                .qidong {
                    font-size: 55px;
                    padding-top: 120px;
                }

                p {
                    margin: 8px;
                }
            }
        }

    }

    .explain {
        position: fixed;
        right: 15px;
        // bottom: 580px;
        bottom: 15%;

        text-align: center;

        img {
            width: 55px;
            height: 55px;
        }
    }

}

table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
    font-size: 25px;
}

th {
    // background-color: #f2f2f2;
    background-color: aliceblue;

}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

thead th {
    font-size: 30px;
    text-align: center;
}

.chongzhi {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 110px;

    p {
        text-align: center;
        font-size: 55px;
        line-height: 110px;
        color: #fff;
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
    margin-left: 20px;
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
        width: 240px;
        height: 180px;
        color: rgb(12, 149, 255);
        // background: linear-gradient(to bottom, rgb(254, 226, 88), rgb(250, 221, 170));

        border: 2px solid rgb(12, 149, 255);
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

.middle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100px;
    background-color: rgb(206, 227, 251);
    color: rgb(52, 109, 197);

    span {
        padding: 20px;
        font-size: 30px;
    }
}
</style>