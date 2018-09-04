// pages/detail.js
var app
var that
var formalUrl = 'https://wx.zooori.cn/wx/resource/list4item'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplay: 'block',
    imgSrc:'',
    director:"",
    actor:"",
    publish:"",
    length:"",
    description:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app = getApp()
    that = this
    var id = options.id
    var dType = options.type
    this.requestData(dType,id)
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
  requestData: function (dataType, id) {
    wx.request({
      url: formalUrl,
      data: {
        type: dataType,
        id: id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        console.log(data)
        if(data.length==1){//单剧集处理
        var obj = data[0]
          /*设置title*/
          wx.setNavigationBarTitle({
            title: obj.name
          })
          var name = obj.name
          if(name.length>10){
            name = name.substring(0,10)+"..."
          }
          var actor = obj.actor
          if(actor.length>13){
            actor = actor.substring(0,20)+"..."
          }
          var description = obj.description.trim()
          description = description.replace(/[\r\n]/g, "");
          that.setData({
            imgSrc:obj.imgSrc2,
            name:name,
            director:obj.director,
            actor:actor,
            publish:obj.publish,
            length:obj.length,
            description:description
          })

        }
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none'
        })
      }
    })
  }
})