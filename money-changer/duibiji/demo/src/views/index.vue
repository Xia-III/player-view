<template>
  <div class="coinerMain">
    <div class="user">
      <div class="topmachine" @click="showchooseM">
        <p class="id">ID :{{ agencyId }}</p>
        <p>{{ name == null || name == "" ? "普通机器" : name }}</p>
        <p>
          {{ machineId
          }}<span
            v-if="
              extId + 1 != null &&
              extId + 1 != 0 &&
              extId + 1 != 'NaN' &&
              extId != 'undefined'
            "
            >-{{ Number(extId) + 1 }}</span
          >
        </p>
        <div>
          <span class="span1">|</span>
          <van-icon :name="arrowicon" />
        </div>
      </div>
      <ul>
        <li>
          <img :src="avatar" alt="" />
          <div>
            <p>会员：{{ playerId }}</p>
            <p>场地：{{ addressName }}</p>
          </div>
          <div v-if="isCoin == false">
            <p class="yellow">余额：{{ coins / 100 }}</p>
            <p>币数：{{ coinsBind / coinFee }}</p>
          </div>
          <div v-else>
            <p class="yellow">
              余币：{{ Math.floor((coins + coinsBind) / 100) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <van-popup
      class="showmachine"
      @click-overlay="arrowicon = 'arrow-down'"
      v-model:show="showBottom"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-divider
        :style="{ color: '#188aff', borderColor: '#1989fa', padding: '0 16px' }"
      >
        总共{{ machineList.length }}台-请选择机器
      </van-divider>
      <van-radio-group v-model="checked">
        <van-cell-group inset>
          <van-cell
            :title="
              (item.name == null || item.name == '' ? '普通机器' : item.name) +
              ' - ' +
              item.machineId
            "
            clickable
            @click="changeCheck(item)"
            v-for="(item, index) in machineList"
            :key="item.machineId"
          >
            <template #right-icon>
              <van-radio :name="item.machineId" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>

    <div class="main">
      <div
        class="coinPlan"
        v-if="coinInPlanList.length > 0"
        v-for="item in coinInPlanList"
        :key="item.coinInPlanId"
        @click="onInsertCoins(item, playerProfile)"
      >
        <div
          class="coinPlan"
          v-if="
            (coins >= item.coins && coins > 0) ||
            (coinsBind >= item.coins && coinsBind > 0)
          "
        >
          <!-- <div>{{ item.fee }}元</div> -->
          <div class="yuan">{{ item.coins }}币</div>
        </div>
        <div
          class="coinPlan"
          v-if="coins < item.coins && coinsBind < item.coins"
        >
          <!-- <div>{{ toyuan(item.fee) }}元</div> -->
          <!-- <div>{{ item.fee / 100 }}元</div> -->
          <div>{{ parseFloat(toyuan(item.fee).toPrecision(12)) }}元</div>

          <div class="yuan">{{ item.coins }}币</div>
        </div>
      </div>
      <div class="null" v-else>暂无投币套餐</div>
    </div>
    <div
      class="hand-output-container"
      v-if="coins > 0 || coinsBind / coinFee > 0 || coins + coinsBind > 0"
    >
      <div class="hand-output">可自定义出币数 🤜</div>
      <button class="yellow-button" @click="onClickCoins()">点击输入</button>
    </div>
  </div>
  <!-- 投诉按钮 -->
  <!-- <div style="position: fixed;right: 10px;bottom: 20%; text-align: center;">
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
        <div v-if="showPopup" class="overlay" @click="showPopup = false"></div>
    </div> -->
  <!-- 侧边功能栏 -->
  <div class="floating-menu">
    <div class="menu-item" @click="handleScanClick">
      <van-icon name="scan" size="30" color="#1989fa" />
      <span class="menu-text">扫码核销</span>
    </div>
    <div class="divider"></div>
    <div class="menu-item" style="position: relative">
      <div @click="openComplain" class="menu-content">
        <van-icon name="service" size="30" color="#1989fa" />
        <span class="menu-text">留言投诉</span>
      </div>
      <div v-if="showPopup" class="popup-box" @click.stop>
        <p class="popup-text" @click="toKefu">客服电话</p>
        <p class="popup-text" @click="returnBack">意见反馈</p>
      </div>
    </div>
    <!-- 点击其他区域关闭弹窗 -->
    <div v-if="showPopup" class="overlay" @click="showPopup = false"></div>
  </div>
  <van-dialog
    v-model:show="insertCoins"
    title="出币数量"
    @confirm="yesInsertCoins"
    show-cancel-button
  >
    <div style="padding: 15px">
      <van-field
        v-model="outCoins"
        type="digit"
        label="币数："
        placeholder="请输入币数"
        v-on:input="inputMoneyListern(outCoins)"
      />
    </div>
  </van-dialog>
  <van-action-sheet
    v-model:show="showScanActionSheet"
    :actions="scanActions"
    cancel-text="取消"
    close-on-click-action
    @select="onSelectScanAction"
  />
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
import { showToast, showDialog, showConfirmDialog } from "vant";
import {
  v3PlayerProfileAPI,
  v3PlayerCoinInPlanAPI,
  v3PlayerMachineListAPI,
  v3PlayerCoinInAPI,
  v3PlayerPlaceOrderAPI,
  JsApiConfigAPI,
  DouYinVerifyAPI,
} from "../api/index";
const router = useRouter();
const route = useRoute();
const showLoading = ref(false);
const chooseMachine = ref("");
const nowmachineId = ref(null);
const extId = ref();
extId.value = localStorage.getItem("shop_sExtId");
if (
  extId.value == null ||
  extId.value == 0 ||
  extId.value == "NaN" ||
  extId.value == "undefined"
) {
  extId.value = 0;
}
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
const name = ref("");
const servicePhone = ref("");
const isCoin = ref(false); // 判断是否为充币

const showPopup = ref(false);
const openComplain = () => {
  showPopup.value = !showPopup.value;
};
const toKefu = () => {
  location.href = "tel:" + servicePhone.value;
};

// 意见反馈
const returnBack = () => {
  router.push({
    path: "/messageBoard",
    query: {
      addressId: addressId.value,
      machineId: machineId.value,
    },
  });
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
        if (res.data.data.isOnLine == 0) {
          //离线
          router.push({
            path: "/hint",
          });
        }

        if (res.data.data.status == 1) {
          //关闭设备，离线
          router.push({
            path: "/hint",
          });
        }

        if (res.data.data.shopMode == 1) {
          sessionStorage.setItem("shopMode", 1);
          router.push({
            path: "/hint",
          });
        } else {
          sessionStorage.setItem("shopMode", 0);
        }
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
        isCoin.value = res.data.data.isCoin;

        getCoinInPlan(res.data.data.addressId);
      } else {
        showToast(res.data.message);
      }
    })
    .catch((error) => {
      // showLoading.value = false;
    });
};
getPost();

