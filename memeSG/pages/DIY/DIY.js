// pages/DIY/DIY.js
const app = getApp();
const rpxTopxRatio = app.globalData.rpxTopxRatio;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recomend_text: [],
    diySrc: '', // diy图片源
    rpxTopxRatio: rpxTopxRatio,
    tmpSrc: '',
    favoriteUrl: '/images/favorite.png',
    selectText: '', // 选择匹配文字
    fontSize: 48,
    bottom: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu();
    let src = decodeURIComponent(options.src||'http://10.141.8.84/meme2face/frontend/75.jpg');
    this.setData({
      diySrc: src
    });
    wx.downloadFile({
      url: src, //仅为示例，并非真实的资源
      success: (res)=> {
        this.setData({
          tmpSrc: res.tempFilePath
        });
        this.fetchText(res.tempFilePath);
      },
      fail: function(res){
        console.log(res)
      }
    });
  },
  /**
   * 请求图片匹配文字
   * @param {图片地址} src 
   */
  fetchText: function(src){
    wx.showLoading({
        title: '匹配文字中...',
        mask: true
    });
    wx.uploadFile({
      url: 'http://10.145.80.83:8000/upload',
      filePath: src,
      name: 'pic',
      formData: {
        "image_name": src
      },
      success: (res)=>{
        let data = JSON.parse(res.data ||'') || {},
            textObjs = JSON.parse(data.objs || '{}'),
            textArr,
            ratio =1;
        for (let key in textObjs){
          let tmp = textObjs[key];
          if(tmp) textArr = tmp;
        }
        // 根据文本行数放缩字体
        if(Math.ceil(textArr[0].length/7)>1) {
          ratio = 2;
        }
        this.setData({
          recomend_text: textArr,
          selectText: textArr[0],
          fontSize: 48 / ratio,
          bottom: 10 * ratio*0.80
        });
        wx.hideLoading();
      },
      fail: function(res){
        console.log(res)
        wx.showToast({
          title: '请求失败，稍后再试',
          icon: 'none',
          duration: 2000
        });
      }

    });
  },
  // randomText: function(arr){
  //   let idx = Math.ceil(Math.random()*5);
  //   return arr[idx];
  // },

  toDoLosit: function(e){
    let todo = e.target.id,
        diySrc = this.data.tmpSrc,
        favoriteUrl = this.data.favoriteUrl;
    if(todo==='refreshText'){ // 更换配文
      this.fetchText(diySrc);
    }else if(todo==='downLoad'){ // 下载
      this.downLoad();
    }else if(todo==='upload'){ // 换脸
      this.changeFace(diySrc);
    }else if(todo=='favorite'){
      this.setData({
        favoriteUrl: favoriteUrl=='/images/favorited.png'?'/images/favorite.png': '/images/favorited.png'
      });
    }
  },
  changeFace: function(diySrc){
    let that =this;
    // 选择换脸图
    wx.chooseImage({
      count: 1, //最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: res => {
          let size = res.tempFiles[0].size / 1024 / 1024;
          if (size > 20) {
              return showToast('选择图片尺寸过大');
          }
          wx.showLoading({
            title: '换脸中...',
            mask: true
          });
          // 上传换脸图
          upload(res.tempFilePaths[0], 'face.jpg');
          // 上传表情图
          upload(diySrc, 'meme.jpg');
          function upload(src, id){
            wx.uploadFile({
              url: 'http://10.141.8.84:5656/upload',
              filePath: src,
              name: 'pic',
              formData: {
                "image_id": id
              },
              success: (res)=>{
                let data = JSON.parse(res.data ||'') || {},
                    textObjs = JSON.parse(data.objs || '');
                    if(textObjs && textObjs !=='w'){
                      that.setData({
                        diySrc: textObjs
                      });
                      wx.hideLoading();
                    }
              },
              fail: function(res){
                console.log(res)
                wx.showToast({
                  title: '请求失败，稍后再试',
                  icon: 'none',
                  duration: 2000
                });
              }
  
            });
          }
      }
    });
  },
  /**
   * 选择匹配文字
   * @param {事件} e 
   */
  selectText: function(e){
    let text = e.target.dataset.text,
        ratio = 1;
    if(Math.ceil(text.length/7)>1) {
      ratio = 2;
    }
    this.setData({
      selectText: text,
      fontSize: 48  / ratio,
      bottom: 10 * ratio*0.80
    });
  },
  /**
   * 下载图片
   */
  downLoad: function(){
    // 绘制导出图片
    let data = this.data,
        diySrc = data.diySrc,
        fontSize = data.fontSize,
        text = data.selectText.slice(0,7),
        bottom = data.bottom,
        canvasCtx = wx.createCanvasContext('attendCanvasId');
    canvasCtx.drawImage(diySrc, 0, 0, 270, 275);
    canvasCtx.setFontSize(fontSize);
    canvasCtx.setTextAlign('center');
    canvasCtx.fillText(text, 135, (275-bottom));
    canvasCtx.draw();
    wx.showLoading({
      title: '图片导出中...',
      mask: true
    });
    let timer = setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 270,
        height: 275,
        destWidth: 270,
        destHeight: 275,
        quality: 1,
        canvasId: 'attendCanvasId',
        success: res => {
            if (res.tempFilePath) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '保存成功',
                          icon: 'none',
                          duration: 1500
                        });
                    },
                    fail: function(res) {
                      wx.showToast({
                        title: '保存失败，请重试',
                        icon: 'none',
                        duration: 1500
                      });
                    }
                });
            }
        }
    });
    clearTimeout(timer);
}, 2000);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let src = this.data.diySrc;
    return {
      title: '一起DIY表情吧',
      path: '/pages/DIY/DIY?src='+encodeURIComponent(src),
      success: function(res) {
        console.log(res)
      },      
      fail: function(res) {
        console.log(res)
      }
    }
  }
})