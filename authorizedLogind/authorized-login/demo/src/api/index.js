// api文件夹下 各个请求模块js，都统一来到index.js再向外导出
import {
  PlayerTicketAuth,
  v3PlayerProfile,
  v3PlayerGetCoin,
} from "./v3paybox1";

export const PlayerTicketAuthAPI = PlayerTicketAuth;
export const v3PlayerProfileAPI = v3PlayerProfile;
export const v3PlayerGetCoinAPI = v3PlayerGetCoin;