// 页面创建时加载投币列表数据：
const coinInPlanList = ref([]);
const getCoinInPlan = async (addressId) => {
  showLoading.value = true;
  await v3PlayerCoinInPlanAPI({
    addressId: addressId,
  })
    .then((res) => {
      showLoading.value = false;
      if (res.data.code == 200) {
        console.log(res.data);
        coinInPlanList.value = res.data.data;
        console.log(coinInPlanList.value);
      } else {
        showToast(res.data.message);
      }
    })
    .catch((error) => {
      // showLoading.value = false;
    });
};

// 点击加载机器列表
const showBottom = ref(false);
const machineList = ref([]);
const showchooseM = async () => {
  showLoading.value = true;
  await v3PlayerMachineListAPI({
    addressId: addressId.value,
  })
    .then((res) => {
      showLoading.value = false;
      if (res.data.code == 200) {
        console.log(res.data);
        machineList.value = res.data.data;
      } else {
        showToast(res.data.message);
      }
    })
    .catch((error) => {
      // showLoading.value = false;
    });
  showBottom.value = true;
  arrowicon.value = "arrow-up";
};
// 选择机器：
const checked = ref(0);
const changeCheck = (item) => {
  checked.value = item.machineId;
  // console.log(item);
  showBottom.value = false;
  name.value = item.name;
  machineId.value = item.machineId;
  arrowicon.value = "arrow-down";
};
// 投币：
// const onInsertCoins = (item) => {
//     console.log(item);
//     if (machineId == null) {
//         showToast('请先选择要投币的机器');
//         return false;
//     }
//     showConfirmDialog({
//         title: '温馨提示',
//         message:
//             '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + (extId.value + 1) + '</span>号机前</span>',
//         allowHtml: true
//     })
//         .then(async () => {
//             // on confirm
//             // console.log(coins.value);
//             // if ((coins.value >= item.coins && coins.value > 0) || (coinsBind.value >= item.coins && coinsBind.value > 0)) { //默认投币
//             //     showLoading.value = true;
//             //     console.log('余币多');
//             //     console.log(machineId.value);
//             //     console.log(extId.value);
//             //     console.log(item.coins);
//             //     await v3PlayerCoinInAPI({
//             //         machineId: machineId.value,
//             //         extId: extId.value,
//             //         coins: item.coins
//             //     }).then((res) => {
//             //         showLoading.value = false;
//             //         if (res.data.code == 200) {
//             //             console.log(res.data);
//             //             coins.value = Math.floor(res.data.data.coins / coinFee.value);
//             //             coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
//             //             showDialog({
//             //                 message: name.value + machineId.value + '投' + item.coins + '币成功'

