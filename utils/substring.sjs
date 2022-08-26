 // 截取字符串长度
 function subStringName(val) {
    if (!val) {
      return false
    }
    return val.length > 1 ? val.substring(0,1) : val
  }

  function monthString(timeString) {
    if (!timeString) {  //2022-03-08 15:23:99
      return false
    }
    var month = timeString.substring(5,10)
    return month
  }

  function timeString(timeString) {
    if (!timeString) {  //2022-03-08 15:23:99
      return false
    }
    var time = timeString.substring(11,16)
    return time
  }

  function centerPhoneTrim(params){
    if (!params) {  // 18798799876
    return ""
    }
    var param = params.replace(getRegExp('(\d{3})(.*)(\d{4})','g'), '$1 $2 $3')
      return param
  }

  function centerIdCardTrim(params){
    if (!params) {  // 18798799876
    return ""
    }
    
    var param = params.replace(getRegExp('(\d{6})(.*)(\d{4})','g'), '$1 $2 $3')
    console.log('--111-->:',param)
      return param
  }
  
  function contentTrim(params){
    if (!params) {  
    return " ";
    }
    var param = params.replace(getRegExp('<br/>','g'), '  ');
    return param;
  }

  function centerPhoneTrim1(params){
    if (!params) {  // 18798799876
    return ""
    }
    var param = params.replace(params.substring(3,params.length-4),'****')
    var param1 = param.replace(getRegExp('(\d{3})(.*)(\d{4})','g'), '$1 $2 $3')
      return param1
  }

  function centerIdCardTrim1(params){
    if (!params) {
    return ""
    }

    var param1;
    if(params.length == 18){
      var param = params.replace(params.substring(6,params.length-4),'********')
      param1 = param.replace(getRegExp('(.{6})(.*)(.{4})','g'), '$1 $2 $3')
    } else if(params.length == 16){
      var param2 = params.replace(params.substring(6,params.length-4),'******')
      param1 = param2.replace(getRegExp('(.{6})(.*)(.{4})','g'), '$1 $2 $3')
    } else if(params.length == 20){
      var param3 = params.replace(params.substring(6,params.length-4),'**********')
      param1 = param3.replace(getRegExp('(.{6})(.*)(.{4})','g'), '$1 $2 $3')
    } else {
      var param4 = '*****' + params.substring(params.length - 4);
      param1 = param4.replace(getRegExp('(.{5})(.{4})','g'), '$1 $2')
    }
    
    
      return param1
  }

  export default{
    subStringName: subStringName,
    monthString: monthString,
    timeString: timeString,
    centerPhoneTrim: centerPhoneTrim,
    centerIdCardTrim: centerIdCardTrim,
    contentTrim: contentTrim,
    centerPhoneTrim1: centerPhoneTrim1,
    centerIdCardTrim1: centerIdCardTrim1
}