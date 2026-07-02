import request from '../utils/request'

const center = '/center/'


// 获取微信jsapi的配置
export const JsApiConfig = params => request({
    method: 'GET',
    url: center + 'api/v3/Player/JsApiConfig',
    params
})

// 反馈列表
export const GetComplaintMessagePageList = data => request({
    method: 'POST',
    url: center + 'api/v3/ComplaintMessage/GetComplaintMessagePageList',
    data
})

// 保存留言
export const SaveComplaintMessage = data => request({
    method: 'POST',
    url: center + 'api/v3/ComplaintMessage/SaveComplaintMessage',
    data
})

export const GetSimCardEndTimeByMachineId = data => request({
    method: 'POST',
    url: center + 'api/v2/SimCardMachine/GetSimCardEndTimeByMachineId',
    data
})