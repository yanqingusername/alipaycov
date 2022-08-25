const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my); // index.js
// 获取应用实例
const app = getApp();
const box = require("../../utils/box.js");
const updateApp = require("../../utils/updateApp.js");
const request = require("../../utils/request.js");
const utils = require("../../utils/utils.js");
const time = require("../../utils/time.js");
const { connectSocket } = require("/__antmove/api/desc.js");
("use strict");
//const chooseLocation = requirePlugin("chooseLocation");

_Page({
  data: {
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    fix_channel_id: -1,
    swiperCurrent: 0,
    movies: [],
    links: [],
    canIUse: _my.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      _my.canIUse("open-data.type.userAvatarUrl") &&
      _my.canIUse("open-data.type.userNickName") // 如需尝试获取用户信息可改为false
  },
  onShow: function() {
    var that = this;
    console.log("进入index index页面"); // 自动检查小程序版本并更新
    updateApp.updateApp("卡尤迪新冠检测预约小程序"); // 获取设备信息
    _my.getSystemInfo({
      success: res => {
        app.globalData.systeminfo = res;
      }
    });
    // _my.showShareMenu({
    //   withShareTicket: true,
    //   menus: ["shareAppMessage", "shareTimeline"]
    // }); // 获取微信小程序配置
    // 登录小程序
    that.loginApp();
  },
  // 获取微信code登录小程序
  loginApp: function() {
    my.getAuthCode({
      scopes: "auth_base",
      success: res => {
        var authcode = res.authCode;
        console.log("获取code成功" + authcode);
        request.request_get(
          "/newalipay/enterProgram.hn",
          {
            authcode: authcode
          },
          function(res) {
            console.info("回调", res); //判断为空时的逻辑

            if (res) {
              if (res.success) {
                app.globalData.openid = res.msg;
                console.log("获取的用户openid" + app.globalData.openid);
              } else {
                box.showToast(res.msg);
              }
            } else {
              box.showToast("网络不稳定，请重试");
            }
          }
        );
      },
      fail: res => {
        box.showToast("请求超时，请检查网络是否连接");
      }
    });
  },

  // 事件处理函数
  bindViewTap() {
    _my.navigateTo({
      url: "../logs/logs"
    });
  },

  onLoad() {
    var that = this;

    if (_my.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    that.getBannerList();
    if (typeof app.globalData.query.channel_id != "undefined") {
      console.log(app.globalData.query.channel_id);
      that.setData({
        fix_channel_id: app.globalData.query.channel_id
      });
    }
    let q = JSON.stringify(app.globalData.query.qrCode);
    if (q.indexOf("channel_id") != -1) {
      var fix_channel_id = q.substr(q.indexOf("=") + 1).replace('"', "");
      console.log("fix_channel_id");
      console.log(fix_channel_id);
      that.setData({
        fix_channel_id: fix_channel_id
      });
    }
  },

  // updateApp: function() {
  //   const updateManager = my.getUpdateManager();
  //   updateManager.onCheckForUpdate(function(res) {
  //     // 请求完新版本信息的回调
  //     console.log(res.hasUpdate);
  //   });
  //   updateManager.onUpdateReady(function() {
  //     my.confirm({
  //       title: "更新提示",
  //       content: "新版本已经准备好，是否重启应用？",
  //       success: function(res) {
  //         if (res.confirm) {
  //           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
  //           updateManager.applyUpdate();
  //         }
  //       }
  //     });
  //   });
  //   updateManager.onUpdateFailed(function() {
  //     // 新版本下载失败
  //   });
  // },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    _my.getUserProfile({
      desc: "展示用户信息",
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  bindOnsite: function(options) {
    var that = this;
    console.log(options.currentTarget.dataset.type);

    _my.navigateTo({
      url:
        "/pages/onsiteAppointment/onsiteAppointment?choose_type=" +
        options.currentTarget.dataset.type +
        "&fix_channel_id=" +
        that.data.fix_channel_id
    });
  },
  bindAppointment: function() {
    _my.navigateTo({
      url: "/pages/appointmentRecord/appointmentRecord"
    });
  },
  bindCoupon: function() {
    _my.navigateTo({
      url: "/pages/coupon/coupon"
    });
  },
  getBannerList: function() {
    var that = this;
    console.log("获取轮播图——————————————————————————————————————");
    //console.log("open_id=" + app.globalData.openid);
    //var open_id = app.globalData.openid;
    var data = {
      type: 1
    };
    request.request_get("/activity/getBannerInfo.hn", data, function(res) {
      console.info("回调", res);

      if (res) {
        if (res.success) {
          console.log(res.msg);
          that.setData({
            movies: res.msg
          });
        } else {
          //box.showToast(res.msg);
        }
      }
    });
  },
  //轮播图的切换事件
  swiperChange: function(e) {
    //console.log(e)
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  //点击图片触发事件
  swipclick: function(e) {
    console.log(this.data.swiperCurrent);
    console.log(this.data.links);
    let open_way = this.data.movies[this.data.swiperCurrent].open_way;
    let icon = this.data.movies[this.data.swiperCurrent].icon;

    if (open_way == 0) {
      _my.navigateTo({
        url: icon
      });
    } else if (open_way == 1) {
      app.globalData.article = icon;

      _my.navigateTo({
        url: "/pages/index/article?url=" + icon
      });
    } else {
      app.globalData.article = icon;

      _my.navigateTo({
        url: "/pages/index/article"
      });
    }
  }
});
