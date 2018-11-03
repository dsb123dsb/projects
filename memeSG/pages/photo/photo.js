// pages/photo/photo.js
const app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeigt: globalData.winHeight,
    rpxTopxRatio: globalData.rpxTopxRatio
  },
  onLoad: function(){
    this.ctx = wx.createCameraContext();
  },
  chooseImage: function() {
    wx.chooseImage({
        count: 1, //最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: res => {
            let size = res.tempFiles[0].size / 1024 / 1024;
            if (size > 20) {
                return showToast('选择图片尺寸过大');
            }
            this.toMatch(res.tempFilePaths[0]);
        }
    });
  },
  /**
   * 拍照
   */
  takePhoto: function() {
    this.ctx.takePhoto({
        quality: 'high',
        success: res => {
            this.toMatch(res.tempImagePath);
        }
    });
  },
  toMatch: function(picTmpPath){
    wx.navigateTo({
      url:
          '/pages/photo/result/result?src=' + encodeURIComponent(picTmpPath) 
    });
  }
})