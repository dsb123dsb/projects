const config = require('../../config.js');
const func = require('../../func.js');
Page({
    data:{
        winHeight:0,
        winWidth:0,
        list:[
            // pictureId, pictureSrc
            // {pictureId:'1', pictureSrc:'../../image/home/u694.png',pictureTitle:'图片标题'},
            // {pictureId:'1', pictureSrc:'../../image/home/u694.png',pictureTitle:'图片标题'},
            // {pictureId:'1', pictureSrc:'../../image/home/u694.png',pictureTitle:'图片标题'},
            // {pictureId:'1', pictureSrc:'../../image/home/u694.png',pictureTitle:'图片标题'},
        ],
        colorSheet:['#d3ebf2','#f4f1d4','#d6e9b6','#f5d2c3','#f9e6ba','#e0b5c4'],
        hasMore:true,
        page:0,
        displayLoading:false,
        displayNoNore:false,
        displayBackTop:false,
        displayNone:false,
        searchURL:config.host+'/index/search',
        keyword:'',
        updateWidth:0,
        topPos:0,

        isIphone:true,
    },
    onLoad:function(){
        var that = this;
        wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  winWidth:res.windowWidth,
                  winHeight:res.windowHeight,
                  isIphone:/iPhone/.test(res.model)
              })
          }
        })
    },
    // 提交搜索
    search:function(keyword){
        var that = this;
        if(!keyword)  //如果keyword为空
            return;
        keyword = func.trim(keyword);
        that.setData({
            keyword:keyword
        })

        console.log('搜索search()：'+keyword +' page:'+that.data.page)
        that.setData({
            list:[],               //清空list重新搜索
            page:0,
            displayLoading:true
        })
        wx.request({
            url:that.data.searchURL+'?page='+that.data.page+'&keyword='+keyword,
            header:{'Content-Type':'application/json'},
            method:'GET',
            success:function(res){
                if(res.data.success){
                    that.setData({
                        list:res.data.data.list,
                        hasMore:res.data.data.hasMore,
                        page:res.data.data.page+1
                    })
                    //如果搜索结果为空 
                    if(res.data.data.list.length==0){
                        that.setData({
                            displayNone:true
                        })
                    }
                    else{
                        that.setData({
                            displayNone:false
                        })
                    }
                    console.log('请求成功')
                }
            },
            complete:function(res){
                that.setData({
                    displayLoading:false   //请求结束后隐藏loading动画
                })
            }
        })
    },
    //表单提交事件处理
    onsubmit:function(e){
        var that = this;
        //把之前的搜索结果清空
        that.setData({
            page:0,
            list:[]
        })
        var keyword = e.detail.value.keyword;
        console.log('submit')
        that.search(keyword);
    },

    loadMore:function(){
        var that = this;
        var keyword = that.data.keyword;
        keyword = func.trim(keyword);
        if(!keyword)  //?
            return;
        console.log('load more():'+keyword);

        var that = this;
        //若已全部加载完
        if(!that.data.hasMore){
            that.setData({
                displayNoMore:true  //显示没有更多了
            });
            that.updateAnimation();
            setTimeout(function(){
                that.setData({
                    displayNoMore:false,
                    displayLoading:false
                });
            },1500)
            return;
        }
        //否则继续加载
        that.setData({
            displayLoading:true  //显示加载动画
        })
        setTimeout(nextPage,1500);
        function nextPage(){
            wx.request({
                url:that.data.searchURL+'?page='+that.data.page+'&keyword='+keyword,   //?keyword=keyword&page=page
                header:{'Content-Type':'application/json'},
                method:'GET',
                success:function(res){
                    that.setData({
                        list:that.data.list.concat(res.data.data.list),
                        hasMore:res.data.data.hasMore,
                        page:res.data.data.page+1,  //下次请求时的页码
                        displayLoading:false
                    })
                    console.log('搜索加载更多 请求成功');
                },
                fail:function(res){
                    console.log('搜索加载更多 请求失败');
                },
                complete:function(){
                    console.log('搜索加载更多 请求完成')
                    that.setData({
                        displayLoading:false,
                    });
                
                }
            });
        }
        

    },
    bindScroll:function(e){
        var that = this;
        // 滚动到一定高度后出现“回到顶部按钮”
        var ypos = e.detail.scrollTop;
        var threshold = 2*that.data.winHeight; //阈值为两屏
        //var threshold = 100;
        if(ypos > threshold)
            that.setData({
                displayBackTop:true
            });
        else
            that.setData({
                displayBackTop:false
            });
        that.setData({
            topPos:e.detail.scrollTop
        });
    },
    backToTop:function(){
        var that = this;
        
        that.setData({
            topPos:0
        })
        console.log(that.data.topPos);
    },
    back:function(){
        wx.redirectTo({
          url: '../home/home',
        })
    },
    updateAnimation(){
        //1000ms内完成展开
        var that = this;
        var delta = 10;   //每50ms展开5%
        updateWidth();
        function updateWidth(){
            var width = that.data.updateWidth;
            if(width>=100){
                setTimeout(function(){
                that.setData({
                    displayUpdate:false,
                    updateWidth:0
                });

                },500);   //停半秒
                return;
            }
            that.setData({
                updateWidth:width+delta
            });
            setTimeout(updateWidth,50);
        }
    },

    //输入事件处理
    oninput:function(e){
        var that = this;
        that.setData({
            page:0
        })
        var keyword = e.detail.value;
        keyword = func.trim(keyword);
        console.log('test keyword：');
        console.log(keyword)
        that.setData({
            keyword:keyword
        })
        //that.search(keyword);
    },


})