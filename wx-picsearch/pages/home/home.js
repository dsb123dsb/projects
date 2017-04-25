var network_util = require('../../utils/network_util.js');
var json_util = require('../../utils/json_util.js');
const config = require('../../config.js');
var app = getApp();
Page({
    data: {
        colorSheet: ['#fef3f3', '#fdfde9', '#ecf7f7', '#f4fdf2', '#faf1fe', '#fdf7ea'],
        division: [
            // divisionId, divisonIcon(地址), divisonName
            // {divisionId:'1',divisionIcon:'../../image/home/u694.png',divisionName:'一级分类名'},
        ],
        picUrl: 'https://www.treeholeapp.com/wx-picsearch/icon/',
        topNewList: [
            // pictureId, pictureSrc
            { pictureId: '1', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '2', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '3', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '4', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '5', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '6', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '7', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '8', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '9', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '13', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '14', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '15', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '16', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
            { pictureId: '17', pictureSrc: 'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63' },
        ],
        topHotList: [
            // pictureId, src
            //{pictureId:'1', pictureSrc:'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63'},
        ],
        winHeight: 0,
        winWidth: 0,
        topHotPage: 0,
        topNewPage: 0,
        hasMore: false,
        topNewURL: config.host + '/index/topnew',
        topHotURL: config.host + '/index/tophot',
        divisionURL: config.host + "/index/division",
        displayRefresh: false,   //拉至顶端时 显示加载动画
        displayLoading: false,    //拉至底部时 显示加载动画
        displayNoMore: false,
        displayBackTop: false,
        displayUpdate: false,
        updateNum: 0,              //刷新时显示更新了多少条记录
        currentTab: 1, // tab切换,0位最新，1为最热
        swiperLength: 0,

        tabBottom: 0,
        showTabBar: true,
        topPos: 2,
        updateWidth: 0,   //更新记录动画参数
        loadAnimationSrc: '../../image/global/loadingAnimation.gif',

        myId: '',//客服消息来源和我的ID
        isIphone: true,
        firstLoad: true,
        isHome: true,
        click: false
    },
    //获取所有分类列表
    loadDivision: function () {
        var that = this;
        wx.request({
            url: that.data.divisionURL,
            header: { 'Content-Type': 'application/json' },
            method: 'GET',
            success: function (res) {
                that.setData({
                    //division:res.data.data.list,
                    division: res.data.data,
                });

                console.log(res);
            },
            fail: function (res) { }
        });
    },
    loadTopNew: function (pageNum) {
        var that = this,
            tempList = that.data.topNewList,
            topURL = that.data.topNewURL + '?page=' + pageNum + '&divisionId=';

        wx.request({
            url: topURL,
            header: { 'Content-Type': 'application/json' },
            method: 'GET',
            success: function (res) {
                if (pageNum === 0) {  //如果是刷新，清空原来的列表重新加载
                    that.setData({
                        topNewList: []
                    })
                    console.log('刷新')
                }
                that.setData({
                    topNewList: that.data.topNewList.concat(res.data.data.list),
                    hasMore: res.data.data.hasMore,
                    topNewPage: res.data.data.page + 1,  //下次请求最新图片时的页码              
                    displayLoading: false,
                });
                console.log('请求最新成功')
                console.log(that.data.topNewPage)
            },
            fail: function (res) {
                console.log('请求最新失败');
                that.setData({
                    displayLoading: false
                })
            },
            complete: function () {
                //console.log('请求最新complete');
                setTimeout(function () {
                    that.setData({
                        displayRefresh: false
                    });
                    if (pageNum === 0) {  //如果是刷新
                        if (!that.data.firstLoad) {
                            that.setData({
                                displayUpdate: true,
                            })
                        }
                        // 匹配tempList里的第一张图片在第二次请求获得的集合that.data.topNewList里面的位置
                        var update = that.calUpdateNum(tempList, that.data.topNewList);
                        that.setData({
                            updateNum: update
                        });
                        that.updateAnimation();
                    }
                }, 1000); //请求完成 1000ms后加载动画消失，加载动画消失后显示“更新了x条记录”  
                var length = (that.data.currentTab === 0) ? (that.data.topNewList.length) : (that.data.topHotList.length);
                if (length < 4)
                    length = 4
                that.setData({
                    swiperLength: Math.ceil((length / 2)) * 170
                });
            }
        });
    },
    loadTopHot: function (pageNum) {
        var that = this;
        var tempList = that.data.topHotList;
        var topURL = that.data.topHotURL + '?page=' + pageNum + '&divisionId=';
        wx.request({
            url: topURL,
            header: { 'Content-Type': 'application/json' },
            method: 'GET',
            success: function (res) {
                if (pageNum === 0) {  //如果是刷新，清空原来的列表重新加载
                    that.setData({
                        topHotList: []
                    })
                }
                console.log(res.data.data)
                that.setData({
                    topHotList: that.data.topHotList.concat(res.data.data.list),
                    hasMore: res.data.data.hasMore,
                    topHotPage: res.data.data.page + 1,  //下次请求最热图片时的页码              

                    displayLoading: false,
                });
                console.log('请求最热成功')
            },
            fail: function (res) {
                console.log('请求最热失败');
                that.setData({
                    displayLoading: false
                })
            },
            complete: function () {
                //console.log('请求最热complete');
                setTimeout(function () {
                    that.setData({
                        displayRefresh: false
                    });
                    if (pageNum === 0) {  //如果是刷新
                        if (!that.data.firstLoad) {
                            that.setData({
                                displayUpdate: true,
                            })
                        }
                        // 匹配tempList里的第一张图片在第二次请求获得的集合that.data.topHotList里面的位置
                        var update = that.calUpdateNum(tempList, that.data.topHotList);
                        that.setData({
                            updateNum: update,
                        });
                        that.updateAnimation();

                    }
                }, 1000); //请求完成 1000ms后加载动画消失
                var length = (that.data.currentTab === 0) ? (that.data.topNewList.length) : (that.data.topHotList.length);
                if (length < 4)
                    length = 4
                that.setData({
                    swiperLength: Math.ceil((length / 2)) * 170
                });
            }
        });
    },
    onShow: function () {
        this.setData({
            click: false
        })
    },
    onLoad: function (options) {
        var that = this;
        // 获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    isIphone: /iPhone/.test(res.model)
                })
            }
        });
        //   wx.clearStorageSync();//缓存出错时可清除缓存，重新重后台获取数据
        //从缓存中调取userInfo,如果缓存不存在则使用code重新登录，如果缓存存在，请求账号状态
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            console.log('有用户信息缓存'); console.log(userInfo);
            app.globalData.userInfo = userInfo;
            that.setData({
                myId: app.globalData.userInfo.id,

            }); console.log(that.data.myId)
        }
        else {  //如果缓存不存在，再登录
            app.login();
            setTimeout(function () {
                that.setData({
                    myId: app.globalData.myInfo.userId,

                })
            }, 3000)
            console.log('无用户信息缓存')
        }
        // 加载分类
        if (that.data.divisionURL)
            that.loadDivision();

        // 加载最新图片
        if (that.data.topNewURL) {
            that.loadTopNew(0);
        }
        // 加载最热图片
        if (that.data.topHotURL) {
            that.loadTopHot(0);
        }
        /* temp */
        var length = (that.data.currentTab === 0) ? (that.data.topNewList.length) : (that.data.topHotList.length);
        if (length < 4)
            length = 4
        that.setData({
            swiperLength: Math.ceil((length / 2)) * 170
        });

    },
    onReady: function () {
        var that = this;
        // 获取我的ID
    },
    // 点击tab切换
    switchNav: function (e) {
        var that = this;
        if (this.data.currentTab == e.currentTarget.dataset.current) {  //点击的tab就是当前所显示的，什么也不做
            return false;
        }
        else {
            that.setData({
                currentTab: e.currentTarget.dataset.current,           //切换tab
                hasMore: true
            })
        }
    },
    // 滑动切换tabtab
    bindSwiperChange: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //滚动至底部的事件处理程序
    loadMore: function () {
        console.log('scroll to lower, load more');
        var that = this;
        if (that.data.displayLoading)
            return;
        //如果已经全部加载完
        if (!this.data.hasMore) {
            that.setData({
                displayNoMore: true  //显示没有更多
            })
            that.updateAnimation();
            setTimeout(function () {
                that.setData({
                    displayNoMore: false,
                    displayLoading: false
                })
            }, 1500);
            return;
        }


        that.setData({
            displayLoading: true  //显示底部加载动画
        })
        // 1500ms gif后再加载
        setTimeout(function () {
            if (that.data.currentTab == 0) {
                that.loadTopNew(that.data.topNewPage);
            }
            else {
                that.loadTopHot(that.data.topHotPage);
            }
        }, 2000);



    },
    //滚动至顶部的事件处理程序
    refresh: function () {
        console.log('scroll to upper, refresh');
        var that = this;
        if (that.data.displayRefresh || that.data.displayUpdate)  //如果已经正在请求刷新，则返回
            return;
        // 重新请求获得分类信息
        that.loadDivision();
        // 重新请求获得最新或最热图片
        that.setData({
            topHotPage: 0,
            topNewPage: 0,
            //topNewList:[],
            //topHotList:[],
            hasMore: true,
            displayRefresh: true,
            displayLoading: false,
            updateNum: 0,
            loadingAnimationSrc: '../../image/global/loadingAnimation.gif'
        });
        if (that.data.currentTab === 0) {

            that.loadTopNew(0);

        }
        else {

            that.loadTopHot(0);

        }
        console.log('fresh()end:page:' + that.data.topNewPage)
    },
    //滚动事件处理程序 滚动时显示或隐藏tabBarBar
    bindScroll: function (e) {
        var dy = e.detail.deltaY;
        var that = this;
        var ypos = e.detail.scrollTop;
        if (that.data.displayLoading || that.data.displayNoMore) {
            that.setData({
                topPos: ypos + 35
            })
            return;
        }


        // 滚动到一定高度后出现“回到顶部按钮”
        if (ypos === 0) {
            console.log('滚动顶部')
            //that.refresh();
        }
        var threshold = 2 * that.data.winHeight; //阈值为两屏
        //var threshold = 100;
        if (ypos > threshold)
            that.setData({
                displayBackTop: true
            });
        else
            that.setData({
                displayBackTop: false
            });
        that.setData({
            topPos: e.detail.scrollTop
        });
    },
    hidetabBar: function () {
        var that = this;

        hideAnimation();
        function hideAnimation() {
            if (that.data.showTabBar)
                return;
            var bottom = that.data.tabBottom;
            if (that.data.displayNoMore) {  //如果显示底部“没有更多了”，隐藏tabBar
                that.setData({
                    tabBottom: -57
                });
                return;
            }
            if (bottom > -57) {
                that.setData({
                    tabBottom: ((bottom - 5) < -57) ? -57 : (bottom - 5)
                });
                setTimeout(hideAnimation, 30);
            }
            else
                return;
        }
    },
    showBar: function () {
        var that = this;

        showAnimation();
        function showAnimation() {
            if (!that.data.showTabBar)
                return;
            var bottom = that.data.tabBottom;
            if (that.data.displayNorMore) {
                that.setData({
                    tabBottom: -57
                });
                return;
            }
            if (bottom === 0)
                return;
            if (bottom < 0) {
                that.setData({
                    tabBottom: ((bottom + 5) > 0) ? 0 : (bottom + 5)
                });
                setTimeout(showAnimation, 30);
            }
            else
                return;
        }
    },
    backToTop: function () {
        var that = this;

        that.setData({
            topPos: 30
        })
        console.log(that.data.topPos);
    },
    updateAnimation: function () {
        //300ms内完成展开
        var that = this;
        var delta = 10;   //每30ms展开10%
        updateWidth();
        function updateWidth() {
            var width = that.data.updateWidth;
            if (width >= 100) {
                setTimeout(function () {
                    that.setData({
                        displayUpdate: false,
                        updateWidth: 0,
                        firstLoad: false
                    });

                }, 1500);   //停1500ms
                return;
            }
            that.setData({
                updateWidth: width + delta
            });
            setTimeout(updateWidth, 30);
        }
    },

    //匹配第一次请求的第一张图在第二次请求获得的集合里面的位置
    calUpdateNum: function (list1, list2) {
        if (list1.length === 0)
            return list2.length;
        var obj0 = list1[0];
        for (var i = 0; i < list2.length; i++) {
            if (isObjectValueEqual(obj0, list2[i])) {
                console.log('calUpdateNum:' + i);
                return i;
            }
        }
        return 20;

        // 比较两个对象
        /*
        function isObjectValueEqual(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
        
            if (aProps.length != bProps.length) {
                return false;
            }
        
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        }*/
        function isObjectValueEqual(a, b) {
            if (a.pictureId == b.pictureId) {
                return true;
            }
            return false;
        }
    },
    /*
    onReachBottom:function(){
        var that = this;
        console.log('onReachBottom')
        that.loadMore();
    },*/
    post: function () {
        app.post();
    },

    gome: function () {
        var that = this;
        // 获取我的ID
        if (!app.globalData.myInfo) {
            wx.showModal({
                title: '提示',
                content: '未成功登录，请重新登录',
                confirmText: '重新登录',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        app.login();
                    }
                }
            })
        }
        else {
            that.setData({
                myId: app.globalData.myInfo.userId
            })
            wx.redirectTo({
                url: '../me/me?userId=' + app.globalData.myInfo.userId,
            })
        }

    },
    clickNavi: function () {
        console.log('click')
        this.setData({
            click: true
        })
    },
    // 分享接口分享接口
    onShareAppMessage: function () {
        return {
            title: '找图神器',
            desc: '总有你要的图',
            path: 'pages/home/home'
        }
    },
    //点击客服消息按钮
    messageButton: function (e) {

    }
})