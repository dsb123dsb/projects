var app = getApp();
const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data: {
        // 分类
        division: [],
        divisionURL: config.host + "/index/division",

        hotTagUrl: config.host + '/post/hotTags',

        tips: '',
        displayTips: false,
        tipsTop: 0,

        winHeight: app.globalData.systemInfo.windowHeight,
        winWidth: app.globalData.systemInfo.windowWidth,
    },
    onLoad: function () {
        var that = this;
        if (that.data.divisionURL) { that.loadDivision() };
    },
    loadDivision: function () {
        var that = this,
            divisions = wx.getStorageSync('divisions');        //请求获得最热所有分类;
        if (divisions) {
            that.setData({
                division: divisions
            })
            // 如果有选中分类就有颜色
            if (app.globalData.postDivision) {
                var len = app.globalData.postDivision,
                    div = that.data.division,
                    len2=div.length;
                for (var j = 0; j < len2; j++) {
                    if (len == div[j].divisionName) {
                        div[j].divisionColor = '#ea4f16';
                        div[j].divisionFont = 'white';
                        div[j].divisionBorder = "1rpx solid #ea4f16";
                    }
                };
                that.setData({
                    division: div
                })
            }
        } else {
            wx.request({
                url: that.data.divisionURL,
                method: 'GET',
                header: { 'Content-Type': 'application/json' },
                success: function (res) {
                    wx.setStorageSync('divisions', res.data.data);
                    that.setData({
                        division: res.data.data
                    })
                },
            });
        };
    },
    //选择分类
    tapDivision: function (event) {
        var that = this,
            len = that.data.division.length,
            division = that.data.division,
            tapDivision = event.target.id;
        for (var i = 0; i < len; i++) {
            division[i].divisionColor = '';
            division[i].divisionFont = '';
            division[i].divisionBorder = "1rpx solid #777777";
            that.setData({
                division: division,
            });
            if (tapDivision === division[i].divisionName) {
                addDivision(tapDivision);
            }
        };
        function addDivision(tag) {
            if (!tag)
                return;
            else {
                division[i].divisionColor = '#ea4f16';
                division[i].divisionFont = 'white';
                division[i].divisionBorder = "1rpx solid #ea4f16";
                app.globalData.postDivision = tapDivision;
                app.globalData.divisionId=division[i].divisionId;
                // console.log('选中标签: ' + tapDivision);
                console.log(app.globalData.postDivision);
                that.setData({
                    division: division,
                });
                // 返回
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1, // 回退前 delta(默认为1) 页面
                        success: function (res) {
                            // success
                        },
                        fail: function () {
                            // fail
                        },
                        complete: function () {
                            // complete
                        }
                    })
                }, 300)


            }




        };
    },
})