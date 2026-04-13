// v2用户paybox1相关接口：
import request from '../utils/request'

const washing = '/washing/'

// 玩家授权(v3AuthPlayerAuth)
export const v3xdjAuthPlayerAuth = data => request({
    method: 'POST',
    url: washing + 'api/Auth/PlayerAuth',
    data
})
// 扫码三合一(v3AuthScanQRCode)
export const v3xdjAuthScanQRCode = params => request({
    method: 'GET',
    url: washing + 'api/Auth/ScanQRCode',
    params
})

// 下单(购买/租赁)
export const v3PlaceOrdere = data => request({
    method: 'POST',
    url: washing + 'api/v3/Player/PlaceOrder',
    data
})

// 归还
export const v3WashingReturn = data => request({
    method: 'POST',
    url: washing + 'api/v3/Player/WashingReturn',
    data
})
// 玩家基本信息(v3PlayerProfile)
export const v3xdjPlayerProfile = data => request({
    method: 'POST',
    url: washing + 'api/v3/Player/Profile',
    data
})




