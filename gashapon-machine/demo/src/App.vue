<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup>
import { showToast } from "vant";
import { getCurrentInstance, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const { proxy } = getCurrentInstance()
const getUrlParam = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

const inCheckPayed = () => {
  let url = location.href;
  let url1 = (url.indexOf("/login") != -1);
  if (url1 == false) {
    try {
      proxy.$connection.start().then(() => {  //开始连接
        //   let orderId = this.getUrlParam('orderId');
        //   if (orderId) {
        //     proxy.$connection.invoke("CheckPayed", {
        //       orderId: orderId
        //     }).then((res) => {//支付结果
        //       if (res.code == 200) {
        //         showToast("充值成功");
        //         setTimeout(() => {
        //           window.location.href = 'https://www.huanxizn.com/newGashapon/#/toLogin'
        //         }, 100);
        //       } else {
        //         showToast(res.message);
        //       }
        //     }).catch((err) => {
        //       showToast("支付查询失败！");
        //     });
        //   }
        proxy.$connection.on("OnClawcraneReturn", (res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.isSuccess) {
              showDialog({
                message: res.message,
              }).then(() => {
                // on close
              });
            } else {
              showDialog({
                message: res.message,
              }).then(() => {
                // on close
              });
            }
          } else {
            showToast(res.message);
          }
        });
      }).catch((err) => {
        // showToast("通讯连接失败");
      })
    } catch (err) {
      //第一次连接失败，5000毫秒无限重连
      setTimeout(() => this.inCheckPayed(), 5000);
    }
  }
  //  else {
  //   proxy.$connection.stop().then(() => {
  //     //断开连接
  //   });
  // }
}
onMounted(() => {
  inCheckPayed()
})


</script>
<style lang="less">
html,
body {
  background-color: #f1f1f1;
  padding: 0;

  // padding-bottom: 140px;
  // background-color: #f1f1f1;
  .van-overflow-hidden {
    overflow: visible !important;
    overflow-x: visible !important;
    overflow-y: visible !important;
  }
}
</style>