//             //             }).then(() => {
//             //                 // on close
//             //             });

//             //         } else {
//             //             showDialog({
//             //                 title: '错误提示',
//             //                 message: res.data.message,
//             //                 confirmButtonText: '我知道了'
//             //             }).then(() => {

//             //             });
//             //         }
//             //     }).catch((error) => {
//             //         showLoading.value = false;

//             //     });
//             // }
//             // else if (coins.value < item.coins && coinsBind.value < item.coins) { //即充即投
//             // showLoading.value = true;
//             // console.log(123);
//             // console.log('余币不足');
//             // console.log(machineId.value);
//             // console.log(extId.value);
//             // console.log(item.coins);
//             await v3PlayerPlaceOrderAPI({
//                 machineId: machineId.value,
//                 rechargeConfigId: item.coinInPlanId,//ID
//                 rechargeType: 0,//充值币
//                 extMode: extId.value,//充值分支号
//                 rechargeDataSource: 1,//0默认充值  1及充启动
//                 frontUrl: 'https://www.huanxizn.com/newcoiner/#/home/index'//支付完成后，前端跳转地址
//             }).then((res) => {
//                 showLoading.value = false;
//                 if (res.data.code == 200) {
//                     console.log(res.data);
//                     location.href = res.data.data
//                 } else {
//                     showToast(res.data.message);
//                 }
//             }).catch((error) => {
//                 showLoading.value = false;

//             });
//             //             }
//             //         })
//             //         .catch(() => {
//             //             // on cancel
//         });

//     //  router.push({
//     //                 path: '/coinSuccess',
//     //                 query: item
//     //             })
// }

