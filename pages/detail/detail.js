// pages/detail.js
var app
var that
var testUrl = 'http://localhost:7080/wx/resource/list4item'
var formalUrl = 'https://wx.zooori.cn/wx/resource/list4item'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplay: 'block',
    playImg:"../../dist/images/play.png",
    imgSrc:'',
    director:"",
    actor:"",
    publish:"",
    length:"",
    description:"",
    dType:"",
    isOn:true,
    isSeriesOn:true,
    series:[],
    blue:"#6195FF",
    isHide:true,
    comments:0
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
        //单剧集处理
        var obj = data[0]
          /*设置title*/
          wx.setNavigationBarTitle({
            title: obj.name
          })
        var director = obj.director;
        if(director.length>11){
          director = director.substring(0,11)+"..."
        }
          var name = obj.name
          if(name.length>10){
            name = name.substring(0,10)+"..."
          }
          var actor = obj.actor
          if(actor.length>13){
            actor = actor.substring(0,15)+"..."
          }
          var description = obj.description.trim()
          description = description.replace(/[\r\n]/g, "");
          var detailType = obj.detailType;
          if(detailType.length>10){
            detailType.substring(0,10)+"..."
          }
          var isOn = obj.isOn;
          var flag = true;
          if(isOn==1){
            flag = false
          }
          that.setData({
            imgSrc:obj.imgSrc2,
            name:name,
            director:director,
            actor:actor,
            publish:obj.publish,
            length:obj.length,
            description:description,
            dType:detailType,
            isOn:flag
          })
        if (data.length>1){//多剧集处理
        for(var i=0;i<data.length;i++){
          var sequence = data[i].sequence
          if (sequence<10){
            sequence = "0" + sequence;
          }
          data[i].sequence = sequence;
        }
          that.setData({
            isSeriesOn:false,
            series:data
          })
        }
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none',
          isHide:false
        })
      }
    })
  },
  changeImg:function(e){
    console.log(e);
    var dType = e.type;
    if(dType=="touchstart"){
      that.setData({
        playImg:"../../dist/images/play_active.png"
      })
    }else{
      that.setData({
        playImg: "../../dist/images/play.png"
      })
    }
  },
  toPlay:function(e){
    var dType = e.type;
    if (dType == "touchstart") {
      that.setData({
        blue: "#fff"
      })
    } else {
      that.setData({
        blue: "#6195FF"
      })
    }
  },
  toBdCloud: function (e) {
    var dType = e.type;
    if (dType == "touchstart") {
      that.setData({
        blue:"#fff"
      })
    } else {
      that.setData({
        blue: "#6195FF"
      })
    }
  },
  toResponse: function (e) {
    var dType = e.type;
    if (dType == "touchstart") {
      that.setData({
        blue: "#fff"
      })
    } else {
      that.setData({
        blue: "#6195FF"
      })
    }
  },
})