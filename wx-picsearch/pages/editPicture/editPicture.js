var app = getApp();
const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data:{
        pictureInfo:{},
        pictureDetailURL: config.host + '/index/pictureDetail',
        myInfo:{},
        tags:[],
        hasPicture:true,

        submitEditURL: config.host + '/me/editPicture',
        titleContent:'',
        descContent:'',

        winWidth:app.globalData.systemInfo.windowWidth,
        winHeight:app.globalData.systemInfo.windowHeight
    },
    onLoad(options){
        var that = this;
        that.setData({
            myInfo:app.globalData.myInfo
        })

        //由pictureId获取图片信息
        wx.request({
            url:that.data.pictureDetailURL+'?pictureId=' + options.pictureId + '&userId=' + that.data.myInfo.userId,
            header:{'Content-Type':'application/json'},
            method:'GET',
            success:function(res){
                that.setData({
                    pictureInfo:res.data.data.picture,
                    titleContent:res.data.data.picture.pictureTitle || '',
                    descContent:res.data.data.picture.pictureDesc || ''
                })
                
                var tagStr = that.data.pictureInfo.pictureTags;
                if(tagStr){
                    that.setData({
                        tags:tagStr.split(/,\s*/g)
                    })
                    app.globalData.postTag = that.data.tags;
                }
            },
            fail:function(res){
                console.log(res);
            }
        })

    },
    onShow(){
        var that = this;
        that.setData({
            tags:app.globalData.postTag
        })
    },
    deleteTag:function(e){
        var that = this;
        var tagName = e.target.dataset.name;
        var index = app.globalData.postTag.indexOf(tagName);
        app.globalData.postTag.splice(index,1);
        console.log(app.globalData.postTag);
        that.setData({
            tags:app.globalData.postTag,
        });
        if(that.data.tags.length === 0){
            that.setData({
                tagOK:false
            });
        }
    },
    inputTitle:function(e){
        var that = this;
        that.setData({
            titleContent:e.detail.value
        })
    },
    inputDesc:function(e){
        var that = this;
        that.setData({
            descContent:e.detail.value
        })
        console.log(that.data.descContent)
    },
    submitEdit:function(){
        var that = this;
        wx.showToast({
            title: '正在发布',
            icon: 'loading',
            duration: 10000
        })
        request();
        function request(){
            var urlParams = func.json2Form({
                pictureId:that.data.pictureInfo.pictureId,
                pictureDesc:that.data.descContent,
                pictureTitle:that.data.titleContent,
                pictureTags:JSON.stringify(app.globalData.postTag)
            })
            console.log(urlParams)
            wx.request({
                url:that.data.submitEditURL + '?' + urlParams,
                header:{'Content-Type':'application/json'},
                method:'POST',
                success:function(res){
                    if(res.data.success){
                        console.log('修改成功');
                        wx.hideToast()
                        wx.showToast({
                            title:'修改成功',
                            icon:'success',
                            duration:1500
                        })
                        //回到详情页
                        setTimeout(function(){
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        },1500)   
                    }
                    else{
                        that.editFailWarning();
                    }
                },
                fail:function(res){
                    console.log(res)
                    //显示修改失败
                    that.editFailWarning();
                }
            })
        }
    },
    editFailWarning:function(){
        wx.hideToast();
        wx.showModal({
            title:'提示',
            content:'修改失败',
            showCancel:false
        })
    }
})