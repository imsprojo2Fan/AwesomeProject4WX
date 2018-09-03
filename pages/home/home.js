// home.js
var testUrl = 'http://localhost:7080/wx/resource/list'
var formalUrl = 'https://wx.zooori.cn/wx/resource/list'
var that
var isInit4series =  true
var isInit4varity = true
var isInit4animate = true
var reBottom = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //设置轮播----------------------------------开始
    imgUrls: [
      'https://wx.zooori.cn/pic/slide01.jpg',
      'https://wx.zooori.cn/pic/slide02.jpg',
      'https://wx.zooori.cn/pic/slide03.jpg',
      'https://wx.zooori.cn/pic/slide04.jpg',
      'https://wx.zooori.cn/pic/slide05.jpg'
    ],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 800,
    previousMargin: 0,
    nextMargin: 0,
    //设置轮播----------------------------------结束

    //初始化数据list
    list4movie: [],  //将list的数据传到前台wxml页面中
    list4series:[],
    list4varity:[],
    list4animate:[],
    hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    //请求电影列表
    this.requestData(1);
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
    this.queryMultipleNodes('#seriesHeader');
    //this.getUserInfoFun();
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
    wx.showToast({
      title: '你想看些什么呢？',
      icon: 'none',
      duration: 1000
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    reBottom++
    /*if (reBottom==1&&isInit4series) {
      isInit4series = false
      this.requestData(2);
    }

    if (reBottom==2&isInit4varity) {
      isInit4varity = false
      this.requestData(3);
    }

    if (reBottom==3&&isInit4animate) {
      isInit4animate = false
      this.requestData(4);
    }*/
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //轮播图-------------------------------------------------开始
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  //轮播图-------------------------------------------------结束

  toDetail:function(e){
    console.log(e);
  },

  getUserInfoFun: function () {
    var S = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo);
        //do anything
      },
      fail: S.showPrePage
    })
  },

  queryMultipleNodes: function (id) {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(id).boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      //console.log(res);
      //取高度
      //console.log(res[0].top);
      return res[0].top;
    })
  },

  onPageScroll: function (e) {
    
    var top = parseInt(e.scrollTop)
    //console.log(top)
    if (top > 2000 && isInit4series){
      isInit4series = false
      this.requestData(2);
    }

    if (top > 3000 && isInit4varity) {
      isInit4varity = false
      this.requestData(3);
    }

    if (top > 4000 && isInit4animate) {
      isInit4animate = false
      this.requestData(4);
    }
  },


  requestData:function(dataType){
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading'
    })

    wx.request({
      url: formalUrl,
      data: {
        'pageNow': 1,
        'pageSize': 12,
        'type': dataType
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        console.log(res.data.data)
        if(dataType==1){
          that.setData({
            list4movie: res.data.data,//将表中查询出来的信息传给list
          })
        }else if(dataType==2){
          that.setData({
            list4series: res.data.data,//将表中查询出来的信息传给list
          })
        } else if (dataType == 3) {
          that.setData({
            list4varity: res.data.data,//将表中查询出来的信息传给list
          })
        }else{
          that.setData({
            list4animate: res.data.data,//将表中查询出来的信息传给list
          })
          that.setData({
            hidden:false
          })
        }
        
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading();
      }
    })
  }
})