const isButtonDisabled = ref(false); // 控制按钮状态
const onInsertCoins = async (item) => {
  if (isButtonDisabled.value) return;
  isButtonDisabled.value = true; //禁用
  console.log(item);
  if (machineId == null) {
    isButtonDisabled.value = false; // 恢复状态
    showToast("请先选择要投币的机器");
    return false;
  }

  if (isCoin.value === false) {
    //根据金额
    console.log("根据金额");

    var flag =
      (coins.value >= item.fee && coins.value > 0) ||
      (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0);
    showConfirmDialog({
      title: flag ? "当前使用余额或者余币支付" : "在线支付",
      message:
        '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' +
        name.value +
        machineId.value +
        "-" +
        `${Number(extId.value) + 1}` +
        "</span>号机前</span>",
      allowHtml: true,
    })
      .then(async () => {
        showLoading.value = true;
        if (
          (coins.value >= item.fee && coins.value > 0) ||
          (coinsBind.value / coinFee.value >= item.coins && coinsBind.value > 0)
        ) {
          console.log("余币多");
          console.log(machineId.value);
          console.log(extId.value);
          console.log(item.coins);
          await v3PlayerCoinInAPI({
            machineId: machineId.value,
            extId: extId.value,
            coins: item.coins,
            coinInPlanId: item.coinInPlanId,
          })
            .then((res) => {
              showLoading.value = false;
              if (res.data.code == 200) {
                getPost();
                showDialog({
                  message:
                    name.value + machineId.value + "出" + item.coins + "币成功",
                }).then(() => {
                  // on close
                  isButtonDisabled.value = false; // 恢复状态
                });
              } else {
                showDialog({
                  title: "错误提示",
                  message: res.data.message,
                  confirmButtonText: "我知道了",
                }).then(() => {
                  isButtonDisabled.value = false; // 恢复状态
                });
              }
            })
            .catch((error) => {
              showLoading.value = false;
            })
            .finally(() => {
              isButtonDisabled.value = false; // 无论成功或失败，启用按钮
            });
        } else {
          //即充即投
          isButtonDisabled.value = false; // 无论成功或失败，启用按钮

          showLoading.value = true;
          console.log(123);
          console.log("余币不足");
          console.log(machineId.value);
          console.log(extId.value);
          console.log(item.coins);
          await v3PlayerPlaceOrderAPI({
            machineId: machineId.value,
            rechargeConfigId: item.coinInPlanId, //ID
            rechargeType: 0, //充值币
            extMode: extId.value, //充值分支号
            rechargeDataSource: 1, //0默认充值  1及充启动
            frontUrl: "https://www.huanxizn.com/newcoiner/#/home/index", //支付完成后，前端跳转地址
          })
            .then((res) => {
              showLoading.value = false;
              if (res.data.code == 200) {
                // console.log(res.data);
                location.href = res.data.data;
              } else {
                showToast(res.data.message);
              }
            })
            .catch((error) => {
              showLoading.value = false;
            });
        }
      })
      .catch(() => {
        isButtonDisabled.value = false; // 恢复状态
      });
  } else {
    if (
      (coins.value + coinsBind.value >= item.coins && coins.value > 0) ||
      (coinsBind.value + coins.value >= item.coins && coinsBind.value > 0)
    ) {
      //默认投币
      showLoading.value = true;
      console.log("余币多");
      console.log(machineId.value);
      console.log(extId.value);
      console.log(item.coins);
      await v3PlayerCoinInAPI({
        machineId: machineId.value,
        extId: extId.value,
        coins: item.coins,
      })
        .then((res) => {
          showLoading.value = false;
          if (res.data.code == 200) {
            console.log(res.data);
            coins.value = Math.floor(res.data.data.coins);
            coinsBind.value = Math.floor(res.data.data.coinsBind);
            showDialog({
              message:
                name.value + machineId.value + "出" + item.coins + "币成功",
            }).then(() => {
              // on close
              isButtonDisabled.value = false; // 恢复状态
            });
          } else {
            showDialog({
              title: "错误提示",
              message: res.data.message,
              confirmButtonText: "我知道了",
            }).then(() => {
              isButtonDisabled.value = false; // 恢复状态
            });
          }
        })
        .catch((error) => {
          showLoading.value = false;
          isButtonDisabled.value = false; // 恢复状态
        });
    } else {
      //即充即投
      isButtonDisabled.value = false; // 恢复状态
      showLoading.value = true;
      console.log(123);
      console.log("余币不足");
      console.log(machineId.value);
      console.log(extId.value);
      console.log(item.coins);
      await v3PlayerPlaceOrderAPI({
        machineId: machineId.value,
        rechargeConfigId: item.coinInPlanId, //ID
        rechargeType: 0, //充值币
        extMode: extId.value, //充值分支号
        rechargeDataSource: 1, //0默认充值  1及充启动
        frontUrl: "https://www.huanxizn.com/newcoiner/#/home/index", //支付完成后，前端跳转地址
      })
        .then((res) => {
          showLoading.value = false;
          if (res.data.code == 200) {
            console.log(res.data);
            location.href = res.data.data;
          } else {
            showToast(res.data.message);
          }
        })
        .catch((error) => {
          showLoading.value = false;
        });
    }
  }
  // showConfirmDialog({
  //     title: '温馨提示',
  //     message:
  //         '<span class="block">您确定在<span style="color: rgb(7, 193, 96);">' + name.value + machineId.value + '-' + `${Number(extId.value) + 1}` + '</span>号机前</span>',
  //     allowHtml: true
  // })
  //     .then(async () => {
  //         console.log(coins.value);
  //         if ((coins.value + coinsBind.value >= item.coins && coins.value > 0) || (coinsBind.value + coins.value >= item.coins && coinsBind.value > 0)) { //默认投币
  //             showLoading.value = true;
  //             console.log('余币多');
  //             console.log(machineId.value);
  //             console.log(extId.value);
  //             console.log(item.coins);
  //             await v3PlayerCoinInAPI({
  //                 machineId: machineId.value,
  //                 extId: extId.value,
  //                 coins: item.coins
  //             }).then((res) => {
  //                 showLoading.value = false;
  //                 if (res.data.code == 200) {
  //                     console.log(res.data);
  //                     // coins.value = Math.floor(res.data.data.coins / coinFee.value);
  //                     // coinsBind.value = Math.floor(res.data.data.coinsBind / coinFee.value);
  //                     coins.value = Math.floor(res.data.data.coins);
  //                     coinsBind.value = Math.floor(res.data.data.coinsBind);
  //                     showDialog({
  //                         message: remark.value + machineId.value + '出' + item.coins + '币成功'

  //                     }).then(() => {
  //                         // on close
  //                         isButtonDisabled.value = false;    // 恢复状态

  //                     });

  //                 } else {
  //                     showDialog({
  //                         title: '错误提示',
  //                         message: res.data.message,
  //                         confirmButtonText: '我知道了'
  //                     }).then(() => {
  //                         isButtonDisabled.value = false;    // 恢复状态

  //                     });
  //                 }
  //             }).catch((error) => {
  //                 showLoading.value = false;
  //                 isButtonDisabled.value = false;    // 恢复状态

  //             });
  //         }
  //         else { //即充即投
  //             isButtonDisabled.value = false;    // 恢复状态
  //             showLoading.value = true;
  //             console.log(123);
  //             console.log('余币不足');
  //             console.log(machineId.value);
  //             console.log(extId.value);
  //             console.log(item.coins);
  //             await v3PlayerPlaceOrderAPI({
  //                 machineId: machineId.value,
  //                 rechargeConfigId: item.coinInPlanId,//ID
  //                 rechargeType: 0,//充值币
  //                 extMode: extId.value,//充值分支号
  //                 rechargeDataSource: 1,//0默认充值  1及充启动
  //                 frontUrl: 'https://www.huanxizn.com/newcoiner/#/home/index'//支付完成后，前端跳转地址
  //             }).then((res) => {
  //                 showLoading.value = false;
  //                 if (res.data.code == 200) {
  //                     console.log(res.data);
  //                     location.href = res.data.data
  //                 } else {
  //                     showToast(res.data.message);
  //                 }
  //             }).catch((error) => {
  //                 showLoading.value = false;

  //             });
  //         }
  //     })
  //     .catch(() => {
  //         // on cancel
  //         isButtonDisabled.value = false;    // 恢复状态

  //     });
};

