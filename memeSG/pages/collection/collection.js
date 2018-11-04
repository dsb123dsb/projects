// pages/collection/collection.js
const app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdx: 1,
    rpxTopxRatio: globalData.rpxTopxRatio,
    tabs: [
      {title: '海报收藏', urls: ['https://ws1.sinaimg.cn/large/a33179fdly1fwswp4b7ntj20ku09idqq.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp479izj20ku09ik4t.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwswp41fs9j20ku09iaji.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwswoyykzuj20ku09in8p.jpg']},
      {title: 'DIY收藏', urls: ['http://10.141.8.84/meme2face/frontend/189.jpg',
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
      'http://10.141.8.84/meme2face/frontend/437.jpg']},
      {title: '拍照收藏', urls: 
      [
        {
          date:'// 照片 // 2018/10/02',
          urlss:['https://ws1.sinaimg.cn/large/a33179fdly1fwva48l3z1j20by0c0ju7.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva45lsgzj20by0c6dj6.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva41k9c2j20c20bywi1.jpg','https://ws1.sinaimg.cn/large/a33179fdly1fwva48l3z1j20by0c0ju7.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva45lsgzj20by0c6dj6.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva41k9c2j20c20bywi1.jpg']
        }, 
        {
          date:'// 照片 // 2018/10/03',
          urlss:['https://ws1.sinaimg.cn/large/a33179fdly1fwva45lsgzj20by0c6dj6.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva48l3z1j20by0c0ju7.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva41k9c2j20c20bywi1.jpg','https://ws1.sinaimg.cn/large/a33179fdly1fwva48l3z1j20by0c0ju7.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva45lsgzj20by0c6dj6.jpg', 'https://ws1.sinaimg.cn/large/a33179fdly1fwva41k9c2j20c20bywi1.jpg']
        }, 
      ]}
    ]
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