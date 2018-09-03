// type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    lineHeight:0,
    opacity01:0.55,
    opacity02:0.55,
    opacity03:0.55,
    opacity04:0.55
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var height = wx.getSystemInfoSync().windowHeight
    this.setData({
      height: height
    })

    this.setData({
      lineHeight: height / 2 + 'px'
    })

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

  changeColor:function(e){
    var type = e.currentTarget.id
    if (e.type == "touchstart"){
      if (type == 1) {
        this.setData({
          opacity01: 0.85
        })
      } else if (type == 2) {
        this.setData({
          opacity02: 0.85
        })
      } else if (type == 3) {
        this.setData({
          opacity03: 0.85
        })
      }else{
        this.setData({
          opacity04: 0.85
        })
      }
    }else{
      this.setData({
        opacity01: 0.55
      })
      this.setData({
        opacity02: 0.55
      })
      this.setData({
        opacity03: 0.55
      })
      this.setData({
        opacity04: 0.55
      })
     //跳转页面
      wx.navigateTo({
        url: '../typeList/typeList?type='+type
      })

    }
  }

})