const insertCoins = ref(false);
const outCoins = ref(1);
const isDisabled = ref(false);

const yesInsertCoins = async () => {
  if (outCoins.value <= 0) {
    showToast("出币数不能小于等于0");
    return;
  }
  if (isCoin.value === false) {
    //根据金额
    console.log("根据金额");
    if (
      (coins.value >= parseFloat((outCoins.value * 100).toPrecision(12)) &&
        coins.value > 0) ||
      (coinsBind.value / coinFee.value >= outCoins.value && coinsBind.value > 0)
    ) {
      console.log("余币多");
      console.log(machineId.value);
      console.log(extId.value);
      await v3PlayerCoinInAPI({
        machineId: machineId.value,
        extId: extId.value,
        coins: outCoins.value,
        // coinInPlanId: item.coinInPlanId
      })
        .then((res) => {
          showLoading.value = false;
          if (res.data.code == 200) {
            getPost();
            insertCoins.value = false;
            showDialog({
              message:
                name.value + machineId.value + "出" + outCoins.value + "币成功",
            }).then(() => {
              // on close
            });
            outCoins.value = 1;
          } else {
            showDialog({
              title: "错误提示",
              message: res.data.message,
              confirmButtonText: "我知道了",
            }).then(() => {});
            insertCoins.value = false;
          }
        })
        .catch((error) => {
          showLoading.value = false;
          insertCoins.value = false;
        })
        .finally(() => {});
    } else {
      showToast("余额不足，请充值");
      insertCoins.value = false;
    }
  } else {
    //根据币数
    if (
      (coins.value + coinsBind.value >= outCoins.value && coins.value > 0) ||
      (coinsBind.value + coins.value >= outCoins.value && coinsBind.value > 0)
    ) {
      //默认投币
      showLoading.value = true;
      console.log("余币多");
      console.log(machineId.value);
      console.log(extId.value);
      await v3PlayerCoinInAPI({
        machineId: machineId.value,
        extId: extId.value,
        coins: outCoins.value,
      })
        .then((res) => {
          showLoading.value = false;
          if (res.data.code == 200) {
            console.log(res.data);
            insertCoins.value = false;
            coins.value = Math.floor(res.data.data.coins);
            coinsBind.value = Math.floor(res.data.data.coinsBind);
            showDialog({
              message:
                name.value + machineId.value + "出" + outCoins.value + "币成功",
            }).then(() => {
              // on close
            });
            outCoins.value = 1;
          } else {
            showDialog({
              title: "错误提示",
              message: res.data.message,
              confirmButtonText: "我知道了",
            }).then(() => {});
            insertCoins.value = false;
          }
        })
        .catch((error) => {
          showLoading.value = false;
          insertCoins.value = false;
        });
    } else {
      showToast("币数不足，请充值");
      insertCoins.value = false;
    }
  }
};

