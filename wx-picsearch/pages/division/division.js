const config = require('../../config.js');
var app = getApp();
Page({
    data: {
        colorSheet: ['#d3ebf2', '#f4f1d4', '#d6e9b6', '#f5d2c3', '#f9e6ba', '#e0b5c4'],
        divisionDetailURL: config.host + '/index/divisionDetail',
        divisionInfo: {
            divisionIcon: '../../image/home/u694.png',
            divisionName: '分类名',
            subDivisionList: [
                //    {
                //     subDivisionid:'id1',
                //     divisionName:'二级分类'
                // },{
                //     subDivisionid:'id1',
                //     divisionName:'二级分类'
                // },{
                //     subDivisionid:'id1',
                //     divisionName:'二级分类'
                // }
            ]
        },
        topNewList: [
            // pictureId, pictureSrc
            //{pictureId:'1', pictureSrc:'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63'},

        ],
        topHotList: [
            // pictureId, src
            //{pictureId:'1', pictureSrc:'http://aliyun.campusapp.cn/android/2016-03-23/f185ada7-360e-4034-a9f0-d31b1c7c3c63'},

        ],
        winHeight: 0,
        winWidth: 0,
        topHotPage: 0,
        topNewPage: 0,
        hasMore: true,
        topNewURL: config.host + '/index/topnew',
        topHotURL: config.host + '/index/tophot',
        displayRefresh: false,
        displayLoading: false,
        displayNoMore: false,
        displayTabBar: true,
        displayBackTop: false,
        updateNum: 0,
        // change
        currentTab: 1,
        swiperLength: 0,

        tabBottom: 0,
        showTabBar: true,
        topPos: 1,
        y: 0,
        updateWidth: 0,   //更新记录动画参数
        myId: '',
        divisionId: '',

        isIphone: true,
        firstLoad: true,
        isDivision: true,

        click: false
    },
    onShow: function () {
        this.setData({
            click: false
        })
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            divisionId: options.divisionId
        })
        //由分类id获取分类信息
        wx.request({
            url: that.data.divisionDetailURL + "?divisionId=" + options.divisionId,
            header: { 'Content-Type': 'application/json' },
            method: 'GET',
            success: function (res) {
                console.log('分类信息');
                console.log(res.data.data);
                that.setData({
                    divisionInfo: res.data.data,
                    divisionGroupHeight: (res.data.data.subDivisionList.length / 5) * 50,
                });
                wx.setNavigationBarTitle({
                    title: that.data.divisionInfo.divisionName
                })
            }
        })

        //获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    isIphone: /iPhone/.test(res.model)
                })
            }
        })

        //加载最热图片
        that.loadTopHot(0);
        that.setData({
            myId: app.globalData.myInfo.userId
        })

    },
    onReady() {
        var that = this;
        //设置导航条
        // wx.setNavigationBarTitle({
        //     title: that.data.divisionInfo.divisionName
        // })
    },

    loadTopHot: function (pageNum) {
        var that = this,
            topURL = that.data.topHotURL + '?page=' + pageNum + '&divisionId=' + that.data.divisionId,
            tempList = that.data.topHotList;
        wx.request({
            url: topURL,
            header: { 'Content-Type': 'application/json' },
            method: 'GET',
            success: function (res) {
                if (that.data.topHotPage === 0) {
                    that.setData({
                        topHotList: []
                    })
                }
                that.setData({
                    topHotList: that.data.topHotList.concat(res.data.data.list),
                    hasMore: res.data.data.hasMore,
                    topHotPage: res.data.data.page + 1,  //下次请求时的页码              
                    displayLoading: false,
                });
                console.log('请求最热成功');
            },
            fail: function (res) {
                console.log('请求最热失败');
                that.setData({
                    displayLoading: false
                })
            },
            complete: function () {
                console.log('请求最热complete');
                setTimeout(function () {
                    that.setData({
                        displayRefresh: false
                    });
                    if (pageNum === 0) {  //如果是刷新
                        if (!that.data.firstLoad)
                            that.setData({
                                displayUpdate: true
                            })
                        // 匹配tempList里的第一张图片在第二次请求获得的集合that.data.topHotList里面的位置
                        var update = that.calUpdateNum(tempList, that.data.topHotList);
                        that.setData({
                            updateNum: update
                        });
                        that.updateAnimation();
                    }
                }, 1000); //请求完成 1000ms后加载动画消失
            }
        });
    },
    //滚动至底部的事件处理程序
    loadMore: function () {
        console.log('load more');
        var that = this;
        if (that.data.displayLoading)
            return;
        // 如果已经全部加载完
        if (!this.data.hasMore) {
            that.setData({
                displayNoMore: true,  //显示没有更多
            })
            that.updateAnimation();
            setTimeout(function () {
                that.setData({
                    displayNoMore: false,
                    displayLoading: false
                })
            }, 1000);
            return;
        }
        if (!that.data.displayLoading) {//判定是否正在加载
            // 如果未全部加载完
            that.setData({
                displayLoading: true  //显示底部加载动画
            }); console.log(that.data.displayLoading)
            that.loadTopHot(that.data.topHotPage);
        }


    },
    //滚动至顶部的事件处理程序
    refresh: function () {
        console.log('scroll to upper, refresh');
        var that = this;
        if (that.data.displayRefresh || that.data.displayUpdate)  //如果已经正在请求刷新，则返回
            return;
        // 重新请求获得最新或最热图片
        that.setData({
            topHotPage: 0,
            topNewPage: 0,
            //topNewList:[],
            //topHotList:[],
            hasMore: true,
            displayRefresh: true,
            displayLoading: false,
            updateNum: 0
        });
        that.loadTopHot(0);
    },
    /* bindtouchstart */
    touchStart: function (e) {
        var that = this;
        that.setData({
            startPoint: e.touches[0]
        })
    },
    /* bindtouchmove (真机move失效)*/
    touchEnd: function (e) {
        var that = this,
            h = that.data.winWidth,
            w = that.data.winHeight,
            deltaY0 = that.data.y,
            currentPoint = e.changedTouches[0],
            startPoint = that.data.startPoint,
            deltaY = startPoint.clientY - currentPoint.clientY,//px
            y = deltaY0 + deltaY; console.log("deiphone:" + deltaY + "wh" + w + "aY" + y)
        if (app.globalData.systemInfo.isIphone) {//判断是苹果
            if (y > w * (4 / 5) && !that.data.displayLoading) {
                that.loadTopHot(that.data.topHotPage); console.log("iphone:more")
                if (y > w) {
                    that.setData({
                        y: y - w
                    })
                }
            } else {
                that.setData({
                    y: y
                })
            }
        }

    },
    //滚动事件处理程序 滚动时显示或隐藏tabBarBar
    bindScroll: function (e) {
        var that = this,
            h = that.data.winWidth,
            w = that.data.winHeight,
            dy = e.detail.deltaY,
            ypos = e.detail.scrollTop;
        if (app.globalData.systemInfo.isIphone) {//判断是苹果
            if (-dy > w * (4 / 5) && !that.data.displayLoading) {
                that.loadTopHot(that.data.topHotPage); console.log("iphone:more")
            }
        }

        if (that.data.displayLoading || that.data.displayNoMore) {
            that.setData({
                topPos: ypos + 35
            })
            return;
        }
        /*
        if(ypos > that.data.winHeight){
            if(dy<0){
                //隐藏tabBar
                that.setData({
                    showTabBar:false
                });
                if(that.data.tabBottom<-57)  //已隐藏 则保持隐藏
                {
                    that.setData({
                        tabBottom:-57
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
            }
        }*/

        // 滚动到一定高度后出现“回到顶部按钮”
        if (ypos === 0) {
            that.refresh();
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
            topPos: e.detail.scrollTop,
        });
    },
    hidetabBar: function () {
        var that = this;

        hideAnimation();
        function hideAnimation() {
            if (that.data.showTabBar)
                return;
            var bottom = that.data.tabBottom;
            console.log('hide animation')
            if (that.data.displayNoMore) {
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
            console.log('show ainimation')
            var bottom = that.data.tabBottom;
            if (that.data.displayNoMore) {
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
        var that = this,
            delta = 10;   //每30ms展开10%
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
                }, 1500);   //停1500
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
        function isObjectValueEqual(a, b) {
            if (a.pictureId == b.pictureId) {
                return true;
            }
            return false;
        }
    },
    post: function () {
        app.post();
    },
    gome: function () {
        var that = this;
        // 获取我的ID
        if (!app.globalData.myInfo) {
            wx.showModal({
                title: '提示',
                content: '未成功登录',
                confirmText: '重新登录',
                success: function (res) {
                    if (res.confirm) {
                        app.login();
                    }
                }
            })
        }
        else {
            that.setData({
                myId: app.globalData.myInfo.id
            })
            wx.redirectTo({
                url: '../me/me?userId=' + app.globalData.myInfo.userId,
            })
        }

    },
    goback: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    clickNavi: function () {
        console.log('click')
        this.setData({
            click: true
        })
    },
    onShareAppMessage: function () {
        var that = this, desc = that.data.divisionInfo.divisionName, id = that.data.divisionId;
        return {
            title: '找图神器',
            desc: desc + ' 你猜我发现了什么美图！快戳哦',
            path: 'pages/division/division?divisionId=' + id
        }
    }
})