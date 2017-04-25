var app = getApp();
const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data: {
        selectedTags: [],
        hotTags: [],
        hotTagUrl: config.host + '/post/hotTags',

        tagStr: '',
        currentInput: '',
        tips: '',
        displayTips: false,
        tipsTop: 0,
        bgColor: '#bfbfbf',
        fontColor: "#fff",
        winHeight: app.globalData.systemInfo.windowHeight,
        winWidth: app.globalData.systemInfo.windowWidth,
    },
    onLoad: function () {
        var that = this;
        //请求获得最热标签;
        wx.request({
            url: that.data.hotTagUrl,
            method: 'GET',
            header: { 'Content-Type': 'application/json' },
            success: function (res) {
                that.setData({
                    //hotTags:res.data.data.tagsList
                    hotTags: res.data.data
                });
                if (app.globalData.postTag.length > 0) {
                    that.setData({
                        selectedTags: app.globalData.postTag
                    });
                }


            }
        });
    },
    goPost: function () {
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
    },
    inputTag: function (e) {
        var that = this;
        e.target.dataset.tagName = e.detail.value;
        if (e.target.dataset.tagName.length > 7) {
            wx.showModal({
                title: '提示',
                content: '超出长度了哦',
                showCancel: false,
            })
            return;
        } else {
            that.setData({
                currentInput: e.detail.value,
                bgColor: '#ea4f16',
                fontColor: "white",
            });
        }

    },
    changeColor: function (e) {
        var that = this;

        that.setData({

        });


    },
    //从最热标签里选中了一个
    tapHotTag: function (event) {
        var that = this;
        var newTag = event.target.dataset.name;
        that.addTag(newTag);
    },
    addTag: function (tag) {
        var that = this;
        tag = func.trim(tag);
        tag = tag.replace(/\s/g, "");
        if (app.globalData.postTag.length >= 4) {
            // console.log('标签数最多为4')
            /*
            that.setData({
                displayTips:true,
                tips:'最多只可添加6个标签'
            })       
            setTimeout(function(){
                that.setData({
                    displayTips:false,
                    tips:''
                })
            },3000)*/
            wx.showModal({
                title: '提示',
                content: '最多只可添加4个标签',
                showCancel: false,
            })
            return;
        }
        if (!tag)
            return;
        //判断新添加的tag是否已存在
        if (app.globalData.postTag.indexOf(tag) === -1) {
            if (that.data.selectedTags.length === 0) {
                that.setData({
                    tagStr: that.data.tagStr + tag
                });
            }
            else {
                that.setData({
                    tagStr: that.data.tagStr + " " + tag
                });
            }
            //that.setData({
            //selectedTags:that.data.tagStr.split(" ")
            //})
            that.setData({
                selectedTags: that.data.selectedTags.concat([tag])
            })
            app.globalData.postTag.push(tag);
            // console.log(app.globalData.postTag);
        }
        else {
            wx.showModal({
                title: '提示',
                content: '标签已存在',
                showCancel: false,
            })
            // console.log('标签已存在');
        }
        //拼接至全局tag数组
        //app.globalData.postTag = that.data.selectedTags;
    },

    testReset: function (e) {
        var that = this;
        that.addTag(that.data.currentInput);
        that.setData({
            bgColor: '#bfbfbf',
            fontColor: "#fff",
            currentInput: ''
        });
    },
    //点击已添加标签删除
    deleteTag: function (e) {
        var that = this;
        var tagName = e.currentTarget.dataset.tag;
        // console.log(e)
        var index = app.globalData.postTag.indexOf(tagName);
        app.globalData.postTag.splice(index, 1);
        that.setData({
            selectedTags: app.globalData.postTag
        });
    }
})