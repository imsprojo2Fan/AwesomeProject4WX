// mine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'../../dist/images/unlogin.png',
    hideBtn:false,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var height = app.globalData.windowH
    this.setData({
      height: height
    })
    if (app.globalData.userInfo) {
      this.setData({
        avatarUrl:app.globalData.userInfo.avatarUrl,
        userInfo: app.globalData.userInfo,
        hideBtn: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          avatarUrl: app.globalData.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hideBtn: true
        })
        app.globalData.userInfo = res.userInfo
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hideBtn: true
          })
        }
      })
    }
  
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
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e)
    console.log(app.globalData.code);
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      hideBtn: true
    })

    //var l = 'http://localhost:7080/wx/code4session';
    var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.appid + '&secret=' + app.globalData.secret + '&js_code=' + app.globalData.code + '&grant_type=authorization_code';
    wx.request({
      url: l,
      data: {
        code: app.globalData.code
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {//获取openid
        app.globalData.userInfo.openId = res.data.openid;
        wx.setStorageSync('userInfo', app.globalData.userInfo);//存储用户信息  

        var userInfo = app.globalData.userInfo;
        //存储用户信息至服务器
        wx.request({
          url: 'https://wx.zooori.cn/wx/save4wx',
          method: "POST",
          data: {
            openid: userInfo.openId,
            nickName: userInfo.nickName,
            gender: userInfo.gender,
            avatar:userInfo.avatarUrl,
            province: userInfo.province,
            city: userInfo.city
          },
          success: function (res) {
            console.log(res);
          }
        })
      }
    });
    
  },
  toDetail:function(e){
    var dType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../mineDetail/mineDetail?type='+dType,
    })
  }

})