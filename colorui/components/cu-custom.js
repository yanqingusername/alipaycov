const _Component = require("../../__antmove/component/componentClass.js")("Component");

const _my = require("../../__antmove/api/index.js")(my);

const app = getApp();

_Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ""
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },

  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      _my.navigateBack({
        delta: 1
      });
    },

    toHome() {
      _my.reLaunch({
        url: "/pages/index/index"
      });
    }

  }
});