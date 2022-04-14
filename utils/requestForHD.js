const _my = require("../__antmove/api/index.js")(my);
/*
 *  网络请求js
 *  author songcl
 *  date 2021-03-28 songcl
 */
// 参数配置
//var apiurl = 'http://localhost:8080/flash20AppletBackend'         // 本地测试
//var apiurl = "https://tj.coyotebio-lab.com/activity"; // 测试服务器
var apiurl = 'https://store.coyotebio-lab.com/activity'    // 测试服务器
// 常用request get封装

function request_get(controller, data, cb) {
  var url = apiurl + controller;

  _my.request({
    url: url,
    data: data,
    method: "GET",
    success: function (res) {
      //console.log(cb(res.data))
      return typeof cb == "function" && cb(res.data);
    },
    fail: function (res) {
      console.log("request networkTimeout");

      _my.showModal({
        title: "提示",
        showCancel: false,
        content: "请求超时,请检查网络！"
      });

      return typeof cb == "function" && cb(false);
    }
  });
}

module.exports = {
  request_get: request_get
};