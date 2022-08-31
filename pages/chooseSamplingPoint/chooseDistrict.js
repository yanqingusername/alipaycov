const _Page = require("../../__antmove/component/componentClass.js")("Page");

const _my = require("../../__antmove/api/index.js")(my); // pages/chooseSamplingPoint/chooseDistrict.js

const app = getApp();

var request = require("../../utils/request.js");

_Page({
  /**
   * Page initial data
   */
  data: {
    arr: [],
    is_big_screen: 1 // 1--常态化检测  2--不是常态化检测
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      is_big_screen: options.bigscreen || 1
    });
    that.getChannelDistrict();
  },

  getChannelDistrict() {
    var that = this;
    var data = {
      is_big_screen: this.data.is_big_screen
    };
    request.request_get("/newalipay/getCountSamplingPoint.hn", data, function(res) {
      console.log("getChannelDistrict", res);

      if (res) {
        if (res.success) {
          console.log(res.msg);
          var arr = res.msg;
          var count = 0;

          for (var i = 0; i < arr.length; i++) {
            count += arr[i].num;
          }

          arr.unshift({
            sampling_place: "全城区",
            num: count
          });
          that.setData({
            arr: arr
          });
        } else {
          // box.showToast(res.msg);
        }
      } else {
        //box.showToast("网络不稳定，请重试");
      }
    });
  },

  bindBackToChannel: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var sampling_place = e.currentTarget.dataset.sp;
    prevPage.setData({
      sampling_place: sampling_place
    });

    _my.navigateBack({
      delta: 1
    });
  },

});
