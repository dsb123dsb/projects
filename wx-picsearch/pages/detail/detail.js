var app = getApp()
const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data:{
        pictureInfo:{
        },
        userInfo:{
            userId:''
        },   //我的信息???
        imageInfo:{

        },
        authorInfo:{}, //作者的信息
        winHeight:app.globalData.systemInfo.windowHeight,
        winWidth:app.globalData.systemInfo.windowWidth,
        pictureDetailURL:config.host+'/index/pictureDetail',
        collectURL:config.host+'/index/collect',
        cancelCollectURL:config.host+'/index/cancelCollect',
        reportURL:config.host+'/index/report',
        downloadStatisticsURL:config.host+'/index/download',
        deleteURL:config.host+'/me/deletePicture',
        isMyWork:false,
        isMyCollect:false,
        tags:[],

        tabBottom:0,
        showTabBar:true,

        displayLongtap:false,
        isIphone: app.globalData.systemInfo.isIphone,

        pictureId:''
    },
    onLoad:function(options){
        
        var that = this;
        wx.showToast({
            title:'正在加载图片',
            icon:'loading',
            duration:10000,
        });

        that.setData({
            pictureId:options.pictureId
        })

        //通过图片id获取图片详情（预览图地址、图片标题、图片简介、标签、作者信息)
        if(app.globalData.myInfo){
            console.log('已登录')
            //app.js里的全局用户（我的）信息
            that.setData({
                userInfo : app.globalData.myInfo
            })
            that.getPictureInfo(options.pictureId,that)
        }
        else{
            console.log('未登录')
            that.login();  //先登录再获取图片信息
        }
    },
    onReady:function(){
        var that = this;
    },
    onShow:function(){
        //console.log('onshow')
        var that=this;
        //app.js里的全局用户（我的）信息
        that.setData({
            userInfo : app.globalData.myInfo
        })
        //通过图片id获取图片详情（预览图地址、图片标题、图片简介、标签、作者信息)
        if(that.data.pictureInfo.pictureId)
            that.getPictureInfo(that.data.pictureInfo.pictureId,that)
    },
    getPictureInfo(pictureId,that){
        wx.request({
            url:that.data.pictureDetailURL+'?userId='+that.data.userInfo.userId+'&pictureId='+pictureId,
            header:{'Content-Type':'application/json'},
            method:'GET',
            success:function(res){
                console.log(res.data);
                that.setData({
                    pictureInfo:res.data.data.picture,
                    isMyWork:res.data.data.myWork,
                    isMyCollect:res.data.data.collect,
                    
                })
                var tagStr = that.data.pictureInfo.pictureTags
                if(tagStr)
                    that.setData({
                        tags:tagStr.split(/,\s*/g)
                    })
                console.log('detail请求成功');
                console.log(res.data.data.picture);
                //请求OSS图片信息，获取图片宽高
                wx.request({
                    url: res.data.data.picture.pictureSrc + '?x-oss-process=image/info',
                    method:'GET',
                    success:function(res){
                        that.setData({
                            imageInfo:{
                                width:res.data.ImageWidth.value,
                                height:res.data.ImageHeight.value
                            }
                        })
                        console.log(res);
                        wx.hideToast();
                    },
                    fail:function(res){
                        console.log(res);
                        wx.hideToast();
                    }
                })
            },
            fail:function(){
                console.log('detail请求失败');
            },
            complete:function(){

            }
        });

    },
    /* 下载图片 */
    download:function(){
        var that = this;
        that.previewImage();
        //downloadStatistics();
        /*
        var resourceURL = that.data.pictureInfo.pictureSrc;
        //提示正在保存
        wx.showToast({
            title:'正在保存',
            icon:'loading',
            duration:10000,
        });  
        //下载资源到本地
        wx.downloadFile({
            url:resourceURL,
            type:'image',
            success:function(res){
                console.log('下载成功')
                wx.saveFile({
                    tempFilePath:res.tempFilePath,
                    success:function(res){
                        //提示保存成功
                        console.log('保存成功');
                        wx.hideToast();
                        wx.showToast({
                            title:'保存成功',
                            icon:'success',
                            duration:1500,
                        });  
                        downloadStatistics(); 
                    },
                    fail:function(res){
                        console.log('保存失败');
                        wx.hideToast();
                        wx.showModal({
                            title: '提示',
                            content: '下载失败',
                            showCancel:false,
                            success: function(res) {}
                        })
                    },
                    complete:function(res){}
                })
            },
            fail:function(res){
                // 下载失败
                console.log('下载失败\n'+res);
                wx.hideToast();
            }
        })*/

    },
    collect:function(){
        var that = this;
        that.loginWarning();
        var urlParams = func.json2Form({
            pictureId:that.data.pictureInfo.pictureId,
            userId:that.data.userInfo.userId
        })
        wx.request({
            url:that.data.collectURL+'?'+urlParams,
            header:{'Content-Type':'application/x-www-form-urlencoded'},
            method:'POST',
            success:function(res){
                if(res.data.data.isCollect){  //收藏成功
                    that.setData({
                        isMyCollect:true
                    });
                    console.log('收藏成功');
                }
                
            },
            fail:function(res){
                console.log('收藏失败');
            }
        })
    },
    cancelCollect:function(){
        var that = this;
        var urlParams = func.json2Form({
            pictureId:that.data.pictureInfo.pictureId,
            userId:that.data.userInfo.userId
        })
        wx.request({
            url:that.data.cancelCollectURL + '?' + urlParams,
            header:{'Content-Type':'application/x-www-form-urlencoded'},
            method:'POST',
            success:function(res){
                if(res.data.data.isCanceled){  //取消成功
                    that.setData({
                        isMyCollect:false
                    });
                    console.log('取消成功');
                }
                else{
                    console.log('取消失败');
                }
                
            },
            fail:function(res){
                console.log('取消失败');
            }
        })
    },
    report:function(){
        var that = this;
        var url = that.data.reportURL;
        that.loginWarning();
        wx.showActionSheet({
            itemList:["淫秽色情","违法信息","广告营销","版权盗用"],
            itemColor:"#030303",
            success:function(res){
                if(!res.cancel){                 
                    submitReport(res.tapIndex);
                }
            }

        });
        //post举报信息
        function submitReport(typeIndex){
            console.log('举报:'+url);
            var urlParams = func.json2Form({
                pictureId:that.data.pictureInfo.pictureId,
                userId:that.data.userInfo.userId,
                type:typeIndex
            })
            wx.request({
                url:url + '?' + urlParams,
                header:{'Content-Type':'application/x-www-form-urlencoded'},
                method:'POST',
                success:function(res){
                    // show toast
                    if(res.data.success)
                        wx.showToast({
                            title:'举报成功',
                            icon:'success',
                            duration:1500,
                        })
                },
                complete:function(){}
            })
        }
    },
    //滚动事件处理程序 滚动时显示或隐藏tabBarBar
    bindScroll:function(e){
        var dy = e.detail.deltaY;
        var that = this;
        console.log('bindscroll')
        /*
        if(dy<0){
            //隐藏tabBar
            that.setData({
                showTabBar:false
            });
            if(that.data.tabBottom<-90)  //已隐藏 则保持隐藏
            {
                that.setData({
                    tabBottom:-90
                });
            }
            else{
                that.hidetabBar();
            }
        }
        else{
            //显示tabBar
            that.setData({
                showTabBar:true
            })
            if(that.data.tabBottom>0)
            {
                that.setData({
                    tabBottom:0
                });
            }
            else{
                that.showBar();
            }
        }*/
    },
    hidetabBar:function(){
        var that = this;

        hideAnimation();
        function hideAnimation(){
            if(that.data.showTabBar)
                return;
            var bottom = that.data.tabBottom;
            console.log('hide animation')
            if(bottom>-121){
                that.setData({
                    tabBottom:((bottom-20)<-90) ? -121:(bottom-20)
                });
                setTimeout(hideAnimation,50);
            }
            else
                return;
        }
    },
    showBar:function(){
        var that = this;

        showAnimation();
        function showAnimation(){
            if(!that.data.showTabBar)
                return;
            console.log('show ainimation')
            var bottom = that.data.tabBottom;
            if(bottom===0)
                return;
            if(bottom<0){
                that.setData({
                    tabBottom:((bottom+20)>0) ? 0:(bottom+20)
                });
                setTimeout(showAnimation,50);
            }
            else
                return;
        }
    },
    //点击编辑按钮
    edit:function(){
        var that = this;
        if(!that.data.isMyWork)
            return;
        //弹出actionsheet
        wx.showActionSheet({
            itemList: ['编辑', '删除'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                    if(res.tapIndex===0){
                        //跳转到编辑页面
                        wx.navigateTo({
                          url: '../editPicture/editPicture?pictureId='+that.data.pictureInfo.pictureId,
                          success: function(res){},
                          fail: function() {},
                          complete: function() {}
                        })
                    }
                    else{
                        //删除
                        //弹出模态框提示
                        wx.showModal({
                            title: '提示',
                            content: '是否确认删除？',
                            success: function(res) {
                                if (res.confirm) {
                                    deletePicture(that.data.pictureInfo.pictureId);
                                }
                            }
                        });
                    }
                }
            }
        });
        //发起请求删除该图片
        function deletePicture(pictureId){
            var urlParams = func.json2Form({
                pictureId:pictureId
            })
            wx.request({
                url:that.data.deleteURL+'?'+urlParams,
                method:'POST',
                header:{'Content-Type':'application/x-www-form-urlencoded'},
                success:function(res){
                    if(res.data.data.isSuccess){
                        //提示删除成功
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1000
                        });
                        setTimeout(function(){
                            wx.navigateBack({delta: 1});
                        },1000);  //toast提示显示1000ms后返回到之前的页面                     
                    }
                }
            })
        }
    },
    /* 点击图片或点击下载按钮 */
    previewImage:function(){
        var that = this;
        var alreadyDownload = wx.getStorageSync('alreadyDownload');
        //var alreadyDownload = false;
        if(alreadyDownload){  //不是第一次下载
            that.enterPreview()
        }
        else{  //是第一次下载 （缓存不存在）
            that.setData({
                displayLongtap:true
            })
            wx.setStorageSync('alreadyDownload', true)
        }

    },
    /* 点击我知道了 */
    enterPreview:function(){
        var that = this;
        that.setData({
            displayLongtap:false
        })
        wx.previewImage({
            urls: [that.data.pictureInfo.pictureSrc],
            success:function(res){
                console.log(res)
                // 怎么统计下载量？？
                that.downloadStatistics();
            }
        })
    },
    //统计下载量
    downloadStatistics :function(){
        var that = this;
        var urlParams = func.json2Form({
            pictureId:that.data.pictureInfo.pictureId,
            userId:app.globalData.myInfo.userId
        })
        wx.request({
            url:that.data.downloadStatisticsURL+'?'+urlParams,
            method:'POST',
            success:function(res){
                console.log('下载统计');
                console.log(res);
            },
            fail:function(res){},
            complete:function(res){}
        });
    },
    //跳转到用户主页，navigate失败则redirect
    gome:function(){
        var that = this;
        wx.navigateTo({
            url: '../me/me?userId='+that.data.pictureInfo.authorId,
            success: function(res){
                // success
            },
            fail: function() {
                wx.redirectTo({
                    url: '../me/me?userId='+that.data.pictureInfo.authorId
                })
            },
            complete: function() {
                // complete
            }
        })
    },
    gotag:function(e){
        var tag = e.currentTarget.dataset.tag;
        wx.navigateTo({
            url:"../tagDetail/tagDetail?tag=" + tag,
            success: function(res){
                // success
                console.log('gotag success')
            },
            fail: function() {
                wx.redirectTo({
                    url:"../tagDetail/tagDetail?tag=" + tag,
                })
                console.log('gotag fail')
            }
        })
    },
    loginWarning:function(){
        if(!app.globalData.myInfo){
            wx.showModal({
                title: '提示',
                content: '未成功登录',
                confirmText: '重新登录',
                success: function(res) {
                    if (res.confirm) {
                        app.login();
                    }
                }
            })
        }
    },
    login:function(){
        var that = this;
        wx.showToast({
            title: '正在登录',
            icon: 'loading',
            duration: 10000
        })
        //把code给后台，得到我的userInfo
        wx.login({
            success: function(res) {
                console.log('code:')
                console.log(res.code)
                if (res.code) {
                    //发起网络请求 把code传给后台
                    wx.request({
                        url: app.data.loginURL+'?'+'code='+res.code,
                        method:'POST',
                        header:{'Content-Type':'application/json'},
                        // data: {
                        //     code: res.code
                        // },
                        success:function(r){   //后台返回user
                            if(r.data.data){
                                app.globalData.myInfo = r.data.data
                                app.globalData.myInfo.userId = r.data.data.id
                                app.globalData.myInfo.userName = r.data.data.name
                                app.globalData.myInfo.userAvatar = r.data.data.avatar
                                app.globalData.myInfo.userIntroduction = r.data.data.introduction
                                app.globalData.myInfo.userCoverSrc = r.data.data.cover
                                console.log(r.data.data)
                                console.log('把code传给后台，后台成功返回userIndo')
                                // if(!logs){  //如果logs为空
                                //     logs = []
                                // }
                                //每次登陆绑定用户信息（头像、昵称等）
                                app.bindUserInfo(app.globalData.myInfo.userId)                             
    
                                // logs.unshift(Date.now())
                                // wx.setStorageSync('logs', logs)
                                wx.hideToast();
                                wx.showToast({
                                    title:'登录成功',
                                    icon:'success',
                                    duration:1500
                                })

                                //app.js里的全局用户（我的）信息
                                that.setData({
                                    userInfo : app.globalData.myInfo
                                })

                                that.getPictureInfo(that.data.pictureId,that)


                            }
                        },
                        fail:function(r){
                            console.log(r)
                            console.log('登录失败')
                        }
                    })
                } 
                else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            },
            fail:function(res){console.log('login fail');console.log(res.errMsg)}
        });
    },
    onShareAppMessage: function () {
        var tittle=this.data.pictureInfo.pictureTitle,
        desc=this.data.pictureInfo.pictureDesc,
        autho=this.data.pictureInfo.authorName,
        id=this.data.pictureId;
        return {
            title: tittle?tittle:"图片",
            desc: autho + '/' + (desc?desc:'我的最爱图片'),
            path: '/pages/detail/detail?pictureId='+id
        }
    }

})