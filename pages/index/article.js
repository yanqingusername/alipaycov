const _Page = require("../../__antmove/component/componentClass.js")("Page"); // pages/index/mainPage.js

const app = getApp();

_Page({
  /**
   * Page initial data
   */
  data: {
    url: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let url = app.globalData.article;
    console.log(url);
    this.setData({
      url: url
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {}
});