const onClickCoins = () => {
  insertCoins.value = true;
};

const inputMoneyListern = (outCoins) => {
  if (coinsBind.value / coinFee.value > 0) {
    if (Number(outCoins) > Number(coinsBind.value / coinFee.value)) {
      showToast("出币数不能大于您充值的币数");
    }
  }

  if (coins.value > 0) {
    if (Number(outCoins) > Number(coins.value / 100)) {
      showToast("出币数不能大于金额");
    }
  }
};

const scanStatus = ref("idle"); // idle: 未扫码, scanning: 扫码中, verifying: 核销中, success: 核销成功, error: 核销失败
const showScanActionSheet = ref(false);
const scanActions = [
  { name: "抖音团购核销", value: "douyin" },
  {
    name: "美团团购核销",
    value: "meituan",
    disabled: true,
    subname: "敬请期待",
  },
];
const handleScanClick = () => {
  if (scanStatus.value === "scanning" || scanStatus.value === "verifying")
    return;
  showScanActionSheet.value = true;
};

const onSelectScanAction = (action) => {
  if (action.value === "douyin") {
    scanCode();
  } else if (action.value === "meituan") {
    // showToast('敬请期待');
  }
};

const shortUrl = ref("");

// 微信扫一扫配置
const wxConfig = (_appid, _timestamp, _nonceStr, _signature) => {
  wx.config({
    debug: false, // 开启调试模式
    appId: _appid,
    timestamp: _timestamp,
    nonceStr: _nonceStr,
    signature: _signature,
    jsApiList: [
      "checkJsApi",
      "scanQRCode", // 微信扫一扫接口
    ],
  });

  wx.error((res) => {
    // alert("配置验证失败: " + res.errMsg);
    showToast("配置验证失败: " + res.errMsg);
    scanStatus.value = "error";
  });

  wx.ready(() => {
    wx.checkJsApi({
      jsApiList: ["scanQRCode"],
      success: (res) => {},
      fail: (res) => {
        showToast("当前环境不支持扫码");
      },
    });
  });
};

const machines = ref();
// const isLoading = ref(false); // 使用 scanStatus 替代

const scanCode = async () => {
  // 页面点击扫码按钮
  if (scanStatus.value === "scanning" || scanStatus.value === "verifying") {
    return;
  }

  scanStatus.value = "scanning";
  showLoading.value = true;

  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    // 是微信端
    await JsApiConfigAPI({
      url: location.href,
    }).then(
      (res) => {
        if (res.data.code == 200) {
          wxConfig(
            res.data.data.appId,
            res.data.data.timestamp,
            res.data.data.nonceStr,
            res.data.data.signature
          );

          wx.scanQRCode({
            desc: "scanQRCode desc",
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
            scanType: ["qrCode"], // 扫二维码
            success: (res) => {
              let urlParams = getUrlParams(res.resultStr);
              if (urlParams && urlParams["shortUrl"]) {
                shortUrl.value = urlParams["shortUrl"];
                getDouYinVerify();
              } else {
                showToast("无法获取有效链接");
                scanStatus.value = "error";
                showLoading.value = false;
              }
            },
            fail: (res) => {
              scanStatus.value = "error";
              showLoading.value = false;
              showToast("扫码失败");
            },
            cancel: () => {
              scanStatus.value = "idle";
              showLoading.value = false;
              showToast("已取消扫码");
            },
            error: (res) => {
              scanStatus.value = "error";
              showLoading.value = false;
              if (res.errMsg.indexOf("function_not_exist") > 0) {
                showToast("版本过低请升级");
              }
            },
          });
        } else {
          showToast(res.data.message);
          scanStatus.value = "error";
          showLoading.value = false;
        }
      },
      (err) => {
        showLoading.value = false;
        scanStatus.value = "error";
        showToast("配置请求失败");
      }
    );
  } else {
    showLoading.value = false;
    showToast("请在微信客户端打开");
    scanStatus.value = "error";
  }
};

