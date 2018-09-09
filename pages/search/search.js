// search.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplay: 'block',
    //设置轮播----------------------------------开始
    imgUrls: [],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0,
    //设置轮播----------------------------------结束
    searchType: "全部",
    hotItems: [],
    hotTagItems: ["动作", "科幻", "喜剧","犯罪","武侠"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.getHotSearch();
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
  changeSearchType: function () {
    var types = ['全部','电影',"电视剧","综艺","动漫"];
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
  search: function (e) {
    var that = this
    var keyword = e.detail.value.keyword
    if (keyword == '') {
      message.show.call(that, {
        content: '请输入内容',
        icon: 'info',
        duration: 1500
      })
    } else {
      //跳转页面
      //跳转页面
      wx.navigateTo({
        url: '../searchList/searchList?key=' + keyword
      })
    }
  },
  searchByTag: function (e) {
    var that = this
    var keyword = e.currentTarget.dataset.keyword
    //跳转页面
    wx.navigateTo({
      url: '../searchList/searchList?key=' + keyword
    })
  },
  getHotSearch:function(){
    var timestamp = new Date().getTime();
    var num = Math.floor(Math.random() * 3 + 1);//获取随机数
    console.log(num)
    var colVal = "";
    if (num==1){
      colVal = "views";
    } else if (num == 2){
      colVal = "collects";
    } else {
      colVal = "likes";
    }
    wx.request({
      url: "https://wx.zooori.cn/wx/resource/list4order",
      data: {
        col: colVal
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data
        that.setData({
          hotItems:data
        })
        //设置轮播图--------------开始
        var arr = [];
        for(var i=0;i<6;i++){

          if(i==0){
            var obj = {};
          }

          if(i<3){
            if(i==0){
              obj.item01 = data[i]; 
            }
            if (i == 1) {
              obj.item02 = data[i];
            }
            if (i == 2) {
              obj.item03 = data[i];
              arr.push(obj);
            }
            
          }else{
            if (i == 3) {
              var obj = {};
            }
            if (i == 3) {
              obj.item01 = data[i];
            }
            if (i == 4) {
              obj.item02 = data[i];
            }
            if (i == 5) {
              obj.item03 = data[i];
              arr.push(obj);
            }
          }
        }
        console.log(arr)
        that.setData({
          imgUrls:arr
        })
        //设置轮播图--------------结束

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
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    var dType = e.currentTarget.dataset.type
    console.log(dType)
    //跳转页面
    wx.navigateTo({
      url: '../detail/detail?id=' + id + "&type=" + dType
    })
  }
})