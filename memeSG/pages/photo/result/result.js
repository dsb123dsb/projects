// pages/photo/result/result.js
const app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    fontSize: 40,
    winHeigt: globalData.winHeight+50,
    rpxTopxRatio: globalData.rpxTopxRatio,
    recomend_text: [],
    canvasWidth: 0,
    canvasHeight: 0,
    favoriteUrl: '/images/favorite.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let src = decodeURIComponent(options.src|| "");
    this.setData({
      src: src
    });
    wx.getImageInfo({
      src: src,
      success: res => {
          this.setData({
              canvasWidth: res.width,
              canvasHeight: res.height
          });
      }
    });
    this.fetchText(src);
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
      url: 'http://10.145.80.83:8000/img_caption',
      filePath: src,
      name: 'pic',
      formData: {
        "image_name": src
      },
      success: (res)=>{
        let data = JSON.parse(res.data ||'') || {},
            textArr = JSON.parse(data.objs || '[]');
        console.log(textArr)
        textArr[0] = textArr[0].replace(',', ',\n');
        if(textArr[0].split(',')[0].length>44){
          this.setData({
            fontSize: 32
          });
        }
        this.setData({
          recomend_text: textArr.reverse()
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
  toList: function(e){
    let todo = e.target.id,
        favoriteUrl = this.data.favoriteUrl;
    if(todo=='downLoad'){
      this.downLoad();
    }else if(todo=='favorite'){
      this.setData({
        favoriteUrl: favoriteUrl=='/images/favorited.png'?'/images/favorite.png': '/images/favorited.png'
      });
    }
  },
    /**
   * 下载图片
   */
  downLoad: function(){
    // 绘制导出图片
    let data = this.data,
    src = data.src,
        text = data.recomend_text,
        canvasHeight = data.canvasHeight,
        canvasWidth = data.canvasWidth,
        canvasCtx = wx.createCanvasContext('attendCanvasIds');
    canvasCtx.drawImage(src, 0, 0, canvasWidth, canvasHeight);
    canvasCtx.setFillStyle('#ffff4f');
    canvasCtx.setFontSize(16);
    canvasCtx.setTextAlign('center');
    canvasCtx.fillText(text[0], canvasWidth/2, canvasHeight*0.66);
    canvasCtx.fillText(text[1], canvasWidth/2, canvasHeight*0.66-16);
    canvasCtx.draw(); // 绘制异步，后面导出要定时器
    wx.showLoading({
      title: '图片导出中...',
      mask: true
    });
    let timer = setTimeout(() => {
      // 写入draw回掉安卓机首次导出失败
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          quality: 1,
          canvasId: 'attendCanvasIds',
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
  refreshWord: function(){
        this.fetchText(this.data.src);
  },
  rephoto: function(){
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})