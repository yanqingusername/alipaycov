const _Page = require("../../__antmove/component/componentClass.js")("Page");

const _my = require("../../__antmove/api/index.js")(my); // pages/createOrder/createOrder.js

const app = getApp()
var request = require('../../utils/request.js')
var box = require('../../utils/box.js')
const utils = require('../../utils/utils.js')

_Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "选择受检人",
    dataList: []
  },
  onShow: function () {
    this.getAllSubject();
  },
  onLoad: function (options) {
    _my.setNavigationBar({
      title: options.title || this.data.title
    })
  },
  getAllSubject(){
    let that = this;
    var openid = app.globalData.openid;
    let data = {
      open_id: openid
    }
    request.request_get('/a/getAllSubject.hn', data, function (res) {
      console.info('回调', res)
      if (res) {
        if (res.success) {
          that.setData({
            dataList: res.msg
          })
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    })
  },
  /**
   * 添加受检人
   */
  bindAddSubject(){
    _my.navigateTo({
      url:'/pages/addSubject/index?isAddSub=1'
    });
  },
  /**
   * 选择受检人
   */
  bindSelectSubject(e){
    let item = e.currentTarget.dataset.item;
    console.log('--item-->:',item)
    if(item){
      let pages = getCurrentPages(); 
      let prevPage = pages[pages.length - 2];
      prevPage.data.bindBackSubject = true;
      prevPage.data.isAddSubject = 1;
      prevPage.data.userinfo_id = item.id;
      prevPage.data.name = item.name;
      prevPage.data.gender = item.gender;
      prevPage.data.age = item.age;
      prevPage.data.cardIndex = item.card_type;
      prevPage.data.idcard = item.id_card;
      prevPage.data.phone = item.phone;
      prevPage.data.card_name = item.card_type == 1 ? '护照' : item.card_type == 2 ? '港澳台通行证' : '身份证';
      prevPage.data.onlineFlag = item.onlineFlag == 1 ? false : true;
      prevPage.data.onlineFlagNum = item.onlineFlag;

      // prevPage.setData({
      //   isAddSubject: 1,
      //   userinfo_id: item.id,
      //   name: item.name,
      //   gender: item.gender,
      //   age: item.age,
      //   card_type: item.card_type,
      //   idcard: item.id_card,
      //   phone: item.phone,
      //   onlineFlagNum: item.onlineFlag,
      //   onlineFlag: item.onlineFlag ? true : false,
      //   card_name: item.card_name
      // })
      _my.navigateBack({
        delta: 1, 
      })
    }
  },
  /**
   * 编辑受检人
   */
  bindEditSubject(e){
    let online = e.currentTarget.dataset.online; // 0-线上  1-线下
    let item = e.currentTarget.dataset.item;
    let jsonItem = JSON.stringify(item);
    console.log('--item-->:',item)
    if(online&&item){
      _my.navigateTo({
        url:`/pages/addSubject/index?isAddSub=2&title=编辑受检人&online=${online}&jsonItem=${jsonItem}`
      });
    }
  }
})