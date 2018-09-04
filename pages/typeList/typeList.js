// typeList.js
var app
var testUrl = 'http://localhost:7080/wx/resource/list'
var formalUrl = 'https://wx.zooori.cn/wx/resource/list'
var refreshUrl = 'https://wx.zooori.cn/wx/resource/list4refresh'
var that
var isInit4series = true
var isInit4varity = true
var isInit4animate = true
var gType
var pageNow = 1
var totalPage = 0
var gData = []
var lastId = 0
var height = wx.getSystemInfoSync().windowHeight

let t1 = 0;
let t2 = 0;
let timer = null; // 定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //初始化数据list
    list: [],  //将list的数据传到前台wxml页面中
    hidden: true,
    isHide:true,
    loadingHidden: false,
    tabScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app = getApp()
    that = this
    gData = []
    pageNow = 1
    lastId = 0
    //请求电影列表
    console.log(options.type)
    gType = options.type
    console.log(gType)
    var title
    if (gType==1){
      title = "电影列表"
    } else if (gType==2){
      title = "电视剧列表"
    } else if (gType == 3){
      title = "综艺列表"
    }else{
      title = "动漫列表"
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.requestData(gType,pageNow);
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: refreshUrl,
      data: {
        id: lastId,
        type:gType
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if (data.length == 0 ) {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          return
        } 
        gData = data.concat(gData)
        that.setData({
          list: gData,//将表中查询出来的信息传给list
        })
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    return
    if(pageNow>totalPage){
      return
    }
    console.log(totalPage)
    pageNow++
    this.requestData(gType,pageNow);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestData: function (dataType,pageNow) {
    wx.request({
      url: formalUrl,
      data: {
        'pageNow': pageNow,
        'pageSize': app.data.pageSize,
        'type': dataType
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if(data.length==0&&pageNow==1){
          that.setData({
            hidden: false
          })
          that.setData({
            tip: "暂无数据"
          })
        } else if (data.length == 0){
          that.setData({
            hidden: false
          })
          that.setData({
            tip: "没有更多数据了"
          })
        }
        if(pageNow==1){
          lastId = data[0].id//用于刷新数据
        }
        gData = gData.concat(data)
        var pageSize = app.data.pageSize
        totalPage = parseInt((res.data.recordsTotal + pageSize - 1) / pageSize);
        that.setData({
          list: gData,//将表中查询出来的信息传给list
        })

      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },
  onPageScroll: function (e) {
    console.log(e);
    if (e.scrollTop > height) {
      this.setData({
        isHide: false
      });
    } else {
      this.setData({
        isHide: true
      });
    }

    if (pageNow > totalPage) {
      return
    }

    setTimeout(function(){},1000)
    pageNow++
    that.requestData(gType, pageNow);
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.setData({
        isHide: true
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
 
})