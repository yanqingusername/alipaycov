const _App = require("./__antmove/component/componentClass.js")("App");

const _my = require("./__antmove/api/index.js")(my); //app.js

_App({
  onLaunch: function(options) {
    // 展示本地存储能力
    var logs = _my.getStorageSync("logs") || [];
    logs.unshift(Date.now());

    _my.setStorageSync("logs", logs); // 登录

    _my.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }); // 获取用户信息

    _my.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          _my.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo; // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况

              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    }); // 获取系统状态栏信息

    _my.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;

        let capsule = _my.getMenuButtonBoundingClientRect();

        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar =
            capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });

    this.globalData.query = options.query || {};
    if (options.referrerInfo) {
      // 小程序跳小程序有的同学会使用extraData，有的同学会直接拼接在path上
      this.globalData.query = Object.assign(
        this.globalData.query,
        options.referrerInfo.extraData
      );
    }
      //获取关联普通二维码的码值，放到全局变量qrCode中
  // if (options.query && options.query.qrCode) {
  //   this.qrCode = options.query.qrCode;
  // }
  },
  onShow(options) {
    // 热启动时在该处获取参数，将参数传递到globalData全局对象下。
    this.globalData.query = options.query || {};
    if (options.referrerInfo) {
      // 小程序跳小程序有的同学会使用extraData，有的同学会直接拼接在path上
      this.globalData.query = Object.assign(
        this.globalData.query,
        options.referrerInfo.extraData
      );
    }
  },
  globalData: {
    userInfo: null,
    query: {}
  }
});
