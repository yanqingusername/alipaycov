const _Page = require("../../__antmove/component/componentClass.js")("Page");

const _my = require("../../__antmove/api/index.js")(my); // pages/myOrder/myOrder.js

const app = getApp();

var request = require("../../utils/request.js");

var box = require("../../utils/box.js");

const utils = require("../../utils/utils.js");

_Page({
  /**
   * 页面的初始数据
   */
  data: {
    circulationList: [],
    setInter: "",
    support_id: "",
    overflowFlag: false,
    TabCur: 0,
    status: 0,
    channelList: [],
    //采样点列表（未模糊查询）
    channelListPlus: [],
    statusList: ["调拨出库", "领用出库"],
    circulationListTemp: [],
    page: 1,
    //当前页数
    pageSize: 6,
    //每页六条
    hasMoreData: true,
    alreadyChecked: false,
    tip: "",
    tip_temp: "暂无数据",
    flag1: true,
    flag2: false,
    sampling_place: "全城区",
    hiddenFlag: false
  },

  getLocationAuth() {
    _my.getSetting({
      //获取用户已授权的信息
      success(res) {
        console.log(res);

        if (res.authSetting["scope.userLocation"] == false) {
          //如果没有授权地理位置
          console.log("用户没授权地理位置");
          //TODO
          _my.showModal({
            title: "获取地理位置",
            content: "为您推荐附近采样点",
            confirmText: "确认授权",
            showCancel: true,

            success(res) {
              if (res.confirm) {
                _my.openSetting({
                  success(res) {
                    res.authSetting = {
                      //打开授权位置页面，让用户自己开启
                      "scope.userLocation": true
                    };
                  }
                });
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            }
          });
        } else {
          //
          _my.getSystemInfo({
            success(res) {
              var isopendingwei = res.locationEnabled;

              if (isopendingwei == false) {
                //TODO
                _my.showModal({
                  title: "无法获取地理位置，请检查是否开启系统权限",
                  showCancel: false,

                  success(res) {}
                });
              }
            }
          });
        }
      }
    });
  },

  onShow: function() {
    var that = this;
    that.clearSearchHandle();
    that.getChannelList();
    that.getLocationAuth();
    console.log("成功onshow+++++++++++");
  },
  onLoad: function() {
    var that = this;

    const res = _my.getSystemInfoSync();

    console.log(res);
    console.log(res.pixelRatio);
    console.log(res.windowWidth);
    console.log(res.windowHeight);
    console.log(res.language);
    console.log(res.version);
    console.log(res.platform); // that.getChannelList();
  },
  getChannelList: function() {
    var that = this;
    var sampling_place = that.data.sampling_place;
    console.log("sampling_place= " + sampling_place);

    if (sampling_place == "全城区") {
      sampling_place = "";
    }

    _my.getLocation({
      type: 0,

      success(res) {
        console.log("我获取到了经纬度");
        that.setData({
          longitude: res.longitude,
          //经度
          latitude: res.latitude //纬度
        });
        var data = {
          longitude: res.longitude,
          latitude: res.latitude,
          sampling_place: sampling_place
        };
        request.request_get("/alipay/getFixedSamplingPoint.hn", data, function(res) {
          console.log("getFixedSamplingPoint", res);

          if (res) {
            if (res.success) {
              console.log(res.msg);
              var channelList = res.msg;
              channelList.sort(function(a, b) {
                return b.distance < a.distance ? 1 : -1; //正序
              });

              for (var i = 0; i < channelList.length; i++) {
                channelList[i].distance = utils.setMorKm(
                  channelList[i].distance
                );
                channelList[i].workingTimeArr = channelList[
                  i
                ].working_time.split(",");

                for (var y = 0; y < channelList[i].workingTimeArr.length; y++) {
                  if (channelList[i].workingTimeArr[y].indexOf("：") == -1) {
                    channelList[i].workingTimeArr[y] += "：全天24h";
                  }

                  var reg = new RegExp(":00-", "g");
                  channelList[i].workingTimeArr[y] = channelList[
                    i
                  ].workingTimeArr[y].replace(reg, "-");
                  channelList[i].workingTimeArr[y] = channelList[
                    i
                  ].workingTimeArr[y].substring(
                    0,
                    channelList[i].workingTimeArr[y].length - 3
                  );

                  if (
                    channelList[i].workingTimeArr[y].substr(
                      channelList[i].workingTimeArr[y].indexOf("：") + 1,
                      2
                    ) >
                    channelList[i].workingTimeArr[y].substr(
                      channelList[i].workingTimeArr[y].indexOf("-") + 1,
                      2
                    )
                  ) {
                    console.log(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("：") + 1,
                        2
                      )
                    );
                    console.log(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("-") + 1,
                        2
                      )
                    );
                    channelList[i].workingTimeArr[y] = channelList[
                      i
                    ].workingTimeArr[y].replace(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("-") + 1,
                        2
                      ),
                      "次日" +
                        channelList[i].workingTimeArr[y].substr(
                          channelList[i].workingTimeArr[y].indexOf("-") + 1,
                          2
                        )
                    );
                  } // if(channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2)>24){ //若时间为25:00显示为次日01:00
                  //   channelList[i].workingTimeArr[y] = channelList[i].workingTimeArr[y].replace(channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2),'次日'+ utils.formatNumber((channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2)-24)))
                  // }
                }
              }

              that.setData({
                channelList: channelList,
                hiddenFlag: false
              });
            } else {
              // box.showToast(res.msg);
            }
          } else {
            //box.showToast("网络不稳定，请重试");
          }
        });
      },

      fail(res) {
        console.log(res);
        var data = {
          sampling_place: sampling_place
        };
        request.request_get("/alipay/getFixedSamplingPoint.hn", data, function(res) {
          console.log("getFixedSamplingPoint", res);

          if (res) {
            if (res.success) {
              console.log(res.msg);
              var channelList = res.msg;
              channelList.sort(function(a, b) {
                return b.distance < a.distance ? 1 : -1; //正序
              });

              for (var i = 0; i < channelList.length; i++) {
                channelList[i].workingTimeArr = channelList[
                  i
                ].working_time.split(",");

                for (var y = 0; y < channelList[i].workingTimeArr.length; y++) {
                  if (channelList[i].workingTimeArr[y].indexOf("：") == -1) {
                    channelList[i].workingTimeArr[y] += "：全天24h";
                  }

                  var reg = new RegExp(":00-", "g");
                  channelList[i].workingTimeArr[y] = channelList[
                    i
                  ].workingTimeArr[y].replace(reg, "-");
                  channelList[i].workingTimeArr[y] = channelList[
                    i
                  ].workingTimeArr[y].substring(
                    0,
                    channelList[i].workingTimeArr[y].length - 3
                  );

                  if (
                    channelList[i].workingTimeArr[y].substr(
                      channelList[i].workingTimeArr[y].indexOf("：") + 1,
                      2
                    ) >
                    channelList[i].workingTimeArr[y].substr(
                      channelList[i].workingTimeArr[y].indexOf("-") + 1,
                      2
                    )
                  ) {
                    console.log(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("：") + 1,
                        2
                      )
                    );
                    console.log(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("-") + 1,
                        2
                      )
                    );
                    channelList[i].workingTimeArr[y] = channelList[
                      i
                    ].workingTimeArr[y].replace(
                      channelList[i].workingTimeArr[y].substr(
                        channelList[i].workingTimeArr[y].indexOf("-") + 1,
                        2
                      ),
                      "次日" +
                        channelList[i].workingTimeArr[y].substr(
                          channelList[i].workingTimeArr[y].indexOf("-") + 1,
                          2
                        )
                    );
                  } // if(channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2)>24){ //若时间为25:00显示为次日01:00
                  //   channelList[i].workingTimeArr[y] = channelList[i].workingTimeArr[y].replace(channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2),'次日'+ utils.formatNumber((channelList[i].workingTimeArr[y].substr((channelList[i].workingTimeArr[y].indexOf('-')+1),2)-24)))
                  // }
                }
              }

              that.setData({
                channelList: channelList,
                hiddenFlag: true
              });
            } else {
              // box.showToast(res.msg);
            }
          } else {
            //box.showToast("网络不稳定，请重试");
          }
        });
      }
    });
  },
  bindDetail: function(e) {
    var circulation_num = e.currentTarget.dataset.id;
    console.log("circulation_num=" + circulation_num);

    _my.navigateTo({
      url: "goodsDetail?circulation_num=" + circulation_num
    });
  },

  tabSelect(e) {
    var status = e.currentTarget.dataset.id;
    console.log("tabSelect " + status);
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      status: status,
      page: 1,
      circulationList: [],
      tip: "",
      alreadyChecked: false
    }); //  that.getCirculationList();
  },

  // getCirculationList: function () {
  //   var that = this;
  //   console.log('当前页数='+that.data.page)
  // 	console.log('circulationList='+that.data.circulationList)
  // 	console.log('hasMoreData='+that.data.hasMoreData)
  //   console.log('status='+that.data.status)
  //   var status = that.data.status;
  //   var create_person_id = app.globalData.userInfo.id;
  //   var data = {
  //     create_person_id: create_person_id,
  //     status: status, //流转类型
  //     pageNum: that.data.page, //页数
  // 		pageCount: that.data.pageSize //每页数据
  //   }
  //   request.request_get('/stockout/getCirculation.hn', data, function (res) {
  //     console.info('回调', res)
  //     if (res) {
  //       if (res.success) {
  // 				var circulationListTemp = that.data.circulationList;
  //         var circulationList = res.msg;
  //         if(circulationList.length == 0 && that.data.page == 1 ){
  //           that.setData({
  //             tip:"暂无数据",
  //             alreadyChecked:true,
  // 						alreadyChecked_temp:true
  // 					})
  //         }else if(circulationList.length < that.data.pageSize){
  // 					that.setData({
  // 						hasMoreData:false,
  //             page: that.data.page + 1,
  //             tip:"没有更多数据了",
  //             alreadyChecked:true,
  // 						alreadyChecked_temp:false
  // 					})
  // 				}else{
  // 					that.setData({
  // 						hasMoreData:true,
  //             page: that.data.page + 1,
  //             tip:"加载中",
  //             alreadyChecked:true,
  // 						alreadyChecked_temp:false
  // 					})
  //         }
  // 				circulationList = circulationListTemp.concat(circulationList);
  //         // circulationList.sort(function(a, b) {
  // 				// 	return b.time < a.time ? 1 : -1 //正序
  //         // })
  //         that.setData({
  //           circulationList: circulationList
  //         });
  //         console.log(that.data.circulationList)
  //         console.log(circulationList)
  //         console.log(circulationList.length)
  //         console.log(that.data.existData)
  //       } else {
  //         box.showToast(res.msg);
  //       }
  //     }
  //   })
  // },
  bindCancel: function(e) {
    var that = this;
    //TODO
    _my.showModal({
      title: "提示",
      content: "是否确认撤销？",

      success(res) {
        if (res.confirm) {
          console.log("用户点击确定");
          var data = {
            circulation_num: e.currentTarget.dataset.id
          };
          request.request_get("/stockout/cancelCirculation.hn", data, function(
            res
          ) {
            console.info("cancelCirculation回调", res);

            if (res) {
              if (res.success) {
                _my.showToast({
                  content: "撤销成功"
                });

                that.getCirculationList();
              } else {
                box.showToast(res.msg);
              }
            }
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  },
  phoneCall: function(e) {
    var that = this;
    console.log(e);

    _my.makePhoneCall({
      number: e.currentTarget.dataset.phone,
      success: function() {
        console.log("成功拨打电话");
      }
    });
  },
  //利用js进行模糊查询
  searchChangeHandle: function(e) {
    this.setData({
      searchText: e.detail.value
    });
    console.log("input-----" + e.detail.value);
    var value = e.detail.value;
    var that = this;
    var channelList = that.data.channelList;
    var channelListPlus = that.data.channelListPlus;

    if (value == "" || value == null) {
      that.setData({
        flag1: true,
        flag2: false,
        tip: "",
        overflowFlag: false
      });
    } else {
      //  if (e.detail.cursor) { //e.detail.cursor表示input值当前焦点所在的位置
      var that = this;
      that.setData({
        flag1: false,
        flag2: true,
        tip: "",
        overflowFlag: false
      });
      var arr = [];

      for (var i = 0; i < channelList.length; i++) {
        if (channelList[i].channel_name.indexOf(value) >= 0) {
          channelList[i].checked = false;
          arr.push(channelList[i]);
        }
      }

      console.log(arr);
      that.setData({
        channelListPlus: arr
      });

      if (that.data.channelListPlus.length == 0) {
        console.log(arr);
        that.setData({
          tip: "没有搜索到该采样点",
          overflowFlag: true //禁止y轴搜索
          //  flagCheck: true
        });
      } //}
    }
  },
  //选中采样点并返回
  bindCheckSamplingPoint: function(e) {
    console.log(e);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var channel_name1 = e.currentTarget.dataset.name;
    var distance1 = e.currentTarget.dataset.distance;
    var id1 = e.currentTarget.dataset.id;
    var channel = {
      channel_name: channel_name1,
      distance: distance1,
      channel_id: id1
    };
    console.log(channel);
    // prevPage.setData({
    //   channel: channel,
    //   bindBackFlag: true
    // });
    prevPage.data.channel =  channel;
    prevPage.data.bindBackFlag = true;
    _my.navigateBack({
      delta: 1
    });
  },

  // 输入框有文字时，点击X清除
  clearSearchHandle() {
    console.log("hereeeeee");
    this.setData({
      searchText: "",
      tip: "",
      overflowFlag: false
    });
    var that = this;
    that.setData({
      flag1: true,
      //显示原始列表
      flag2: false //关闭查询列表
    }); // that.getCompanyList();
  },

  chooseDistrict: function() {
    _my.navigateTo({
      url: "/pages/chooseSamplingPoint/chooseDistrict"
    });
  },
  openMap: function(e) {
    console.log(e);

    _my.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      //纬度
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      //经度
      scale: 18,
      name: e.currentTarget.dataset.channelname,
      address: e.currentTarget.dataset.site_description
    });
  }
});
