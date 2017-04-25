const config = require('./config.js');
const func = require('./func.js');
//app.js
App({
  data:{
    loginURL:config.host + '/me/login',
    bindInfoURL:config.host + '/me/bindWechatInfo',
    getOssToken:config.host + '/post/oss'
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //wx.clearStorageSync();
    //var logs = wx.getStorageSync('logs')
    var that = this;
    
    that.login();

    //获取上传签名
    //that.getOssToken();

    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
          that.globalData.systemInfo = res;
          that.globalData.systemInfo.isIphone = /iPhone/.test(res.model)
          console.log(that.globalData.systemInfo);
      }
    });
    //客服消息：1.获取access_token
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf70efcb393047ee2&secret=1d541e9f3b7b0278ef6470ad1469772b',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.globalData.wxData.token = res.data.access_token;// success
      },
    });
  },
  getOssToken:function(){
      var that = this;
      wx.request({
        url:that.data.getOssToken,
        method:'GET',
        success:function(res){
            console.log('请求oss token');
            console.log(res.data);
            that.globalData.ossToken = res.data.data
            console.log(that.globalData.ossToken)
        },
        fail:function(res){
            console.log(res)
        }
      })
  },
  checkExpiration:function(){
      var now = Date.parse(new Date()) / 1000;
      var that = this;
      //如果过期，重新请求获得oss token
      if(that.globalData.ossToken.expiration < now + 3){
          //that.getOssToken();
      }
  },

  globalData:{
    postTag:[],
    postDivision:'',
    wxData: { appid: "wxf70efcb393047ee2", appSecret: "1d541e9f3b7b0278ef6470ad1469772b", },//存储了appid、secret、token串
    myInfo:null,

    ossToken:{
        accessKeyId:'',
        expiration:'',
        policy:'',
        signature:''
    },

    systemInfo:{},

  },

  bindUserInfo:function(userId){
      var that = this;
      wx.getUserInfo({
          success: function(res) {
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女 
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              that.globalData.myInfo.userName = nickName
              var urlParams = func.json2Form({
                    avatarUrl:avatarUrl,
                    city:city,
                    country:country,
                    province:province,
                    gender:gender,
                    nickName:nickName,
                    userId:userId
              })
              wx.request({
                  url:that.data.bindInfoURL+'?'+urlParams,
                  method:'POST',
                  header:{'Content-Type':'application/json'},
                  success:function(res){
                      console.log(res)
                      console.log('成功绑定头像')
                  }
              })
          }
      })
  },
  post:function(){
    var that = this;
    if(!that.globalData.myInfo){
        wx.showModal({
            title: '提示',
            content: '未成功登录，请重新登录',
            confirmText: '重新登录',
            showCancel:false,
            success: function(res) {
                if (res.confirm) {
                    that.login();
                }
            }
        })
    }
    else{
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function(res){
                if(res.tempFilePaths){
                    wx.navigateTo({
                        url: '../post/post?pictureSrc='+res.tempFilePaths[0],
                    })
                }
            },
        })
    }
  },
  login:function(){
    var that = this;
    wx.showToast({
        title: '正在登录',
        icon: 'loading',
        duration: 10000
    })
    //把code给后台，得到我的userInfo
    wx.login({
        success: function(res) {
            console.log('code:')
            console.log(res.code)
            if (res.code) {
                //发起网络请求 把code传给后台
                wx.request({
                    url: that.data.loginURL+'?'+'code='+res.code,
                    method:'POST',
                    header:{'Content-Type':'application/json'},
                    // data: {
                    //     code: res.code
                    // },
                    success:function(r){   //后台返回user
                        if(r.data.data){
                      wx.clearStorageSync();  // ??
                      wx.setStorageSync('userInfo',r.data.data);
                            that.globalData.myInfo = r.data.data;
                            that.globalData.myInfo.userId = r.data.data.id;
                            that.globalData.myInfo.userName = r.data.data.name;
                            that.globalData.myInfo.userAvatar = r.data.data.avatar;
                            that.globalData.myInfo.userIntroduction = r.data.data.introduction;
                            that.globalData.myInfo.userCoverSrc = r.data.data.cover;
                            console.log(r.data.data);
                            console.log('把code传给后台，后台成功返回userIndo');
                            // if(!logs){  //如果logs为空
                            //     logs = []
                            // }
                            //每次登陆绑定用户信息（头像、昵称等）
                            that.bindUserInfo(that.globalData.myInfo.userId)                             
   
                            // logs.unshift(Date.now())
                            // wx.setStorageSync('logs', logs)
                            wx.hideToast();
                            wx.showToast({
                                title:'登录成功',
                                icon:'success',
                                duration:1500
                            })
                        }
                    },
                    fail:function(r){
                        console.log(r)
                        console.log('登录失败')
                    }
                })
            } 
            else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        },
        fail:function(res){console.log('login fail');console.log(res.errMsg)}
    });
  }



})