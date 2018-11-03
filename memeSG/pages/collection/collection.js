// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdx: 1,
    tabs: ['海报收藏', 'DIY收藏', '拍照收藏']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  swichTab: function(e){
    let currentIdx = +e.target.id;
    this.setData({
      currentIdx: currentIdx
    });
  }
});