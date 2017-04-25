var app = getApp();
const func = require('../../func.js');
const config = require('../../config.js');
Page({
    data:{
        winHeight:0,
        winWidth:0,
        
        pictureSrc:'',
        pictureWidth:0,  //px
        pictureHeight:0,
        scale:1,

        originWidth:0,
        originHeight:0,

        fixTop:0,
        fixLeft:0,

        canvasHeight: 398,  //rpx
        canvasAspect:750/398,
        pictureAspect:1,

        px2rpx:1,

        startY:0,
        startX:0,
        startDistance:0,
        dragSensibility:1,

        displayImage:true,

        uploadUrl:'',  //上传文件到oss地址
        changeCoverUrl:config.host+'/me/userCover'
    },
    onLoad:function(options){
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winHeight:res.windowHeight,
                    winWidth:res.windowWidth,
                    px2rpx:750/res.windowWidth
                })
            }
        })
        that.setData({
            pictureSrc:options.pictureSrc
        });
        wx.getImageInfo({
            src:options.pictureSrc,
            success:function(res){
                that.setData({
                    originWidth:res.width,
                    originHeight:res.height,
                    pictureAspect:res.width/res.height
                })
                // 不能留黑
                if(that.data.pictureAspect > that.data.canvasAspect){
                    //扁图片，高度适应
                    that.setData({
                        pictureHeight:398 / that.data.px2rpx,
                        pictureWidth: res.width * ((398/that.data.px2rpx)/res.height),
                        scale:(398/that.data.px2rpx)/res.height
                    })
                    that.setData({
                        fixTop:339
                    })
                }
                else{
                    //竖长图片，宽度适应
                    that.setData({
                        pictureWidth:that.data.winWidth,  //px
                        pictureHeight:res.height * (that.data.winWidth / res.width),  //px
                        scale:that.data.winWidth / res.width
                    })
                    that.setData({
                        fixTop:339 + (that.data.canvasHeight / 2) - (that.data.pictureHeight/2)*that.data.px2rpx  //rpx
                    })
                }
                
            }
        })

    },
    EulerDis:function(p1,p2){
        var x1 = p1.clientX;
        var y1 = p1.clientY;
        var x2 = p2.clientX;
        var y2 = p2.clientY;
        var distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
        return distance;
    },
    touchstart:function(e){
        var that = this;
        //清楚原来的绘制
        that.clearCanvas()
        that.setData({
            startY:e.touches[0].clientY,
            startX:e.touches[0].clientX
        })
        if(e.touches.length > 1){
            var distance = that.EulerDis(e.touches[0],e.touches[1]);
            that.setData({
                startDistance:distance
            })
            console.log('多触点')
        }
    },
    touchmove:function(e){
        console.log('touch move')
        var that = this;
        var currentY = e.touches[0].clientY;
        var currentX = e.touches[0].clientX;
        var deltaY = currentY - that.data.startY;
        var deltaX = currentX - that.data.startX;
        var y = that.data.fixTop + deltaY/that.data.dragSensibility;
        var x = that.data.fixLeft + deltaX/that.data.dragSensibility
        that.setData({
            fixTop:y,
            fixLeft:x
        })
        //that.redraw();
        if(e.touches.length > 1){
            var currentDistance = that.EulerDis(e.touches[0],e.touches[1]);
            var distanceDiff = currentDistance - that.data.startDistance;
            var newScale = that.data.scale + distanceDiff * 0.005;
            that.setData({
                pictureWidth:that.data.originWidth*newScale,
                pictureHeight:that.data.originHeight*newScale
            })
            console.log('多触点move')
        }
        that.setData({
            startX:currentX,
            startY:currentY
        })
    },
    touchend:function(e){
        var that = this;
        that.setData({
            scale:that.data.pictureWidth/that.data.originWidth
        })
        if(that.data.pictureAspect > that.data.canvasAspect){
            //扁图
            //放大的边界: 如果原图高>canvasHeight, 最大为原图；如果原图高<canvasHeight，最大为canvasHeight
            var maxHeight = Math.max(that.data.originHeight, that.data.canvasHeight);
            var maxScale = maxHeight / that.data.originHeight;
            if(that.data.pictureHeight > maxHeight){
                that.setData({
                    scale:maxSclae,
                    pictureWidth: that.data.originWidth * maxSclae,
                    pictureHeight: that.data.originHeight * maxSclae
                })
            }
            //缩小的边界，pictureHeight充满画布
            if(that.data.pictureHeight < that.data.canvasHeight/that.data.px2rpx){
                that.setData({
                    scale: (that.data.canvasHeight/that.data.px2rpx) / that.data.originHeight
                });
                that.setData({
                    pictureHeight: that.data.canvasHeight/that.data.px2rpx,
                    pictureWidth: that.data.originWidth * that.data.scale
                })
            }
        }
        else{
            //竖长图
            //放大的边界
            var maxWidth = Math.max(that.data.originWidth, that.data.winWidth);
            var maxScale = maxWidth/that.data.originWidth;
            if(that.data.pictureWidth > maxWidth){
                that.setData({
                    scale: maxScale,
                    pictureWidth: that.data.originWidth * maxScale,
                    pictureHeight: that.data.originHeight * maxScale
                })
            }
            //缩小的边界,pictureWidth充满屏幕
            if(that.data.pictureWidth < that.data.winWidth){
                that.setData({
                    scale: that.data.winWidth / that.data.originWidth
                })
                that.setData({
                    pictureWidth: that.data.winWidth,
                    pictureHeight: that.data.originheight * that.data.scale
                })
            }
        }

        //平移边界
        //左右不能为空
        if(that.data.fixLeft > 0){
            that.setData({
                fixLeft:0
            })
        }
        if(that.data.fixLeft < (that.data.winWidth-that.data.pictureWidth)*that.data.px2rpx){
            that.setData({
                fixLeft:(that.data.winWidth-that.data.pictureWidth)*that.data.px2rpx
            })
        }

        if(that.data.pictureHeight*that.data.px2rpx>that.data.canvasHeight){
            //边界检测:图上边不低于canvas上边界，图下边不低于canvas下边界
            if(that.data.fixTop > 339){
                that.setData({
                    fixTop:339
                })
            }
            if(that.data.fixTop<(339+that.data.canvasHeight-that.data.pictureHeight*that.data.px2rpx)){
                that.setData({
                    fixTop:(339+that.data.canvasHeight-that.data.pictureHeight*that.data.px2rpx)
                })
            }
        }
        else{
            //仍然保持垂直居中状态
            that.setData({
                //fixTop:339 + (that.data.canvasHeight / 2) - (that.data.pictureHeight/2)*that.data.px2rpx  //rpx
                fixTop:339  //垂直方向不变，上下不能为空
            })
            
        }
        //that.redraw();
    },
    redraw:function(){
        var that = this;
        console.log('draw');
        // fixTop对应的canvas坐标
        var y = (that.data.fixTop-339)/that.data.px2rpx
        var x = that.data.fixLeft/that.data.px2rpx
        var context = wx.createContext();
        context.clearActions();
        context.setFillStyle("rgba(0,0,0,1)");
        context.rect(0, 0, that.data.winWidth, that.data.canvasHeight);
        context.fill()
        context.scale(that.data.scale,that.data.scale);
        context.drawImage(that.data.pictureSrc,x/that.data.scale,y/that.data.scale);
        wx.drawCanvas({
            canvasId:'small',
            actions:context.getActions()
        })
    },
    clearCanvas:function(){
        var that = this;
        var context = wx.createContext();
        context.clearActions();
        context.clearRect(0,0,that.data.winWidth,that.data.canvasHeight/that.data.px2rpx);
        wx.drawCanvas({
            canvasId:'small',
            actions:context.getActions()
        })
    },
    finish:function(){
        var that = this;
        that.setData({
            displayImage:!that.data.displayImage
        })
        that.redraw()
    },
    //点击取消
    cancel:function(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    //点击选取
    select:function(){
        console.log('select');
        //重绘canvas
        var that = this;
        //that.redraw();
        // 把canvas保存成临时文件
        var tempPath;

        /* 裁剪参数 */
        console.log('原图宽高px:'+that.data.originWidth + ',' + that.data.originHeight);
        var x = (-that.data.fixLeft)/(that.data.px2rpx*that.data.scale); //px
        var y = (339 - that.data.fixTop)/(that.data.px2rpx*that.data.scale);  //px

        var w = 750/(that.data.px2rpx * that.data.scale);
        var h = that.data.canvasHeight/(that.data.px2rpx * that.data.scale);
        console.log('起点:' + Math.round(x) + ',' + Math.round(y));
        console.log('裁剪区域:' + Math.floor(w) + ',' + Math.floor(h)); 

        uploadClipImage(that.data.pictureSrc,app.globalData.myInfo.id,Math.round(x),Math.round(y),Math.floor(w),Math.floor(h));
        // wx.canvasToTempFilePath({
        //     canvasId:'small',
        //     success: function(res) {
        //         if(res.tempFilePath){
        //             tempPath = res.tempFilePath;
        //             console.log('canvas to file OK:' + tempPath)
        //             app.globalData.myInfo.userCoverSrc = tempPath;
        //             saveAndUpload(tempPath);
        //             // wx.navigateBack({
        //             //   delta: 1
        //             // })


        //         }
                
        //     },
        //     fail:function(res){
        //         console.log('canvas to file failed')
        //         console.log(res)
        //     }
            
        // })

        function saveAndUpload(path){
            wx.saveFile({
                tempFilePath: path,
                success: function(res) {
                    var savedFilePath = res.savedFilePath
                    console.log('save success:'+savedFilePath);
                    
                    wx.showToast({
                        title:'正在修改',
                        icon:'loading',
                        duration:10000
                    });

                    var formData={
                        userId:app.globalData.myInfo.id,
                        coverSrc:savedFilePath
                    }
                    
                    wx.uploadFile({
                        url:that.data.changeCoverUrl,
                        filePath:savedFilePath,
                        name:'cover',
                        formData:formData,
                        success: function(res){
                            console.log('上传文件到服务器成功')
                            console.log(JSON.parse(res.data))
                            if(JSON.parse(res.data).data.isSuccess){
                                console.log('上传封面成功')
                                wx.hideToast()
                                wx.showToast({
                                    title:'修改封面成功',
                                    icon:'success',
                                    duration:1500
                                });
                                setTimeout(function(){
                                    app.globalData.myInfo.userCoverSrc = savedFilePath
                                    wx.setStorageSync('coverSrc', savedFilePath)
                                    wx.navigateBack({
                                        delta: 1, // 回退前 delta(默认为1) 页面
                                    })
                                },1500)
                            }
                        },
                        fail: function(res) {
                            console.log('uploadfile失败')
                            console.log(res)
                            that.postFailWarning();
                        },
                        complete: function() {}
                    })
                    
                },
                fail:function(res){
                    console.log('保存封面失败');
                    that.postFailWarning();
                    console.log(res)
                }
            })
        }

        //上传文件以及裁剪参数，在后台进行裁剪
        function uploadClipImage(filePath,userId,x,y,w,h){
            wx.showToast({
                title:'正在上传封面',
                icon:'loading',
                duration:10000
            })
            var formData={
                userId:userId,
                x:x,
                y:y,
                w:w,
                h:h
            }
            wx.uploadFile({
                url: that.data.changeCoverUrl + '?' + func.json2Form(formData),
                filePath:filePath,
                name:'cover',
                // header: {}, // 设置请求的 header
                //formData: formData,
                success: function(res){
                    console.log(res.data)
                    if(JSON.parse(res.data).data.isSuccess){
                        console.log('上传封面成功');
                        wx.hideToast();
                        wx.showToast({
                            title:'修改封面成功',
                            icon:'success',
                            duration:1500
                        });
                        setTimeout(function(){
                            app.globalData.myInfo.userCoverSrc = JSON.parse(res.data).data.coverSrc
                            wx.setStorageSync('coverSrc', JSON.parse(res.data).data.coverSrc)
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        },1500)
                    }
                },
                fail: function(res) {
                    console.log(res)
                }
            })
        }
    },
    postFailWarning:function(){
        wx.hideToast();
        wx.showModal({
            title: '提示',
            content: '修改失败',
            showCancel:false
        })
    }
    
})