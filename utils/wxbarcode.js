const _my = require("../__antmove/api/index.js")(my);

var barcode = require("./barcode");

function convert_length(length) {
  return Math.round(_my.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
  console.log(id, code, height);
  barcode.code128(_my.createCanvasContext(id), code, convert_length(width), convert_length(height)); //参数1：页面接收生成条形码的容器 参数2：需要生成条形码的code 参数3：条形码的宽度 参数4：条形码的高度
}

module.exports = {
  barcode: barc
};