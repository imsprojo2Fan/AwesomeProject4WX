// pages/detail.js
var app
var that
var testUrl = 'http://localhost:7080/wx/resource/list4item'
var formalUrl = 'https://wx.zooori.cn/wx/resource/list4item'
var commentUrl = 'https://wx.zooori.cn/wx/comment/list'
var commentAddUrl = 'https://wx.zooori.cn/wx/comment/add'
var nickName,email,content;
var GlobalId = 0;
var GlobalName;
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
    comments:0,
    commensArr:[],
    val:"",
    hideTip:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app = getApp()
    that = this
    var id = options.id
    GlobalId = id;
    nickName = "" ;email = ""; content="";    
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
        //单剧集处理
        var obj = data[0]
          /*设置title*/
          wx.setNavigationBarTitle({
            title: obj.name
          })
        GlobalName = obj.name;
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
        //获取评论列表
        that.requestComment(id)
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
  requestComment: function (id) {
    wx.request({
      url: commentUrl,
      data: {
        id: id,
        pageNow:1,
        pageSize:1000
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        for(var i=0;i<data.length;i++){
          var nickName = data[i].nickName;
          if(nickName.length>10){
            data[i].nickName = nickName.substring(0,10)+"...";
          }
          var time = data[i].created;
          data[i].created = that.getDateDiff(time);
        }
        that.setData({
          comments:data.length,
          commentArr:data
        })
        if(data.length==0){
          that.setData({
            hideTip:false
          })
        }else{
          that.setData({
            hideTip: true
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
  getDateDiff:function(dateStr){
    var publishTime = that.getDateTimeStamp(dateStr) / 1000,
      d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = parseInt(new Date().getTime() / 1000),
      d,

      date = new Date(publishTime * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }
    if (H < 10) {
      H = '0' + H;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
      return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
      if (d_seconds <= 0) {
        return '刚刚发表';
      } else {
        return d_seconds + '秒前';
      }
    } else if (d_days >= 3 && d_days < 30) {
      return M + '-' + D + '&nbsp;' + H + ':' + m;
    } else if (d_days >= 30) {
      return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    }
  },
  getDateTimeStamp: function (dateStr){
    return Date.parse(dateStr.replace(/-/gi, "/"));
  },
  inputVal:function(e){
    var dType = e.currentTarget.dataset.type;
    var val = e.detail.value;
    if(dType=="nickName"){
      nickName = val.trim();
    }else if(dType=="email"){
      email = val.trim();
    }else{
      content = val.trim();
    }
  },
  submit:function(e){
    if(!nickName){
      wx.showModal({
        title: '提示',
        content: '我们好像很想知道您的称谓',
        showCancel:false,
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
    if(!content){
      wx.showModal({
        title: '提示',
        content: '我猜您肯定忘了写一些感想!',
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
      url: commentAddUrl,
      data: {
        rid: GlobalId,
        nickName: nickName,
        email: email,
        content:content,
        count:that.data.comments
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if(res.data.code==1){
          that.setData({
            val:""
          })
          that.requestComment(GlobalId,1,1000);
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
  toResponse:function(){
    wx.showModal({
      title: '提示',
      content: '貌似是资源不可播放了是吗?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {

          that.setData({
            isDisplay: 'block',
            isHide: true
          })

          wx.request({
            url: "https://wx.zooori.cn/wx/resource/report",
            data: {
              id: GlobalId,
              name: GlobalName
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            //header: { 'content-type': 'application/json' },// 默认值
            success: function (res) {
              var data = res.data.data
              if (res.data.code == 1) {
                wx.showModal({
                  title: '提示',
                  content: '小哥哥将尽快处理问题呢 /比❤',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
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
        }
      }
    })
  }
})