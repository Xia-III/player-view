// v2用户paybox1相关接口：
import request from "../utils/request";

const coiner = "/coiner/";

// 授权登录(v3AuthPlayerAuthAPI)
export const PlayerTicketAuth = (data) =>
  request({
    method: "POST",
    url: coiner + "/api/Auth/PlayerTicketAuth",
    data,
  });
// 玩家基本信息(v3PlayerProfile)
export const v3PlayerProfile = (data) =>
  request({
    method: "POST",
    url: coiner + "api/v3/Player/Profile",
    data,
  });
// 玩家取珠
export const v3PlayerGetCoin = (data) =>
  request({
    method: "POST",
    url: coiner + "api/v3/Player/GetCoin",
    data,
  });
