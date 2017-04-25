var app = getApp()
var test = ''
const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data:{
        userInfo:{},
        colorSheet:[],
        colorSheet:['#d3ebf2','#f4f1d4','#d6e9b6','#f5d2c3','#f9e6ba','#e0b5c4'],
        myPostList:[
            // pictureId, pictureSrc, pictureTitle
            //{pictureId:'abc', pictureSrc:'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63',pictureTitle:'图片标题'},
        ],
        myCollectionList:[
            // pictureId, pictureSrc, pictureTitle
            //{pictureId:'abc', pictureSrc:'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63',pictureTitle:'图片标题'},
        ],
        getUserPostURL:config.host+'/me/myPost',
        getUserCollectURL:config.host+'/me/myCollection',
        getUserInfoURL:config.host+'/me/userInfo',
        currentTab:0,
        swiperLength:0,
        isMyPage:false,
        winWidth:0,
        winHeight:0,
        click:false,
        
        hasMore:true,
        postPage:0,
        collectPage:0,
        displayLoading:false,
        displayNoMore:false,
        updateWidth:0,
    },
    onLoad:function(options){
        var that = this;
        if(!app.globalData.myInfo){
            console.log('重新登录')
            app.login();
        }
        // 检查该个人中心页面是我的页面还是其它用户的页面
        if(options.userId === app.globalData.myInfo.userId){
            that.setData({
                isMyPage:true,
                isMe:true,
                userInfo:app.globalData.myInfo
            });
            console.log('我自己的')
        }
        else{
            //从数据库中获取寻图用户信息
            that.getUserInfo(options.userId);
            console.log('别人的')
            console.log(options.userId)
            console.log(app.globalData.myInfo.userId)
        }
        //获得系统信息
        that.setData({
            winWidth:app.globalData.systemInfo.windowWidth,
            winHeight:app.globalData.systemInfo.windowHeight
        })

        //获取图片列表
        this.getUserPost(options.userId,0);
        this.getUserCollections(options.userId,0);
    },
    onShow:function(){
        this.setData({
            click:false
        })
        if(this.data.isMyPage){
            var cover = wx.getStorageSync('coverSrc')
            if(cover)
            app.globalData.myInfo.userCoverSrc = cover
            this.setData({
                userInfo: app.globalData.myInfo
            })
        }
        
        
        var id = this.data.userInfo.userId
        if(id){
            this.getUserPost(id,0);
            this.getUserCollections(id,0);
            this.setData({
                hasMorePost:true,
                hasMoreCollec:true
            })
        }
    },
    //获取用户信息
    getUserInfo:function(userId){
        var that = this;
        wx.request({
            url:that.data.getUserInfoURL + "?userId=" + userId,
            method:'GET',
            header:{'Content-Type':'application/json'},
            success:function(res){
                that.setData({
                    userInfo:res.data.data
                });
            }
        })
    },
    //获取我上传的图片列表
    getUserPost:function(userId,page){
        var that = this;
        if(!that.data.hasMore)
            return;
        wx.request({
            url:that.data.getUserPostURL+'?userId='+userId + '&page=' + page,
            header:{'Content-Type':'application/json'},
            method:'GET',
            success:function(res){
                //console.log(res.data)
                console.log('get post:' + that.data.postPage)
                if(page == 0){
                    that.setData({
                        myPostList: res.data.data.list
                    })
                }
                else{
                    that.setData({
                        myPostList:that.data.myPostList.concat(res.data.data.list)
                    })
                    console.log('post concat')
                }
                that.setData({
                    //myPostList:res.data.data.list
                    hasMore:res.data.data.hasMore,
                    postPage:res.data.data.page + 1,
                    displayLoading:false
                })

            },
            fail:function(res){},
            complete:function(res){}
        })
    },
    //获取我收藏的图片列表
    getUserCollections:function(userId,page){
        var that = this;
        if(!that.data.hasMore)
            return;
        wx.request({
            url:that.data.getUserCollectURL+'?userId='+userId + '&page=' + page,
            header:{'Content-Type':'application/json'},
            method:'GET',
            success:function(res){
                console.log('get collect:' + that.data.collectPage)
                if(page == 0){
                    that.setData({
                        myCollectionList: res.data.data.list
                    })
                }
                else{
                    that.setData({
                        myCollectionList:that.data.myCollectionList.concat(res.data.data.list)
                    })
                    console.log('collections concat')
                }
                that.setData({
                    //myCollectionList:res.data.data.list
                    hasMore:res.data.data.hasMore,
                    collectPage:res.data.data.page + 1,
                    displayLoading:false
                });

            },
            fail:function(res){},
            complete:function(res){}
        })
    },
    // 点击封面图片 更换封面
    changeCoverImage:function(){
        var that = this;
        if(!that.data.isMyPage)   //不是我的主页不能更换封面
            return;
        wx.showActionSheet({
            itemList: ['修改封面图'],
            success: function(res) {
                if (!res.cancel) {
                    console.log('更换封面');
                    chooseImage();
                }
            }
        });

        function chooseImage(){
            var tempPath = '';
            //从相册选择图片
            wx.chooseImage({
                count:1,
                sizeType:['original','compressed'],
                sourceType:['album','camera'],
                success:function(res){
                    tempPath = res.tempFilePaths[0];
                    console.log(tempPath);
                    //获得图片的临时地址后转到裁剪页面
                    if(tempPath)
                        wx.navigateTo({
                            url: '../clipCoverImage/clipCoverImage?pictureSrc='+tempPath
                        })
                }
            })
        }

    },

    // 点击tab切换
    switchNav:function(e){
        var that = this;
        if(this.data.currentTab == e.currentTarget.dataset.current){  //点击的tab就是当前所显示的，什么也不做
            return false;
        }
        else{
            that.setData({
                currentTab:e.currentTarget.dataset.current           //切换tab
            })
        }

    },
    // 滑动切换tab
    bindSwiperChange:function(e){
        var that = this;
        that.setData({
            currentTab:e.detail.current,
            hasMore:true
        });

    },
    post:function(){
        app.post();
    },
    godetail:function(e){
        var pictureId=e.currentTarget.dataset.id
        if(!this.data.click){
            wx.navigateTo({
                url: '../detail/detail?pictureId='+pictureId,
                success: function(res){
                    console.log('成功跳转')
                },
                fail: function() {
                    console.log('前往详情页跳转失败')
                    wx.redirectTo({
                        url: '../detail/detail?pictureId='+pictureId,
                        success: function(res){
                            console.log('内层重定向成功')
                        },
                        fail: function() {
                            console.log('内层重定向失败')
                        }
                    })
                }
            })
        }
        this.setData({
            click:true
        })
    },
    loadMore:function(){
        console.log('scroll to lower, load more');
        var that = this;
        if(that.data.displayLoading)
            return;

        //如果已经全部加载完
        if(!that.data.hasMore){ 
            that.setData({
                displayNoMore:true  //显示没有更多
            })
            that.updateAnimation();
            setTimeout(function(){
                that.setData({
                    displayNoMore:false,
                    displayLoading:false
                })
            },1500);
            return;
            console.log('has more return')
        }  

        that.setData({
            displayLoading:true  //显示底部加载动画
        })
        // 1500ms gif后再加载
        setTimeout(function(){
            if(that.data.currentTab==0){
                that.getUserPost(that.data.userInfo.userId, that.data.postPage);
            }
            else{
                that.getUserCollections(that.data.userInfo.userId, that.data.collectPage);
            }
        },2000);
    },
    //“没有更多了”展开动画
    updateAnimation:function(){
        //300ms内完成展开
        var that = this;
        var delta = 10;   //每30ms展开10%
        updateWidth();
        function updateWidth(){
            var width = that.data.updateWidth;
            if(width>=100){
                setTimeout(function(){
                    that.setData({
                        displayUpdate:false,
                        updateWidth:0,
                        firstLoad:false
                    });

                },1500);   //停1500ms
                return;
            }
            that.setData({
                updateWidth:width+delta
            });
            setTimeout(updateWidth,30);
        }
    },
    
})