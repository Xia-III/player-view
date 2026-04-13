// api文件夹下 各个请求模块js，都统一来到index.js再向外导出

import {
  PlayerTicketAuth,
  v3PlayerProfile,
  v3PlayerGetCoin,
} from "./v3marbles";

export const PlayerTicketAuthmarblesAPI = PlayerTicketAuth;
export const v3PlayerProfilemarblesAPI = v3PlayerProfile;
export const v3PlayerGetCoinmarblesAPI = v3PlayerGetCoin;
