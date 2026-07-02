// api文件夹下 各个请求模块js，都统一来到index.js再向外导出
import {
    v3AuthScanQRCode, v3AuthPlayerAuth,
    v3PlayerProfile, v3PlayerCoinInPlan, v3PlayerMachineList
    , v3PlayerCoinIn, v3PlayerPlaceOrder
    , v3PlayerRechargeConfigList, v3PlayerRecharge,
    v3PlayerCoinList, v3PlayerChangeAddress,
    GetTestMachineCoins, OnlineCoinInTest
} from './v3paybox1'
import {
    v3WwjPlayerProfile, v3WwjPlayerMachineList, v3WwjAuthPlayerAuth, v3WwjAuthScanQRCode
    , v3WwjPlayerCoinInPlan
} from './v3clawMachice.js'
import {
    JsApiConfig, GetComplaintMessagePageList, SaveComplaintMessage,
    GetSimCardEndTimeByMachineId
} from './v2center1.js'
// v3paybox1相关接口：
export const v3PlayerProfileAPI = v3PlayerProfile
export const v3PlayerCoinInPlanAPI = v3PlayerCoinInPlan
export const v3AuthScanQRCodeAPI = v3AuthScanQRCode
export const v3AuthPlayerAuthAPI = v3AuthPlayerAuth
export const v3PlayerMachineListAPI = v3PlayerMachineList
export const v3PlayerCoinInAPI = v3PlayerCoinIn
export const v3PlayerPlaceOrderAPI = v3PlayerPlaceOrder
export const v3PlayerRechargeConfigListAPI = v3PlayerRechargeConfigList
export const v3PlayerRechargeAPI = v3PlayerRecharge
export const v3PlayerCoinListAPI = v3PlayerCoinList
export const v3PlayerChangeAddressAPI = v3PlayerChangeAddress

// v3clawMachice相关接口：
export const v3WwjPlayerProfileAPI = v3WwjPlayerProfile
export const v3WwjPlayerMachineListAPI = v3WwjPlayerMachineList
export const v3WwjAuthPlayerAuthAPI = v3WwjAuthPlayerAuth
export const v3WwjPlayerCoinInPlanAPI = v3WwjPlayerCoinInPlan


export const v3WwjAuthScanQRCodeAPI = v3WwjAuthScanQRCode

// 测试投币：
export const GetTestMachineCoinsAPI = GetTestMachineCoins
export const OnlineCoinInTestAPI = OnlineCoinInTest

export const JsApiConfigAPI = JsApiConfig
export const GetComplaintMessagePageListAPI = GetComplaintMessagePageList
export const SaveComplaintMessageAPI = SaveComplaintMessage

// 机器SIM卡相关：
export const GetSimCardEndTimeByMachineIdAPI = GetSimCardEndTimeByMachineId




