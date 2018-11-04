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
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp4b7ntj20ku09idqq.jpg', text: ['每一个沐浴在爱河中的人都是诗人', 'At the touch of love everyone become a poet']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp479izj20ku09ik4t.jpg', text: ['我多想做你时刻思念的人', 'I love to be the one you alway think of']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp41fs9j20ku09iaji.jpg', text: ['每一种创伤，都是另一种成熟', 'Each trauma, is another kind of maturity']},
      {url: 'https://ws1.sinaimg.cn/large/a33179fdly1fwswoyykzuj20ku09in8p.jpg', text: ['每当你想放弃的时候，想一想', 'The moment you think about giving up, think of']}
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
      'http://10.141.8.84/meme2face/frontend/189.jpg',
      'http://10.141.8.84/meme2face/frontend/176.jpg',
      'http://10.141.8.84/meme2face/frontend/88.jpg',
      'http://10.141.8.84/meme2face/frontend/374.jpg',
      'http://10.141.8.84/meme2face/frontend/228.jpg',
      'http://10.141.8.84/meme2face/frontend/639.jpg',
      'http://10.141.8.84/meme2face/frontend/74.jpg',
      'http://10.141.8.84/meme2face/frontend/772.jpg',
      'http://10.141.8.84/meme2face/frontend/202.jpg',
      'http://10.141.8.84/meme2face/frontend/75.jpg',
      'http://10.141.8.84/meme2face/frontend/158.jpg',
      'http://10.141.8.84/meme2face/frontend/212.jpg',
      'http://10.141.8.84/meme2face/frontend/789.jpg',
      'http://10.141.8.84/meme2face/frontend/239.jpg',
      'http://10.141.8.84/meme2face/frontend/775.jpg',
      'http://10.141.8.84/meme2face/frontend/238.jpg',
      'http://10.141.8.84/meme2face/frontend/199.jpg',
      'http://10.141.8.84/meme2face/frontend/115.jpg',
      'http://10.141.8.84/meme2face/frontend/459.jpg',
      'http://10.141.8.84/meme2face/frontend/263.jpg',
      'http://10.141.8.84/meme2face/frontend/262.jpg',
      'http://10.141.8.84/meme2face/frontend/276.jpg',
      'http://10.141.8.84/meme2face/frontend/289.jpg',
      'http://10.141.8.84/meme2face/frontend/128.jpg',
      'http://10.141.8.84/meme2face/frontend/102.jpg',
      'http://10.141.8.84/meme2face/frontend/275.jpg',
      'http://10.141.8.84/meme2face/frontend/311.jpg',
      'http://10.141.8.84/meme2face/frontend/338.jpg',
      'http://10.141.8.84/meme2face/frontend/112.jpg',
      'http://10.141.8.84/meme2face/frontend/138.jpg',
      'http://10.141.8.84/meme2face/frontend/703.jpg',
      'http://10.141.8.84/meme2face/frontend/139.jpg',
      'http://10.141.8.84/meme2face/frontend/105.jpg',
      'http://10.141.8.84/meme2face/frontend/121.jpg',
      'http://10.141.8.84/meme2face/frontend/109.jpg',
      'http://10.141.8.84/meme2face/frontend/20.jpg',
      'http://10.141.8.84/meme2face/frontend/123.jpg',
      'http://10.141.8.84/meme2face/frontend/269.jpg',
      'http://10.141.8.84/meme2face/frontend/320.jpg',
      'http://10.141.8.84/meme2face/frontend/136.jpg',
      'http://10.141.8.84/meme2face/frontend/27.jpg',
      'http://10.141.8.84/meme2face/frontend/481.jpg',
      'http://10.141.8.84/meme2face/frontend/245.jpg',
      'http://10.141.8.84/meme2face/frontend/443.jpg',
      'http://10.141.8.84/meme2face/frontend/457.jpg',
      'http://10.141.8.84/meme2face/frontend/131.jpg',
      'http://10.141.8.84/meme2face/frontend/285.jpg',
      'http://10.141.8.84/meme2face/frontend/25.jpg',
      'http://10.141.8.84/meme2face/frontend/95.jpg',
      'http://10.141.8.84/meme2face/frontend/157.jpg',
      'http://10.141.8.84/meme2face/frontend/220.jpg',
      'http://10.141.8.84/meme2face/frontend/208.jpg',
      'http://10.141.8.84/meme2face/frontend/142.jpg',
      'http://10.141.8.84/meme2face/frontend/43.jpg',
      'http://10.141.8.84/meme2face/frontend/83.jpg',
      'http://10.141.8.84/meme2face/frontend/97.jpg',
      'http://10.141.8.84/meme2face/frontend/182.jpg',
      'http://10.141.8.84/meme2face/frontend/192.jpg',
      'http://10.141.8.84/meme2face/frontend/179.jpg',
      'http://10.141.8.84/meme2face/frontend/780.jpg',
      'http://10.141.8.84/meme2face/frontend/45.jpg',
      'http://10.141.8.84/meme2face/frontend/79.jpg',
      'http://10.141.8.84/meme2face/frontend/191.jpg',
      'http://10.141.8.84/meme2face/frontend/53.jpg',
      'http://10.141.8.84/meme2face/frontend/146.jpg',
      'http://10.141.8.84/meme2face/frontend/437.jpg'
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
  toPoster: function(e){
    let dataset = e.target.dataset,
        {src, text} = dataset;
    wx.navigateTo({
      url: '/pages/poster/poster?src='+encodeURIComponent(src)+'&text='+encodeURIComponent(JSON.stringify(text))
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
