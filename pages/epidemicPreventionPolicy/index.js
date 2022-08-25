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
    appointmentList: [],
    page: 1, //当前页数
    pageSize: 6, //每页六条
    tip: "",
    tip_temp: '暂无数据',
    city: '',
    type_name: "",
    source_type: "",
    policyList:[]
  },
  onShow: function () {
    this.getAppointmentList();
  },
  onLoad: function (options) {
    
  },
  toInfo: function (e) {
    let id = e.currentTarget.dataset.id; 
    _my.navigateTo({
      url: '/pages/epidemicPreventionPolicyDetail/index?id='+id
    })
  },
  getAppointmentList: function () {
    var that = this;
   
    var data = {}
    request.request_get('/Newacid/getPreventionPolicyList.hn', data, function (res) {
      if (res) {
        if (res.code == 0) {
          that.setData({
            policyList: res.data,
            city: res.city,
            source_type: res.source_type,
            type_name: res.type_name,
          });
        } else {
          box.showToast(res.msg);
        }
      }
    });
  },
})