const getDouYinVerify = async () => {
  scanStatus.value = "verifying";
  showLoading.value = true;

  await DouYinVerifyAPI({
    machineId: machineId.value,
    shortUrl: shortUrl.value,
  })
    .then((res) => {
      showLoading.value = false;
      if (res.data.code == 200) {
        scanStatus.value = "success";
        showToast("核销成功");
      } else {
        scanStatus.value = "error";
      }

      router.replace({
        path: "/qrcodeView",
        query: {
          code: res.data.code,
          message: res.data.message,
        },
      });
    })
    .catch((error) => {
      showLoading.value = false;
      scanStatus.value = "error";
      showToast("核销请求异常");
    });
};
const getUrlParams = (val) => {
  let url = val; //获取url中"?"符后的字串
  let urlParams = new Object();
  if (url.indexOf("?") != -1) {
    //找到?，这样后面才可能有参数
    url = url.replace(/\?/g, "&"); //?号替换成&号
    let strs = url.split("&"); //分割成等号=键-值对
    for (let i = 0; i < strs.length; i++) {
      if (strs[i].indexOf("=") != -1) {
        let substrs = strs[i].split("=");
        urlParams[substrs[0]] = unescape(substrs[1]);
      }
    }
  }
  return urlParams;
};

// 分转化成元：
const toyuan = (points) => {
  var exchangeRate = 0.01; // 1分对应的元数，此处为0.01元
  var currency = points * exchangeRate; // 计算转化后的金额
  return currency;
};

const getIfOnLine = async () => {
  //判断是否离线
  showLoading.value = true;
  await v3PlayerProfileAPI()
    .then((res) => {
      showLoading.value = false;
      if (res.data.code == 200) {
        if (res.data.data.isOnLine == 0) {
          //离线
          router.push({
            path: "/hint",
          });
        }
      } else {
        showToast(res.data.message);
      }
    })
    .catch((error) => {
      // showLoading.value = false;
    });
};

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

const urlStr = ref("");
urlStr.value = location.href;
let index = urlStr.value.lastIndexOf("\/");
urlStr.value = urlStr.value.substring(index + 1, urlStr.value.length);
watch(
  //监测路由id的变化
  () => urlStr.value,
  (newurlStr) => {
    // console.log(newurlStr);
    if (newurlStr == "index") {
      extId.value = localStorage.getItem("shop_sExtId");
      if (
        extId.value == null ||
        extId.value == 0 ||
        extId.value == "NaN" ||
        extId.value == "undefined"
      ) {
        extId.value = 0;
      }
      getIfOnLine();
    }
  },
  { immediate: true }
);
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

.hand-output-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.2rem;
  margin-top: 0.5rem;
  background: linear-gradient(to bottom, #2fb2ff, #b7e4ff);
  margin-bottom: 1.5rem;
  width: 70%;
  margin-left: 8%;
  padding: 50px;
}

.hand-output {
  // padding: .3rem;

  border-radius: 8px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  font-size: 0.4rem;
}

.yellow-button {
  padding: 0.2rem 0.4rem;
  background-color: #fff8c5;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  color: #333;
  font-weight: bold;
  font-size: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
  // margin-left: .3rem;
  margin-right: 0.2rem;
}

.yellow-button:hover {
  background-color: #fff3b0;
}

.popup-box {
  position: absolute;
  right: 2rem;
  top: -22%;
  width: 3.2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.2rem;
  z-index: 1001;
}

.popup-text {
  font-size: 0.4rem;
  color: #333;
  margin: 0.3rem;
}

.popup-text:nth-child(1) {
  margin-bottom: 0.5rem;
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

.floating-menu {
  position: fixed;
  right: 10px;
  bottom: 20%;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  // width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5px 0;
  cursor: pointer;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-text {
  font-size: 25px;
  color: #333;
  margin-top: 4px;
  text-align: center;
}

.divider {
  width: 80%;
  height: 1px;
  background-color: #ebedf0;
  margin: 5px 0;
}
</style>
