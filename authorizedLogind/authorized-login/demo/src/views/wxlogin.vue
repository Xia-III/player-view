<template>
  <div class="wxlogin">
    <div class="info-list" v-if="showInfo">
      <van-icon name="info" />
      <p>请用支付宝或微信打开本页面</p>
    </div>
    <div class="weixin-con" v-if="weixinShow">
      <div class="bg-top">
        <img class="img-logo" src="../static/img/login.jpg" />
        本商城需要获取用户头像与昵称，用于授权登录，请确认是否授权。
      </div>
      <van-button
        class="info-btn"
        :disabled="disType"
        type="primary"
        @click="wxGetCode"
        >确认授权</van-button
      >
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
import { PlayerTicketAuthAPI } from "../api/index";
import { PlayerTicketAuthmarblesAPI } from "../api/indexMarbles";
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setStorageExpire, getStorageExpire } from "../utils/storage";
import { showDialog, showToast } from "vant";
import ap from "../utils/alipayjsapi.min.js";

// 旧的：
const getUrlParam = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

const router = useRouter();
const route = useRoute();
const showLoading = ref(false);
const APPID = "wx7f23f819116cc247";
const showInfo = ref(false);
const weixinShow = ref(false);
const disType = ref(false);
const ticketId = ref(0);
const ticketType = ref(0);
const machineId = ref(0);

ticketId.value = localStorage.getItem("shop_ticketId");

const isButtonDisabled = ref(false);

const getOpenId = async (code) => {
  if (isButtonDisabled.value) return;
  isButtonDisabled.value = true;
  if (
    ticketId.value == null ||
    ticketId.value == undefined ||
    ticketId.value == "null"
  ) {
    ticketId.value = 0;
    isButtonDisabled.value = false;
  }

  ticketType.value = localStorage.getItem("shop_ticketType") ?? 0;
  showLoading.value = true;
  if (ticketType.value == 0) {
    await PlayerTicketAuthAPI({
      code: code,
      loginTicketId: ticketId.value,
    })
      .then((res) => {
        showLoading.value = false;
        console.log(res.data);

        isButtonDisabled.value = false;
        // const host = window.location.host;
        // window.location.href = "https://" + host + "/newcoiner/#/toLogin";

        if (res.data.code == 200) {
          localStorage.setItem("coiner_heardTokenStarter", res.data.data.token);

          ticketType.value = res.data.data.ticketType;
          machineId.value = res.data.data.machineId;
          router.replace({
            path: "/index",
            query: {
              ticketType: ticketType.value,
              machineId: machineId.value,
            },
          });
        } else {
          router.replace({
            path: "/qrcodeView",
            query: {
              code: res.data.code,
              message: res.data.message,
            },
          });
        }
      })
      .catch((error) => {
        showLoading.value = false;
        isButtonDisabled.value = false;
      });
  } else {
    await PlayerTicketAuthmarblesAPI({
      code: code,
      loginTicketId: ticketId.value,
    })
      .then((res) => {
        showLoading.value = false;
        console.log(res.data);

        isButtonDisabled.value = false;
        // const host = window.location.host;
        // window.location.href = "https://" + host + "/newcoiner/#/toLogin";

        if (res.data.code == 200) {
          localStorage.setItem("coiner_heardTokenStarter", res.data.data.token);

          ticketType.value = res.data.data.ticketType;
          machineId.value = res.data.data.machineId;
          router.replace({
            path: "/index",
            query: {
              ticketType: ticketType.value,
              machineId: machineId.value,
            },
          });
        } else {
          router.replace({
            path: "/qrcodeView",
            query: {
              code: res.data.code,
              message: res.data.message,
            },
          });
        }
      })
      .catch((error) => {
        showLoading.value = false;
        isButtonDisabled.value = false;
      });
  }
};

// 支付宝打开调用
const apGetCode = () => {
  // alert('789')
  ap.getAuthCode(
    {
      appId: "2021004118610049",
      scopes: ["auth_user"],
    },
    (res) => {
      // ap.alert(res.error)
      if (res.error == 11) {
        showToast(res.errorMessage);
      } else {
        // ap.alert('123')
        getOpenId(res.authCode);
      }
    }
  );
};

// 微信打开时调用：
const wxGetCode = async () => {
  let code = getUrlParam("code");
  // console.log(code);
  // let code = '071Ljh1w3NSEk13L3h0w3Ysgo13Ljh1a'; // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
  const local = window.location.href; //获取当前页面的url
  disType.value = true;
  if (code == null || code === "") {
    window.location.href =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      APPID +
      "&redirect_uri=" +
      encodeURIComponent(local) +
      "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
  } else {
    await getOpenId(code); //把code传给后台获取用户信息
    code = "";
    // sessionStorage.setItem('code', code);
    // window.location.href = "http://localhost:8080/#/home";
  }
};

onMounted(() => {
  var ua = window.navigator.userAgent.toLowerCase();

  // 判断是用微信还是支付宝打开的
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //微信内置浏览器
    // wxGetCode();
    showInfo.value = false;
    weixinShow.value = true;
    let code = getUrlParam("code");
    if (code) {
      getOpenId(code); //把code传给后台获取用户信息
    }
  } else if (ua.match(/AlipayClient/i) == "alipayclient") {
    //支付宝内置浏览器
    // alert('456')
    apGetCode();
    // alert('9')
    showInfo.value = false;
    weixinShow.value = false;
  } else {
    showToast("请用支付宝或者微信打开本页面");
    showInfo.value = true;
    weixinShow.value = false;
  }
});
</script>
<style scoped lang="less">
.wxlogin {
  .info-list {
    padding-top: 0.95rem;
    text-align: center;

    .van-icon-info:before {
      font-size: 1.95rem;
      color: #10aeff;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 0.5rem;
    }
  }

  .weixin-con {
    width: 100%;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .bg-top {
      text-align: center;
      color: #1989fa;
      font-size: 34px;

      .img-logo {
        width: 15%;
        display: block;
        margin: -2rem auto 0.3rem;
      }
    }

    .info-btn {
      width: 90%;
      font-size: 0.38rem;
      line-height: 1.08rem;
      height: 1.08rem;
      border-radius: 0.23rem;
      margin-top: 0.65rem;
    }
  }
}
</style>
