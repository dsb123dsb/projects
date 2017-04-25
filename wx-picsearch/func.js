module.exports = {
    /* 去除前后空格 */
    trim:function(str){
        console.log('func.trim');
        console.log(str);
        return str.replace(/(^\s*) | (\s*$)/g,"");
    },
    json2Form:function(json) {
        var str = [];
        for(var p in json){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        return str.join("&");
    },
      //生成文件名时间戳+'_' +userId+'_'+ 3位随机数
    generateFileName:function(){
        var that = this;
        var app = getApp();
        var now = new Date();
        var yy = now.getFullYear();
        var mm = now.getMonth() - 1;
        var dd = now.getDate();
        var hh = now.getHours();
        var ii = now.getMinutes();
        var ss = now.getSeconds();
        var filename = yy+'-'+ mm + '-' + dd + '-' + hh + '-' + ii + '-' + ss + '_' + app.globalData.myInfo.userId + '_' +  Math.round(1000*Math.random())
    },
    getSuffix:function(filepath){
        var pos = filepath.indexOf('.')
        var suffix = ''
        if(pos != -1){
            suffix = filepath.substring(pos);
        }
    },
    getPolicy:function(){
        var app = getApp();
        var policy = {
            expiration:app.ossToken.expiration,

        }
    },
    encodeUtf8:function(s1)
    {
      var that = this;      
      var s = escape(s1);
      var sa = s.split("%");
      var retV ="";
      if(sa[0] != "")
      {
         retV = sa[0];
      }
      for(var i = 1; i < sa.length; i ++)
      {
           if(sa[i].substring(0,1) == "u")
           {
               retV += that.Hex2Utf8(that.Str2Hex(sa[i].substring(1,5)));
              
           }
           else retV += "%" + sa[i];
      }
     
      return retV;
    },
    Str2Hex:function(s)
    {
        var that = this;
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++)
      {
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += that.Dec2Dig(n);
          
      }
      //return value;
      return digS;
    },
    Dec2Dig:function(n1)
    {
        var s = "";
        var n2 = 0;
        for(var i = 0; i < 4; i++)
        {
            n2 = Math.pow(2,3 - i);
            if(n1 >= n2)
            {
                s += '1';
                n1 = n1 - n2;
            }
            else
            s += '0';
            
        }
        return s;
        
    },
    Dig2Dec:function(s)
    {
        var retV = 0;
        if(s.length == 4)
        {
            for(var i = 0; i < 4; i ++)
            {
                retV += parseInt(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    },
    Hex2Utf8:function(s)
    {
        var that = this;
        var retS = "";
        var tempS = "";
        var ss = "";
        if(s.length == 16)
        {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10,16);
            var sss = "0123456789ABCDEF";
            for(var i = 0; i < 3; i ++)
            {
                retS += "%";
                ss = tempS.substring(i * 8, (parseInt(i)+1)*8);
            
            
            
                retS += sss.charAt(that.Dig2Dec(ss.substring(0,4)));
                retS += sss.charAt(that.Dig2Dec(ss.substring(4,8)));
            }
            return retS;
        }
        return "";
    } 
};