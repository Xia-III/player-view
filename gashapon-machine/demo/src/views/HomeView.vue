<template>
  <div class="home">
    <div class="row">
      <van-cell-group class="home-row-warp">
        <van-cell class="home-col" title="付款给商家" :label="name">
          <template #right-icon>
            <van-icon name="shop" class="shop-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-form @submit="onSubmit" class="row">
      <van-cell-group class="row-group">
        <van-field v-model="payFee" label="实付金额" placeholder="金额" readonly maxlength="9">
        </van-field>
        <div class="my-btn">
          <van-button class="btn" block type="success" native-type="submit">确认付款</van-button>
        </div>
      </van-cell-group>
    </van-form>

    <van-cell-group class="pay-col">
      <van-cell class="col-cell" title="" :value="`实付金额：￥${payFee}`" />
      <p class="refund">如付款错误，请立即截图付款详情，联系商家进行退款，谢谢惠顾！</p>
    </van-cell-group>
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
    <van-popup v-model:show="showLoading" :overlay="false" class="van-popup-load">
      <van-loading size="24px" color="#1989fa" vertical>加载中...</van-loading>
    </van-popup>
  </div>
</template>

<script setup>
import {
  v3PlaceOrderAPI, v3PlayerProfileAPI
} from '../api/index'

import { useRouter } from "vue-router"

import { ref, onMounted } from 'vue';
import { showToast, showDialog, showConfirmDialog } from 'vant'
const router = useRouter()
const showLoading = ref(false);

const fee = ref('');
const name = ref('');
const servicePhone = ref('')
const money = ref('');
const addressId = ref(null)
const machineId = ref(null)
const payFee = ref('0');
const extId = ref()
const starterMachineId = ref('')
money.value = localStorage.getItem('shop_sFee') / 100;
payFee.value = localStorage.getItem('shop_sFee') / 100;
extId.value = localStorage.getItem('shop_sExtId');
starterMachineId.value = localStorage.getItem('shop_starterMachineId').substring(4)

// 加载场地数据：
const getPost = async () => {
  showLoading.value = true;
  await v3PlayerProfileAPI().then((res) => {
    showLoading.value = false;
    if (res.data.code == 200) {
      console.log(res.data.data);
      name.value = res.data.data.addressName
      servicePhone.value = res.data.data.servicePhone
      addressId.value = res.data.data.addressId
      machineId.value = res.data.data.machineId
    } else {
      showToast(res.data.message);
    }
  }).catch((error) => {
    // showLoading.value = false;

  });
}
getPost()

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
// 乘法
const numberMul = (arg1, arg2) => {//乘法精准计算
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) { }
  try {
    m += s2.split(".")[1].length;
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};


//确认付款
const onSubmit = async () => {
  showLoading.value = true;
  if (extId.value == null || extId.value == undefined || extId.value == '') {
    extId.value = 0
  }
  const num = 100;
  fee.value = numberMul(payFee.value, num);
  // let frontUrls = 'https://www.huanxizn.com/newGashapon/#/paycoins/?machineId' + `${starterMachineId.value}` + '&extId=' + `${extId.value}` + '&fee=' + `${fee.value}`

  console.log(fee.value);
  await v3PlaceOrderAPI({
    machineId: starterMachineId.value,
    rechargeConfigId: 0,
    rechargeType: 0,
    rechargeDataSource: 2,
    extMode: extId.value,
    frontUrl: 'https://www.huanxizn.com/newGashapon/#/homeView',
    fee: fee.value
  }).then((res) => {
    showLoading.value = false;
    if (res.data.code == 200) {
      location.href = res.data.data;
    } else {
      showToast(res.data.message);
    }
  }).catch((error) => {
    showLoading.value = false;
  });
}

</script>

<style scoped lang="less">
.home {
  background-color: #f1f1f1;
  width: 100%;
  height: 100vh;

  .row {
    padding-top: 30px;

    .home-row-warp {
      margin: 0 8px;
      background: none;

      .home-col {
        background: none;

        .shop-icon {
          margin-top: 10px;
          width: 70px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          border-radius: 50%;
          background-color: #10bc12;
          color: #fff;
          font-size: 38px;
        }
      }
    }

    .row-group {
      padding: 24px 0 8px;
      border-top-left-radius: 26px;
      border-top-right-radius: 26px;

      .plus-icon {
        border: 1px solid rgb(236, 155, 79);
        border-radius: 50%;
        padding: 2px;
        text-align: center;
        font-size: 24px;
        color: rgb(236, 155, 79);
        margin-right: 6px;
      }

      .add-message {
        font-size: 24px;
      }

      .my-btn {
        margin: 20px 16px;

        .btn {
          border-radius: 6px;
        }
      }
    }
  }

  .pay-col {
    background: none;

    .col-cell {
      background: none;
      font-size: 26px;
    }

    .refund {
      margin-top: -5px;
      padding: 0 12px;
      font-size: 24px;
      text-align: center;
      color: rgb(236, 155, 79);
    }
  }

  .pop-text {
    .explain {
      .col-exp::after {
        border: none;
      }

      .mesg-text {
        background: #f5f5f5;
        width: 90%;
        margin: 0 auto;
        border-radius: 10px;
      }

      .van-hairline--top-bottom:after {
        border: none;
      }

      .exp-btn {
        width: 70%;
        margin: 50px auto 0;
        display: flex;
        justify-content: space-evenly;

        .van-button {
          width: 36%;
          border-radius: 12px;
        }

        .van-button:first-child {
          background: #f2f2f2;
          color: #10bc12;
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
}
</style>
