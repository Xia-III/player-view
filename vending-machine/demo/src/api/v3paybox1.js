// v2用户vending1相关接口：
import request from '../utils/request'

const vending = '/vending/'



// 玩家授权(v3AuthPlayerAuth)
export const v3AuthPlayerAuth = data => request({
    method: 'POST',
    url: vending + 'api/Auth/PlayerAuth',
    data
})
// 扫码三合一(v3AuthScanQRCode)
export const v3AuthScanQRCode = params => request({
    method: 'GET',
    url: vending + 'api/Auth/ScanQRCode',
    params
})

// 玩家基本信息(v3PlayerProfile)
export const v3PlayerProfile = data => request({
    method: 'POST',
    url: vending + 'api/v3/Player/Profile',
    data
})
// 投币套餐(v3PlayerCoinInPlan)
export const v3PlayerCoinInPlan = params => request({
    method: 'GET',
    url: vending + 'api/v3/Player/CoinInPlan',
    params
})
// 充值配置列表(v3PlayerRechargeConfigList)
export const v3PlayerRechargeConfigList = params => request({
    method: 'GET',
    url: vending + 'api/v3/Player/RechargeConfigList',
    params
})
// 下单购买(v3PlayerPlaceOrder)
export const v3PlayerPlaceOrder = data => request({
    method: 'POST',
    url: vending + 'api/v3/Player/PlaceOrder',
    data
})
// 充值记录(v3PlayerRecharge)
export const v3PlayerRecharge = data => request({
    method: 'POST',
    url: vending + 'api/v3/Player/Recharge',
    data
})
// 金币详情/地址列表(v3PlayerCoinList)
export const v3PlayerCoinList = data => request({
    method: 'POST',
    url: vending + 'api/v3/Player/CoinList',
    data
})
// 手动切换当前场地地址(v3PlayerChangeAddress)
export const v3PlayerChangeAddress = params => request({
    method: 'GET',
    url: vending + 'api/v3/Player/ChangeAddress',
    params
})
// 获取场地机器列表(v3PlayerMachineList)
export const v3PlayerMachineList = params => request({
    method: 'GET',
    url: vending + 'api/v3/Player/MachineList',
    params
})
// 玩家投币(v3PlayerCoinIn)
export const v3PlayerCoinIn = data => request({
    method: 'POST',
    url: vending + 'api/v3/Player/CoinIn',
    data
})
// 扫码订单详情(VendingQrOrderInfo)
export const VendingQrOrderInfo = params => request({
    method: 'GET',
    url: vending + 'api/v3/Player/VendingQrOrderInfo',
    params
})
// ==================== 外设租赁玩家接口(LeasePlayer) ====================
// 扫码后查机器业务类型(MachineBizType)：区分旧售货/外设租赁
export const MachineBizType = params => request({
    method: 'GET',
    url: vending + 'api/v3/LeasePlayer/MachineBizType',
    params
})
// 同码借还入口(LeaseEntry)：有在租→还；无→借
export const LeaseEntry = params => request({
    method: 'GET',
    url: vending + 'api/v3/LeasePlayer/LeaseEntry',
    params
})
// 创建租赁订单并支付定金(CreateLeaseOrder)
export const CreateLeaseOrder = data => request({
    method: 'POST',
    url: vending + 'api/v3/LeasePlayer/CreateLeaseOrder',
    data
})
// 确认归还(ConfirmReturn)：通知设备按原货道行列开柜
export const ConfirmReturn = params => request({
    method: 'POST',
    url: vending + 'api/v3/LeasePlayer/ConfirmReturn',
    params
})
// 归还结算(SettleReturn)：暂屏蔽，由设备0x18回报触发结算
export const SettleReturn = params => request({
    method: 'POST',
    url: vending + 'api/v3/LeasePlayer/SettleReturn',
    params
})


// 测试投币：
// 获取剩余测试币数量(GetTestMachineCoins)
export const GetTestMachineCoins = params => request({
    method: 'GET',
    url: vending + 'api/GetTestMachineCoins',
    params
})
// 测试投币(OnlineCoinInTest)
export const OnlineCoinInTest = params => request({
    method: 'GET',
    url: vending + 'api/OnlineCoinInTest',
    params
})


