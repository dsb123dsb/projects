const config = require('../../config.js');
const func = require('../../func.js');
var app = getApp();
var changeBol = true;
Page({
    data: {
        tempFilePath: '../../image/me/empty@2x.png',
        uploadUrl: 'https://www.treeholeapp.com/wx-picsearch',  //oss地址
        uploadImageInfoUrl: config.host + '/post/submitPost',
        hotTags: [],   //热门标签

        tags: [],
        divisions: '',
        pictureDesc: '',
        pictureTitle: '',

        btnDisableColor: "#eeeeee",
        btnOKColor: "#ea4f16",

        titleOK: false,
        descOK: false,
        tagOK: false,
        hasPicture: false,

        lastTapDiffTime: 0,

        winWidth: app.globalData.systemInfo.windowWidth,
        winHeight: app.globalData.systemInfo.windowHeight
    },
    onLoad: function (options) {
        var that = this;
        console.log('post');
        //图片地址参数
        if (options.pictureSrc) {
            that.setData({
                tempFilePath: options.pictureSrc,
                hasPicture: true
            })
        }

        // 再次进入post页面时，清空之前选择的tag
        app.globalData.postTag = [];
        app.globalData.postDivision = '';
        app.globalData.divisionId = '';
    },
    onShow: function () {
        console.log(app.globalData.postTag);
        console.log(app.globalData.postDivision);
        var that = this;

        if (app.globalData.postTag.length > 0) {
            that.setData({
                tags: app.globalData.postTag,
                tagOK: true
            });
        }
        if (app.globalData.postDivision) {
            that.setData({
                divisions: app.globalData.postDivision,
                divisionOK: true
            });
        }
    },
    goAdd1: function () {
        wx.navigateTo({
            url: '../addTag/addTag'
        })
    },
    goAdd2: function () {
        wx.navigateTo({
            url: '../addDivison/addDivison'
        })
    },
    chooseImage() {
        console.log("chooseImage");
        // if(changeBol){

        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                console.log(that.data.tempFilePath);
                if (res.tempFilePaths) {
                    that.setData({
                        tempFilePath: res.tempFilePaths[0],
                        hasPicture: true
                    })
                }
            },
            fail: function (res) {
                console.log(res);
                console.log("回退");
                // wx.navigateBack({
                //     delta: 1, // 回退前 delta(默认为1) 页面
                // })
            },
            complete: function (res) {
                console.log("完成");
                if (!that.data.hasPicture) {
                    wx.navigateBack({
                        delta: 1, // 回退前 delta(默认为1) 页面
                    })
                }
            }
        })
        //  changeBol = false;
        // }else{
        //     changeBol = true;
        //     // console.log("chooseImage两次")
        // }
    },
    changePicture: function (e) {
        console.log("点击");
        var that = this;
        var curTime = e.timeStamp;
        var lastTime = that.data.lastTapDiffTime;
        console.log(lastTime);
        if (lastTime >= 0) {
            console.log(lastTime);
            // 两次单击间隔<300认为双击
            if (curTime - lastTime < 300) {
                console.log("双击");
                that.chooseImage();
            } else {
                console.log("长按");
                that.chooseImage();
            }
            this.setData({
                lastTapDiffTime: curTime
            })
        } else {
            that.chooseImage();
        }
    },
    postImage: function () {
        var that = this;
        if (!that.data.hasPicture) {
            return;
        }
        var filePath = that.data.tempFilePath;
        if (app.globalData.postDivision.length == 0) {
            wx.showModal({
                title: '提示',
                content: '请选择分类',
                showCancel: false,
            })
        }
        else {
            that.uploadImage(filePath);
        }

    },
    uploadImage(filePath) {
        var that = this;
        wx.showToast({
            title: '正在发布',
            icon: 'loading',
            duration: 10000
        })

        app.checkExpiration();
        var ossToken = app.globalData.ossToken,
            suffix = func.getSuffix(filePath),
            formData = {
                pictureDesc: func.trim(that.data.pictureDesc),
                pictureTitle: func.trim(that.data.pictureTitle),
                tagsList: JSON.stringify(that.data.tags),
                divisionName: JSON.stringify(that.data.divisions),
                divisionId: JSON.stringify(app.globalData.divisionId),
                name: app.globalData.myInfo.name,
                userId: app.globalData.myInfo.id,
            }
        console.log(formData)

        wx.uploadFile({
            //url: that.data.uploadUrl + '?'+ossUrlParams,  //上传文件至OSS
            url: that.data.uploadImageInfoUrl + '?' + func.json2Form(formData),
            filePath: filePath,
            name: 'file',
            //formData:formData,
            success: function (res) {
                console.log('上传文件到服务器成功')
                //console.log(JSON.parse(res.data))
                console.log(res)
                if ((app.globalData.systemInfo.model.split(" ")[0] === "vivo")||(app.globalData.systemInfo.model.split(" ")[0].toLowerCase() === "oppo")) {//适配vivio oppo 图片过大不能发布bug
                    if (res.errMsg.split(":")[1] ==="ok") {
                        console.log('上传图片成功')

                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        }, 1500)

                    }
                    else {
                        that.postFailWarning();
                    }
                } else {
                    if (JSON.parse(res.data).data.isSuccess) {
                        console.log('上传图片成功')

                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        }, 1500)

                    }
                    else {
                        that.postFailWarning();
                    }
                }

            },
            fail: function (res) {
                console.log('uploadfile失败')
                console.log(res)
                that.postFailWarning();
            },
            complete: function () { }
        })

    },

    checkTitleLength: function (e) {
        var value = e.detail.value,
            that = this;
        that.setData({
            pictureTitle: value
        })
        if (value.length > 0) {
            that.setData({
                titleOK: true,
            });
        } else {
            that.setData({
                titleOK: false
            });
        }

    },
    checkDescLength: function (e) {
        var value = e.detail.value,
            that = this; console.log('描述:' + value)
        that.setData({
            pictureDesc: value
        })
        if (value.length > 0) {
            that.setData({
                descOK: true
            });
        } else {
            that.setData({
                descOK: false
            });
        }
    },
    deleteTag: function (e) {
        var that = this,
            tagName = e.target.dataset.name,
            index = app.globalData.postTag.indexOf(tagName); console.log(e.target)
        app.globalData.postTag.splice(index, 1);
        console.log(app.globalData.postTag);
        console.log('删除：' + tagName);
        that.setData({
            tags: app.globalData.postTag,
        });
        if (that.data.tags.length === 0) {
            that.setData({
                tagOK: false
            });
        }

    },
    // deleteDivison: function (e) {
    //     var that = this;
    //     app.globalData.postDivision='';
    //     console.log(app.globalData.postDivision);
    //     console.log('删除：' + that.data.divisions);
    //     that.setData({
    //         divisions:'',
    //     });
    // },
    postFailWarning: function () {
        wx.hideToast();
        wx.showModal({
            title: '提示',
            content: '发布失败',
            showCancel: false
        })
    }
})