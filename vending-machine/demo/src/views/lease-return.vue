<template>
    <div class="leaseReturn">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- 有在租订单：显示订单列表 + 归还 -->
            <div class="leaseBox" v-if="leaseOrders.length > 0">
                <div class="cheap">
                    <span>当前租赁中</span>
                </div>
                <div class="leaseOrder" v-for="(order, index) in leaseOrders" :key="index">
                    <img :src="order.picUrl || zuLinImg" @error="handleImgError" alt="">
                    <p class="goodsName">{{ order.goodsName }}</p>
                    <p>货道：{{ order.aisleName }}</p>
                    <p>租金：￥{{ toyuan(order.rentPricePerMinute) }}/分钟</p>
                    <p>定金：￥{{ toyuan(order.depositFee) }}</p>
                    <p>开始时间：{{ order.startTime }}</p>
                    <button class="returnBtn" @click="onConfirmReturn(order)">确认归还</button>
                </div>
            </div>
            <!-- 无在租订单：空状态 -->
            <div class="leaseBox" v-else>
                <div class="null">
                    <img :src="zuLinImg" alt="">
                    <p>当前暂无在租设备</p>
                </div>
            </div>
        </van-pull-refresh>
        <!-- 去借设备 -->
        <button class="goBorrow" @click="goBorrow">去借设备</button>

        <!-- 底部导航：借 / 还 -->
        <van-tabbar route>
            <van-tabbar-item replace to="/home/index" icon="shop-o">租借</van-tabbar-item>
            <van-tabbar-item replace to="/home/leaseReturn" icon="logistics">归还</van-tabbar-item>
        </van-tabbar>

        <van-popup class="van-popup-load" :overlay="false" style="--van-popup-background: rgba(0, 0, 0, 0)"
            v-model:show="showLoading">
            <van-loading type="spinner" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router"
import { showToast, showDialog, showConfirmDialog } from 'vant'
import { v3PlayerProfileAPI, LeaseEntryAPI, ConfirmReturnAPI } from '../api/index'
import zuLinImg from '../static/img/ZuLin.jpg'

const router = useRouter()
const showLoading = ref(false)
const leaseOrders = ref([])
const machineId = ref('')
const refreshing = ref(false)

// 租赁商品图片加载失败时使用默认图：
const handleImgError = (e) => {
    e.target.src = zuLinImg
}

// 加载玩家数据（取机器ID），再查在租订单：
const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI().then((res) => {
        if (res.data.code == 200) {
            machineId.value = res.data.data.machineId
            getLeaseEntry(machineId.value)
        } else {
            showLoading.value = false;
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;
    });
}

// 查询在租订单：
const getLeaseEntry = async (id, withLoading = true) => {
    if (withLoading) showLoading.value = true;
    await LeaseEntryAPI({
        machineId: id
    }).then((res) => {
        if (withLoading) showLoading.value = false;
        if (res.data.code == 200) {
            leaseOrders.value = res.data.data.orders || []
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        if (withLoading) showLoading.value = false;
    });
}

// 下拉刷新在租订单：
const onRefresh = () => {
    getLeaseEntry(machineId.value, false).finally(() => {
        refreshing.value = false;
    });
}

// 点击确认归还：先提示放回原行列：
const onConfirmReturn = (order) => {
    showConfirmDialog({
        title: '归还确认',
        message: '请将「' + order.goodsName + '」放回 ' + order.aisleName + ' 货道',
        confirmButtonText: '已放回',
        cancelButtonText: '取消'
    }).then(() => {
        confirmReturn(order)
    }).catch(() => {
        // 用户取消
    });
}

// 调归还接口并展示结算明细：
const confirmReturn = async (order) => {
    showLoading.value = true;
    await ConfirmReturnAPI({
        machineId: machineId.value,
        leaseOrderIds: [order.leaseOrderId]
    }).then((res) => {
        showLoading.value = false;
        if (res.data.code == 200) {
            const data = res.data.data || {}
            let msg = data.message || '归还已处理'
            if (data.rentMinutes != null) {
                msg += '<br/>租用时长：' + data.rentMinutes + ' 分钟'
            }
            if (data.rentFee != null) {
                msg += '<br/>租金：￥' + toyuan(data.rentFee)
            }
            if (data.refundFee != null) {
                msg += '<br/>退还定金：￥' + toyuan(data.refundFee)
            }
            showDialog({
                title: '归还成功',
                message: msg,
                allowHtml: true
            }).then(() => {
                getPost()
            });
        } else {
            showToast(res.data.message);
        }
    }).catch((error) => {
        showLoading.value = false;
    });
}

// 分转化成元：
const toyuan = (points) => {
    return points * 0.01;
}

// 去借设备：跳转借设备页面：
const goBorrow = () => {
    router.replace({ path: '/home/index' })
}

onMounted(() => {
    getPost()
})
</script>

<style scoped lang="less">
.leaseReturn {
    padding-bottom: 100px;

    .goBorrow {
        display: block;
        margin: 30px auto 0;
        width: 400px;
        height: 80px;
        border: none;
        border-radius: 30px;
        background-color: rgb(93, 195, 255);
        color: #fff;
        font-size: 30px;
    }
}

.leaseBox {
    background-color: #fff;
    margin-top: 3%;
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

    .leaseOrder {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;

        img {
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }

        p {
            font-size: 30px;
            margin-top: 15px;
        }

        .goodsName {
            font-weight: 600;
            font-size: 34px;
        }
    }

    .returnBtn {
        margin-top: 30px;
        width: 400px;
        height: 80px;
        border: none;
        border-radius: 30px;
        background-color: rgb(251, 83, 34);
        color: #fff;
        font-size: 30px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .null {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        text-align: center;

        img {
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }

        p {
            font-size: 30px;
            color: #969799;
            margin-top: 15px;
        }
    }
}
</style>
