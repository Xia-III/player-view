<template>
  <div class="coinerMain">
    <div class="user">
      <ul>
        <li>
          <img :src="avatar" alt="" />
          <div>
            <p>会员：{{ playerId }}</p>
            <p>场地：{{ addressName }}</p>
          </div>
          <div>
            <p class="yellow">余珠：{{ marblesQty / 100 }}</p>
            <p>余币：{{ coinsBind / 100 }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="main">
      <div class="coin-operate">
        <van-field
          v-model="coinCount"
          type="digit"
          :label="ticketType == 0 ? '取币数量' : '取珠数量'"
          :placeholder="ticketType == 0 ? '请输入取币数量' : '请输入取珠数量'"
          input-align="right"
        />
        <van-button
          color="#2fb2ff"
          block
          class="submit-btn"
          @click="handleCoinOut"
        >
          {{ ticketType == 0 ? "立即取币" : "立即取珠" }}
        </van-button>
      </div>
    </div>
  </div>

  <van-popup
    class="van-popup-load"
    :overlay="false"
    style="--van-popup-background: rgba(0, 0, 0, 0)"
    v-model:show="showLoading"
  >
    <van-loading type="spinner" />
  </van-popup>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { showToast } from "vant";
import { v3PlayerProfileAPI, v3PlayerGetCoinAPI } from "../api/index";
import {
  v3PlayerProfilemarblesAPI,
  v3PlayerGetCoinmarblesAPI,
} from "../api/indexMarbles";

const router = useRouter();
const route = useRoute();
const showLoading = ref(false);

const arrowicon = ref("arrow-down");

const avatar = ref(null);
const nickname = ref(null);
const playerId = ref(null);
const coinFee = ref(null);
const coins = ref(null);
const coinsBind = ref(null);
const addressId = ref(null);
const machineId = ref(null);
const remark = ref(null);
const addressName = ref(null);
const payCtrlMode = ref(null);
const agencyId = ref(null);
const servicePhone = ref("");
const name = ref("");
const coinCount = ref("");
const ticketType = ref(0);
const marblesQty = ref(null);
if (route.query.machineId) {
  machineId.value = route.query.machineId;
}
if (route.query.ticketType) {
  ticketType.value = Number(route.query.ticketType);
}
const handleCoinOut = () => {
  if (!coinCount.value) {
    showToast(ticketType.value == 0 ? "请输入取币数量" : "请输入取珠数量");
    return;
  }
  if (ticketType.value == 0) {
    v3PlayerGetCoinAPI({
      machineId: machineId.value,
      coins: Number(coinCount.value),
      ticketType: ticketType.value,
    })
      .then((res) => {
        if (res.data.code == 200) {
          showToast("取币成功");
          coinCount.value = "";
          getPost();
        } else {
          showToast(res.data.message);
        }
      })
      .catch((error) => {});
  } else {
    v3PlayerGetCoinmarblesAPI({
      machineId: machineId.value,
      coins: Number(coinCount.value),
      ticketType: ticketType.value,
    })
      .then((res) => {
        if (res.data.code == 200) {
          showToast("取珠成功");
          coinCount.value = "";
          getPost();
        } else {
          showToast(res.data.message);
        }
      })
      .catch((error) => {});
  }
};

// const playerProfile = ref({})
// 页面创建时加载玩家数据：
const getPost = async () => {
  showLoading.value = true;
  await v3PlayerProfileAPI()
    .then((res) => {
      showLoading.value = false;
      if (res.data.code == 200) {
        console.log(res.data.data);
        // if (res.data.data.isOnLine == 0) {
        //   //离线
        //   router.push({
        //     path: "/hint",
        //   });
        // }

        // if (res.data.data.status == 1) {
        //   //关闭设备，离线
        //   router.push({
        //     path: "/hint",
        //   });
        // }

        // if (res.data.data.shopMode == 1) {
        //   sessionStorage.setItem("shopMode", 1);
        //   router.push({
        //     path: "/hint",
        //   });
        // } else {
        //   sessionStorage.setItem("shopMode", 0);
        // }
        avatar.value = res.data.data.avatar;
        nickname.value = res.data.data.nickname;
        playerId.value = res.data.data.playerId;
        coinFee.value = res.data.data.coinFee;
        coins.value = res.data.data.coins;
        coinsBind.value = res.data.data.coinsBind;
        addressId.value = res.data.data.addressId;
        machineId.value = res.data.data.machineId;
        remark.value = res.data.data.remark;
        addressName.value = res.data.data.addressName;
        payCtrlMode.value = res.data.data.payCtrlMode;
        agencyId.value = res.data.data.agencyId;
        servicePhone.value = res.data.data.servicePhone;
        name.value = res.data.data.name;
        marblesQty.value = res.data.data.marblesQty;
      } else {
        showToast(res.data.message);
      }
    })
    .catch((error) => {
      // showLoading.value = false;
    });
};
getPost();

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
});
</script>
<style scoped lang="less">
.coinerMain {
  overflow-y: scroll;
}

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
  margin-top: 1.25rem;
  margin-left: 8%;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 50px;

  .coin-operate {
    width: 100%;

    .van-cell {
      padding: 20px 0;
      font-size: 32px;

      :deep(.van-field__label) {
        width: auto;
        margin-right: 20px;
      }
    }

    .submit-btn {
      margin-top: 40px;
      height: 88px;
      font-size: 32px;
      border-radius: 44px;
    }
  }

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
</style>
