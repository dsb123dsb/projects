/*
 * File: home.js
 * Project: home
 * File Created: Monday, 29th October 2018 9:32:25 pm
 * Author: zhouyonghui (zhouyonghui@sogou-inc.com)
 * -----
 * Last Modified: Wednesday, 31st October 2018 2:53:09 pm
 * Modified By: zhouyonghui (zhouyonghui@sogou-inc.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2018 sogou-Ps_front, sogou
 */

//获取应用实例
const app = getApp()

Page({
  data: {
    swiper_imgUrls: [
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswp4b7ntj20ku09idqq.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswp479izj20ku09ik4t.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswp41fs9j20ku09iaji.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswoyykzuj20ku09in8p.jpg'
    ],
    center_imgUrls: [
      {
        src: '/images/one_key_poster.png',
        text: '一键海报',
        url: '/pages/poster/poster'
      },
      {
        src: '/images/diy_picture.png',
        text: 'DIY图片',
        url: '/pages/DIY/DIY'
      },
      {
        src: '/images/photo.png',
        text: '拍照配文',
        url: '/pages/photo/photo'
      }
    ],
    recomend_imgUrls: [
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj029p5j205e04edfn.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj5uapcj20c8094jrf.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj6095xj209i06qmx2.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj627jyj2020024t8h.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj63q0vj206o06oglj.jpg',
      'https://ws1.sinaimg.cn/large/a33179fdly1fwswj65f8cj208c08c0so.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  //事件处理函数
  onLoad: function () {
  },
  // 分发进入 一键海报、DIY图片、 拍照配文页面
  gotoNext: function(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  /**
   * 进入DIY图片页面
   */
  toDIY: function(e){
    let src = e.target.dataset.src;
    wx.navigateTo({
      url: '/pages/DIY/DIY?src='+encodeURIComponent(src)
    });
  }
})
