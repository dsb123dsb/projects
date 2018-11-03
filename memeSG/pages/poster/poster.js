// pages/poster/poster.js
const app = getApp();
const rpxTopxRatio = app.globalData.rpxTopxRatio;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postUrl: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp4b7ntj20ku09idqq.jpg',
    matchtexts: ['每一个沐浴在爱河中的人都是诗人', 'At the touch of love everyone become a poet'],
    currentBg: 'black',
    photoBg: ['black', '#2d3134'],
    recomend_imgUrls: [
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp4b7ntj20ku09idqq.jpg', text: ['每一个沐浴在爱河中的人都是诗人', 'At the touch of love everyone become a poet']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp479izj20ku09ik4t.jpg', text: ['我多想做你时刻思念的人', 'I love to be the one you alway think of']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp41fs9j20ku09iaji.jpg', text: ['每一种创伤，都是另一种成熟', 'Each trauma, is another kind of maturity']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswoyykzuj20ku09in8p.jpg', text: ['每当你想放弃的时候，想一想', 'The moment you think about giving up, think of']}
    ],
    currentIdx: 0,
    rpxTopxRatio: rpxTopxRatio
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toPoster: function(e){
    let dataset = e.target.dataset,
        {src, texts} = dataset;
    this.setData({
      postUrl: src,
      matchtexts: texts
    });
  },
  toList: function(e){
    let todo = e.target.id;
    if(todo=='downLoad'){
      this.downLoad();
    }
  },
    /**
   * 下载图片
   */
  downLoad: function(){
    // 绘制导出图片
    let data = this.data,
        diySrc = data.postUrl,
        text = data.matchtexts,
        currentBg = data.currentBg,
        canvasCtx = wx.createCanvasContext('attendCanvasId');
    canvasCtx.setFillStyle(currentBg);
    canvasCtx.fillRect(0, 0, 750, 433);
    canvasCtx.drawImage(diySrc, 0, 30, 750, 342);
    canvasCtx.setFillStyle('white');
    canvasCtx.setFontSize(24);
    canvasCtx.setTextAlign('center');
    canvasCtx.fillText(text[0], 375, (433-44));
    canvasCtx.fillText(text[1], 375, (433-20));
    canvasCtx.draw();
    wx.showLoading({
      title: '图片导出中...',
      mask: true
    });
    let timer = setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: 433,
          destWidth: 750,
          destHeight: 433,
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
  changeBg: function(e){
    let idx = +e.target.id,
      photoBg = this.data.photoBg;
    this.setData({
      currentIdx: idx,
      currentBg: photoBg[idx]
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})