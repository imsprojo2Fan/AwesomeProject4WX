// pages/mineDetail/mineDetail.js
var app = getApp()
var that, title,historys,nickName,email,content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historys:[],
    height:0,
    tip:"暂无记录",
    hideHistorys:true,
    searchType:"电影",
    wishes:true,
    val:"",
    feedback:true,
    qrcode:true,
    qrcodeUrl:"https://wx.zooori.cn/pic/qrcode.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    //设置页面高度
    this.getSys()
    var dType = options.type;
    console.log(dType)
    if(dType==1){//观看记录
      this.setData({
        hideHistorys:false
      })
      title = "查看记录"
      historys = wx.getStorageSync('historys') || []
      if(historys.length>0){
        this.setData({
          historys: historys
        })
        this.setData({
          tip:"没有更多了"
        })
      }
      
    }else if(dType==2){
      title = "一些留言"
      this.setData({
        wishes:false
      });

    }else if(dType ==3){
      title = "建议反馈"
      this.setData({
        feedback: false
      });
    }else{
      title = "分享链接"
      this.setData({
        qrcode: false
      });
    }

    wx.setNavigationBarTitle({
      title: title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取手机信息
  getSys: function () {
    var that = this;
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
      success: function (res) {
        //设置变量值
        that.setData({
          height: res.windowHeight
        })
      }
    })
  },
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    var dType = e.currentTarget.dataset.type
    console.log(dType)
    //跳转页面
    wx.navigateTo({
      url: '../detail/detail?id=' + id + "&type=" + dType
    })
  },
  changeSearchType: function () {
    var types = ['电影', "电视剧", "综艺", "动漫","纪录片"];
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function (res) {
        if (!res.cancel) {
          that.setData({
            searchType: types[res.tapIndex]
          })
        }
      }
    })
  },
  inputVal: function (e) {
    var dType = e.currentTarget.dataset.type;
    var val = e.detail.value;
    if (dType == "nickName") {
      nickName = val.trim();
    } else if (dType == "email") {
      email = val.trim();
    } else {
      content = val.trim();
    }
  },
  submit: function (e) {
    if (!nickName) {
      wx.showModal({
        title: '提示',
        content: '我们好像很想知道您的称谓',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }
    if (!email) {
      wx.showModal({
        title: '提示',
        content: '邮箱不能为空喔!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }

    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (!reg.test(email)) {
      wx.showModal({
        title: '提示',
        content: '邮箱格式貌似不正确呢!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    if (!content) {
      wx.showModal({
        title: '提示',
        content: '要不，写点描述我能找得更快',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }

    that.setData({
      isDisplay: 'block',
      isHide: true
    })

    wx.request({
      url: "https://wx.zooori.cn/wx/feedback/wishes",
      data: {
        type:1,
        nickName: nickName,
        email: email,
        description: content
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if (res.data.code == 1) {
          that.setData({
            val: ""
          })
          wx.showModal({
            title: '成功提醒',
            content: '您的请求已成功提交',
            showCancel:false
          })
        }
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none',
          isHide: false
        })
      }
    })
  },
  advise: function (e) {
    if (!email) {
      wx.showModal({
        title: '提示',
        content: '邮箱不能为空喔!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }

    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (!reg.test(email)) {
      wx.showModal({
        title: '提示',
        content: '邮箱格式貌似不正确呢!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    if (!content) {
      wx.showModal({
        title: '提示',
        content: '我们会诚恳的对待您的每一条建议',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }

    that.setData({
      isDisplay: 'block',
      isHide: true
    })

    wx.request({
      url: "https://wx.zooori.cn/wx/feedback",
      data: {
        type: -1,
        nickName: nickName,
        email: email,
        description: content
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if (res.data.code == 1) {
          that.setData({
            val: ""
          })
          wx.showModal({
            title: '成功提醒',
            content: '您的建议已成功提交',
            showCancel: false
          })
        }
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none',
          isHide: false
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      // 预览的图片http链接 把字符串转数组。
      urls: that.data.qrcodeUrl.split(',')
    })
  }
})