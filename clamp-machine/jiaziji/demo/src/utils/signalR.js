// signalR
const signalR = require("@microsoft/signalr");

// import { apiUrl } from './api-url'
const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://www.huanxizn.com/clamp" + "/hub/shop", {
    accessTokenFactory: () => localStorage.getItem("clamp_heardTokenStarter"),
  })
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      return Math.random() * 12000; //隔12000毫秒无限连接
    },
  }) //自动重连
  .build();

export default connection;
