// v2用户paybox1相关接口：
import request from '../utils/request'

const gashapon = '/gashapon/'

// 玩家授权(v3AuthPlayerAuth)
export const v3AuthPlayerAuth = data => request({
    method: 'POST',
    url: gashapon + 'api/Auth/PlayerAuth',
    data
})
// 扫码三合一(v3AuthScanQRCode)
export const v3AuthScanQRCode = params => request({
    method: 'GET',
    url: gashapon + 'api/Auth/ScanQRCode',
    params
})

// 玩家基本信息(v3PlayerProfile)
export const v3PlayerProfile = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/Profile',
    data
})
// 投币套餐(v3PlayerCoinInPlan)
export const v3PlayerCoinInPlan = params => request({
    method: 'GET',
    url: gashapon + 'api/v3/Player/CoinInPlan',
    params
})
// 充值配置列表(v3PlayerRechargeConfigList)
export const v3PlayerRechargeConfigList = params => request({
    method: 'GET',
    url: gashapon + 'api/v3/Player/RechargeConfigList',
    params
})
// 下单购买(v3PlayerPlaceOrder)
export const v3PlayerPlaceOrder = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/PlaceOrder',
    data
})
// 充值记录(v3PlayerRecharge)
export const v3PlayerRecharge = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/Recharge',
    data
})
// 金币详情/地址列表(v3PlayerCoinList)
export const v3PlayerCoinList = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/CoinList',
    data
})
// 手动切换当前场地地址(v3PlayerChangeAddress)
export const v3PlayerChangeAddress = params => request({
    method: 'GET',
    url: gashapon + 'api/v3/Player/ChangeAddress',
    params
})
// 获取场地机器列表(v3PlayerMachineList)
export const v3PlayerMachineList = params => request({
    method: 'GET',
    url: gashapon + 'api/v3/Player/MachineList',
    params
})
// 玩家投币(v3PlayerCoinIn)
export const v3PlayerCoinIn = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/CoinIn',
    data
})


// 测试投币：
// 获取剩余测试币数量(GetTestMachineCoins)
export const GetTestMachineCoins = params => request({
    method: 'GET',
    url: gashapon + 'api/GetTestMachineCoins',
    params
})
// 测试投币(OnlineCoinInTest)
export const OnlineCoinInTest = params => request({
    method: 'GET',
    url: gashapon + 'api/OnlineCoinInTest',
    params
})

// 玩家投币(v3PlayerCoinIn)
export const v3PlaceOrder = data => request({
    method: 'POST',
    url: gashapon + 'api/v3/Player/PlaceOrder',
    data
})


